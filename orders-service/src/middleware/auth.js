const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

const verifyToken = (req, res, next) => {
    // Получаем токен из заголовка Authorization (обычно "Bearer <token>")
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Нет доступа. Токен отсутствует пуст или имеет неверный формат' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { userId, role }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Недействительный токен' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
    }
    next();
};

module.exports = {
    verifyToken,
    requireAdmin
};
