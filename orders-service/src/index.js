const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const { verifyToken, requireAdmin } = require('./middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();

const DEFAULT_CUSTOM_ORDER_NAME = '\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u044b\u0439 \u0437\u0430\u043a\u0430\u0437';

const orderInclude = {
    items: {
        orderBy: { id: 'asc' }
    }
};

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

function parseOptionalInt(value) {
    if (value === undefined || value === null || value === '') {
        return null;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : null;
}

function parseOptionalJson(value, fallback, fieldName = 'JSON field') {
    if (value === undefined || value === null || value === '') {
        return fallback;
    }

    if (typeof value !== 'string') {
        return value;
    }

    try {
        return JSON.parse(value);
    } catch {
        throw createRequestError(400, `${fieldName} must be valid JSON`);
    }
}

function parseOptionalBoolean(value) {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        return ['true', '1', 'yes', 'on'].includes(value.trim().toLowerCase());
    }

    return Boolean(value);
}

function normalizeOptionalString(value) {
    if (value === undefined || value === null) {
        return null;
    }

    const normalized = String(value).trim();
    return normalized || null;
}

function createRequestError(statusCode, message) {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
}

function serializeOrder(order) {
    return order;
}

async function fetchProducts() {
    if (typeof fetch !== 'function') {
        return [];
    }

    const productsServiceUrl = (process.env.PRODUCTS_SERVICE_URL || 'http://products-service:3001').replace(/\/$/, '');

    try {
        const response = await fetch(`${productsServiceUrl}/products`);
        if (!response.ok) {
            return [];
        }

        const products = await response.json();
        if (!Array.isArray(products)) {
            return [];
        }

        return products;
    } catch (error) {
        console.error('Failed to fetch products for order creation', error);
        return [];
    }
}

function normalizeOrderItems(rawItems) {
    const parsedItems = parseOptionalJson(rawItems, null, 'items');
    const items = [];

    if (parsedItems === null) {
        return [];
    }

    if (!Array.isArray(parsedItems)) {
        throw createRequestError(400, 'items must be an array');
    }

    parsedItems.forEach((item, index) => {
        const productId = parseOptionalInt(item?.productId);
        const quantity = parseOptionalInt(item?.quantity) ?? 1;

        if (productId === null) {
            throw createRequestError(400, `items[${index}].productId is required`);
        }

        if (quantity < 1) {
            throw createRequestError(400, `items[${index}].quantity must be at least 1`);
        }

        items.push({
            productId,
            quantity,
            requestedPrice: parseOptionalFloat(item?.price),
            providedName: normalizeOptionalString(item?.productName || item?.name)
        });
    });

    return items;
}

async function resolveOrderItems(rawItems) {
    if (rawItems.length === 0) {
        return {
            items: [],
            totalPrice: null,
            displayName: null
        };
    }

    const products = await fetchProducts();
    const productsById = new Map(products.map((product) => [Number(product.id), product]));

    const items = rawItems.map((item) => {
        const product = productsById.get(item.productId) || null;
        const price = parseOptionalFloat(product?.price) ?? item.requestedPrice;

        return {
            productId: item.productId,
            quantity: item.quantity,
            price,
            productName: normalizeOptionalString(product?.name) || item.providedName || `Product #${item.productId}`
        };
    });

    const totalPrice = items.every((item) => item.price !== null)
        ? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        : null;
    const displayName = items.length === 1
        ? items[0].productName
        : `${items[0].productName} + ${items.length - 1}`;

    return { items, totalPrice, displayName };
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
app.use('/users', usersRoutes);

app.get('/orders/my', verifyToken, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: req.user.userId },
            orderBy: { createdAt: 'desc' },
            include: orderInclude
        });

        res.json(orders.map(serializeOrder));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/orders', verifyToken, requireAdmin, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: orderInclude
        });

        res.json(orders.map(serializeOrder));
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

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
            } catch (error) {
                console.error('Token verification failed for order creation', error);
            }
        }

        const {
            items,
            type,
            name,
            phone,
            address,
            whatsapp,
            paymentMethod,
            comment,
            selectedOptions,
            adminComment,
            source,
            totalPrice,
            customTitle,
            customDescription
        } = req.body;

        if (!name || !phone) {
            return res.status(400).json({ error: 'name and phone are required' });
        }

        if (
            Object.prototype.hasOwnProperty.call(req.body, 'productId')
            || Object.prototype.hasOwnProperty.call(req.body, 'quantity')
        ) {
            return res.status(400).json({ error: 'Send product data in items[]; top-level productId and quantity are no longer supported' });
        }

        const normalizedType = normalizeOptionalString(type)?.toUpperCase();
        if (normalizedType && !['PRODUCT', 'CUSTOM'].includes(normalizedType)) {
            return res.status(400).json({ error: 'type must be PRODUCT or CUSTOM' });
        }

        const normalizedItems = normalizeOrderItems(items);
        const orderType = normalizedType || (normalizedItems.length > 0 ? 'PRODUCT' : 'CUSTOM');

        if (orderType === 'PRODUCT' && normalizedItems.length === 0) {
            return res.status(400).json({ error: 'items must not be empty for PRODUCT orders' });
        }

        if (orderType === 'CUSTOM' && normalizedItems.length > 0) {
            return res.status(400).json({ error: 'CUSTOM orders cannot contain product items' });
        }

        const resolvedItems = orderType === 'PRODUCT'
            ? await resolveOrderItems(normalizedItems)
            : { items: [], totalPrice: parseOptionalFloat(totalPrice), displayName: null };

        const data = {
            name,
            phone,
            address: address || null,
            whatsapp: parseOptionalBoolean(whatsapp),
            paymentMethod: paymentMethod || 'CASH',
            comment: comment || null,
            adminComment: adminComment || null,
            source: source || 'WEB',
            totalPrice: resolvedItems.totalPrice,
            selectedOptions: parseOptionalJson(selectedOptions, {}, 'selectedOptions'),
            status: 'NEW',
            type: orderType,
            displayName: resolvedItems.displayName,
            images: req.files ? req.files.map((file) => `/uploads/${file.filename}`) : []
        };

        if (orderType === 'CUSTOM') {
            const normalizedCustomTitle = normalizeOptionalString(customTitle);

            data.displayName = normalizedCustomTitle || DEFAULT_CUSTOM_ORDER_NAME;
            data.customTitle = normalizedCustomTitle;
            data.customDescription = normalizeOptionalString(customDescription);
        }

        if (userId) {
            data.userId = parseInt(userId, 10);
        }

        const order = await prisma.$transaction(async (tx) => {
            const createdOrder = await tx.order.create({ data });

            if (resolvedItems.items.length > 0) {
                await tx.orderItem.createMany({
                    data: resolvedItems.items.map((item) => ({
                        orderId: createdOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                });
            }

            return tx.order.findUnique({
                where: { id: createdOrder.id },
                include: orderInclude
            });
        });

        res.status(201).json(serializeOrder(order));
    } catch (error) {
        console.error('CREATE ORDER ERROR:', error);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
});

app.put('/orders/:id/status', verifyToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const status = normalizeOrderStatus(req.body.status);

        if (!status) {
            return res.status(400).json({ error: 'Status is required' });
        }

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id, 10) },
            data: { status },
            include: orderInclude
        });

        res.json(serializeOrder(updatedOrder));
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Order not found or update failed' });
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
            where: { id: parseInt(id, 10) },
            data,
            include: orderInclude
        });

        res.json(serializeOrder(updatedOrder));
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Order not found or update failed' });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Orders service running on port ${PORT}`);
});
