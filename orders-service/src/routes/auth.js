const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';


/**
 * REGISTER
 */
router.post('/register', async (req, res) => {
    try {
        const { name, phone, password } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({ message: 'Заполните все поля' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { phone }
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(201).json({
            message: 'Пользователь создан',
            token,
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
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});


/**
 * LOGIN
 */
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ message: 'Заполните все поля' });
        }

        const user = await prisma.user.findUnique({
            where: { phone }
        });

        // ❗ не палим существует пользователь или нет
        if (!user) {
            return res.status(401).json({ message: 'Неверный телефон или пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Неверный телефон или пароль' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            message: 'Успешный вход',
            token,
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
                role: user.role,
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('LOGIN ERROR:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;