const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { verifyToken, requireAdmin } = require('./middleware/auth');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

// 🔥 Создание нового заказа (FIXED)
app.post('/orders', verifyToken, async (req, res) => {
    try {
        console.log('BODY:', req.body);
        console.log('USER:', req.user);

        const {
            productId,
            name,
            phone,
            address,
            whatsapp,
            quantity,
            paymentMethod,
            comment,
            selectedOptions
        } = req.body;

        const userId = req.user.userId;

        if (!productId || !name || !phone) {
            return res.status(400).json({ error: 'Не хватает обязательных полей' });
        }

        const order = await prisma.order.create({
            data: {
                name,
                phone,
                address,
                whatsapp,
                quantity: quantity ? parseInt(quantity) : 1,
                paymentMethod,
                comment,
                selectedOptions: selectedOptions || {},
                productId: parseInt(productId),
                status: 'NEW',
                userId: parseInt(userId)
            }
        });

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
        const { status } = req.body;

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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Orders service running on port ${PORT}`);
});