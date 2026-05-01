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

// 🔥 2. Раздача статики
app.use('/uploads', express.static(uploadsDir));

// 📦 3. Multer (поддержка нескольких файлов, до 5)
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

// 🖼 4. Upload single (обратная совместимость)
app.post('/products/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Пожалуйста, выберите изображение' });
    }
    const imageUrl = `/api/products/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// 🖼 5. Upload multiple (до 5 файлов)
app.post('/products/upload-multiple', upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'Пожалуйста, выберите изображения' });
    }
    const imageUrls = req.files.map(f => `/api/products/uploads/${f.filename}`);
    res.json({ imageUrls });
});

// 📦 GET products
app.get('/products', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            orderBy: { id: 'desc' }
        });
        // Обратная совместимость: добавить поле image для старого кода
        const result = products.map(p => ({
            ...p,
            image: p.images?.[0] || null
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// ➕ CREATE
app.post('/products', async (req, res) => {
    try {
        const { name, description, price, image, images } = req.body;

        // Нормализация: images[] приоритетнее, image конвертируем в массив
        let imagesArray = [];
        if (Array.isArray(images) && images.length > 0) {
            imagesArray = images.filter(Boolean).slice(0, 5);
        } else if (image) {
            imagesArray = [image];
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                images: imagesArray
            }
        });

        res.status(201).json({
            ...product,
            image: product.images?.[0] || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка при создании товара' });
    }
});

// ✏ UPDATE
app.put('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image, images } = req.body;

        let imagesArray = [];
        if (Array.isArray(images) && images.length > 0) {
            imagesArray = images.filter(Boolean).slice(0, 5);
        } else if (image) {
            imagesArray = [image];
        }

        const updatedProduct = await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
                price: parseFloat(price),
                images: imagesArray
            }
        });

        res.json({
            ...updatedProduct,
            image: updatedProduct.images?.[0] || null
        });
    } catch (error) {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

// ❌ DELETE
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ error: 'Товар не найден' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Products service running on port ${PORT}`);
});