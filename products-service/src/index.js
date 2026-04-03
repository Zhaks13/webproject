const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// 📁 1. Папка uploads
const uploadsDir = '/app/uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// 🔥 2. РАЗДАЧА СТАТИКИ (ВАЖНО!)
app.use('/uploads', express.static(uploadsDir));

// 📦 3. Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 🖼 4. Upload endpoint
app.post('/products/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Пожалуйста, выберите изображение' });
    }

    // 🔥 ВАЖНО: возвращаем путь через API Gateway
    const imageUrl = `/api/products/uploads/${req.file.filename}`;

    res.json({ imageUrl });
});

// 📦 GET products
app.get('/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { id: 'desc' }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ➕ CREATE
app.post('/products', async (req, res) => {
    try {
        const { name, description, price, image } = req.body;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                image
            }
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при создании товара' });
    }
});

// ✏ UPDATE
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image } = req.body;

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price: parseFloat(price),
                image
            }
        });

        res.json(updatedProduct);
    } catch (error) {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

// ❌ DELETE
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.product.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Products service running on port ${PORT}`);
});