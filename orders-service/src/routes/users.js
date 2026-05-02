const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { verifyToken } = require('../middleware/auth');

const prisma = new PrismaClient();

/**
 * PATCH /users/profile
 * Update current user's name, phone, and optionally password
 */
router.patch('/profile', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phone, password } = req.body;

        // Validation
        const errors = {};

        if (!name || !name.trim()) {
            errors.name = 'Имя обязательно';
        } else if (name.trim().length < 2) {
            errors.name = 'Имя должно быть не короче 2 символов';
        }

        if (!phone || !phone.trim()) {
            errors.phone = 'Телефон обязателен';
        } else {
            const digits = phone.replace(/\D/g, '');
            if (digits.length < 10) {
                errors.phone = 'Некорректный номер телефона';
            }
        }

        if (password !== undefined && password !== null && password !== '') {
            if (password.length < 6) {
                errors.password = 'Пароль должен быть не менее 6 символов';
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: 'Ошибка валидации', errors });
        }

        // Check user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Check phone uniqueness (if changed)
        const trimmedPhone = phone.trim();
        if (trimmedPhone !== existingUser.phone) {
            const phoneTaken = await prisma.user.findUnique({
                where: { phone: trimmedPhone }
            });
            if (phoneTaken) {
                return res.status(400).json({
                    message: 'Ошибка валидации',
                    errors: { phone: 'Этот номер уже используется' }
                });
            }
        }

        // Build update data
        const updateData = {
            name: name.trim(),
            phone: trimmedPhone
        };

        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData
        });

        return res.json({
            message: 'Профиль обновлен',
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                phone: updatedUser.phone,
                role: updatedUser.role,
                createdAt: updatedUser.createdAt
            }
        });

    } catch (error) {
        console.error('PROFILE UPDATE ERROR:', error);
        return res.status(500).json({ message: 'Ошибка сервера' });
    }
});

module.exports = router;
