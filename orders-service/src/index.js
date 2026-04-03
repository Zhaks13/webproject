const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Получение списка всех заказов
app.get('/orders', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Создание нового заказа
app.post('/orders', async (req, res) => {
    try {
        const { customerName, phone, productId } = req.body;
        const order = await prisma.order.create({
            data: {
                customerName,
                phone,
                productId: parseInt(productId),
                status: 'NEW'
            }
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании заказа' });
    }
});

// Обновление статуса заказа
app.put('/orders/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedOrder = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json(updatedOrder);
    } catch (error) {
        res.status(404).json({ error: 'Заказ не найден или ошибка обновления' });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Orders service running on port ${PORT}`);
});
