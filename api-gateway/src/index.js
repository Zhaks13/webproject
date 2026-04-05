const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

/**
 * ✅ CORS (фикс)
 */
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173', // Vite
        // добавишь свой домен позже:
        // 'https://your-domain.com'
    ],
    credentials: true
}));

/**
 * 🔥 1. uploads (С rewrite!)
 * превращаем /api/products/uploads → /uploads
 */
app.use('/api/products/uploads', createProxyMiddleware({
    target: 'http://products-service:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/products': ''
    },
}));

/**
 * 🔥 2. products API (С rewrite)
 * /api/products → /products
 */
app.use('/api/products', createProxyMiddleware({
    target: 'http://products-service:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/products': '/products'
    },
}));

/**
 * 🔥 orders
 */
app.use('/api/orders', createProxyMiddleware({
    target: 'http://orders-service:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/orders': '/orders'
    },
}));

/**
 * ✅ listen (фикс для Docker)
 */
app.listen(8080, '0.0.0.0', () => {
    console.log('API Gateway running on 8080');
});