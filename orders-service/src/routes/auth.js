const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * REGISTER
 */
router.post('/register', async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        // ✅ проверка полей
        if (!name || !phone || !password) {
            return res.status(400).json({ message: 'Заполните все поля' });
        }

        // ✅ проверка на существование
        const existingUser = await prisma.user.findUnique({
            where: { phone }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        // ✅ хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ создание пользователя
        const user = await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword
            }
        });

        // ❗ НЕ возвращаем пароль
        res.status(201).json({
            message: 'Пользователь создан',
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('REGISTER ERROR:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;