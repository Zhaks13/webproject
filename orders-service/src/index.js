const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { verifyToken, requireAdmin } = require('./middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();

function normalizeOrderStatus(status) {
    return typeof status === 'string' ? status.trim().toUpperCase() : status;
}

function parseOptionalFloat(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
}

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { files: 5 }
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/auth', authRoutes);

// Получение моих заказов
app.get('/orders/my', verifyToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Получение списка всех заказов
app.get('/orders', verifyToken, requireAdmin, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// 🔥 Создание нового заказа (Поддержка как авторизованных, так и гостей + кастомные)
app.post('/orders', upload.array('images', 5), async (req, res) => {
    try {
        let userId = null;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.split(' ')[1];
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super-secret-key');
                userId = decoded.userId;
            } catch (e) {
                console.error("Token verification failed for order creation", e);
            }
        }

        const {
            productId,
            name,
            phone,
            address,
            whatsapp,
            quantity,
            paymentMethod,
            comment,
            selectedOptions,
            adminComment,
            source,
            totalPrice
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: 'Не хватает обязательных полей (имя, телефон)' });
        }

        const data = {
            name,
            phone,
            address: address || null,
            whatsapp: !!whatsapp,
            quantity: quantity ? parseInt(quantity) : 1,
            paymentMethod: paymentMethod || 'CASH',
            comment: comment || null,
            adminComment: adminComment || null,
            source: source || 'WEB',
            totalPrice: parseOptionalFloat(totalPrice),
            selectedOptions: typeof selectedOptions === 'string' ? JSON.parse(selectedOptions) : (selectedOptions || {}),
            status: 'NEW',
            images: req.files ? req.files.map(f => `/uploads/${f.filename}`) : []
        };

        if (productId) {
            data.productId = parseInt(productId);
        }

        if (userId) {
            data.userId = parseInt(userId);
        }

        const order = await prisma.order.create({ data });

        res.status(201).json(order);

    } catch (error) {
        console.error('CREATE ORDER ERROR:', error);
        res.status(500).json({ error: error.message });
    }
});

// Обновление статуса заказа
app.put('/orders/:id/status', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const status = normalizeOrderStatus(req.body.status);

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Заказ не найден или ошибка обновления' });
    }
});

app.patch('/orders/:id', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const data = {};

        if (Object.prototype.hasOwnProperty.call(req.body, 'status')) {
            const status = normalizeOrderStatus(req.body.status);

            if (!status) {
                return res.status(400).json({ error: 'Status must be a non-empty string' });
            }

            data.status = status;
        }

        if (Object.prototype.hasOwnProperty.call(req.body, 'adminComment')) {
            data.adminComment = req.body.adminComment ? String(req.body.adminComment) : null;
        }

        if (Object.keys(data).length === 0) {
            return res.status(400).json({ error: 'Nothing to update' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data
        });

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Order not found or update failed' });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Orders service running on port ${PORT}`);
});
