const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();

/**
 * ✅ CORS
 */
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
    ],
    credentials: true
}));

/**
 * 🔥 uploads
 */
app.use('/api/products/uploads', createProxyMiddleware({
    target: 'http://products-service:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/products': ''
    },
}));

/**
 * 🔥 products API
 */
app.use('/api/products', createProxyMiddleware({
    target: 'http://products-service:3001',
    changeOrigin: true,
    pathRewrite: {
        '^/api/products': '/products'
    },
}));

/**
 * 🔥 orders API
 */
app.use('/api/orders', createProxyMiddleware({
    target: 'http://orders-service:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/orders': '/orders'
    },
}));

/**
 * 💥 ВОТ ЭТОГО У ТЕБЯ НЕ ХВАТАЛО
 * 🔥 AUTH API
 */
app.use('/api/auth', createProxyMiddleware({
    target: 'http://orders-service:3002',
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '/auth'
    },
}));

/**
 * ✅ listen
 */
app.listen(8080, '0.0.0.0', () => {
    console.log('API Gateway running on 8080');
});