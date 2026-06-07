const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.TG_TOKEN || "8723068068:AAH4stf3wpKTitpXJ40JnJgVr5qZYOdKtKE";
const CHAT_ID = process.env.TG_CHAT_ID || "942356954";

const bot = new TelegramBot(TOKEN, { polling: false });

function formatFallback(value, fallback) {
    return value || fallback;
}

function normalizeImagePath(image) {
    if (!image || typeof image !== 'string') {
        return null;
    }

    if (image.startsWith('/uploads/')) {
        return path.resolve(process.cwd(), image.replace(/^\/+/, ''));
    }

    if (path.isAbsolute(image)) {
        return image;
    }

    return path.resolve(process.cwd(), image.replace(/^\/+/, ''));
}

function getExistingImagePaths(images) {
    if (!Array.isArray(images)) {
        console.log('[telegram trace] order.images is not an array', { images });
        return [];
    }

    return images
        .map(normalizeImagePath)
        .filter((imagePath) => {
            if (!imagePath) {
                return false;
            }

            if (!fs.existsSync(imagePath)) {
                console.error('Telegram image file not found:', imagePath);
                return false;
            }

            return true;
        })
        .slice(0, 5);
}

function buildOrderMessage(order) {
    const name = formatFallback(order.name, "Не указано");
    const phone = formatFallback(order.phone, "Не указан");
    const address = formatFallback(order.address, "Не указан");
    const total = order.totalPrice || 0;
    const projectDetails = order.customDescription || order.comment || "Не указаны";

    let productsBlock = "📦 Товар";

    if (order.type === 'CUSTOM') {
        productsBlock = `📦 Товар: ${order.displayName || 'Товар'}`;
    } else if (order.items && order.items.length > 1) {
        const itemsList = order.items.map(item => `* ${item.name || 'Товар'} ×${item.quantity || 1}`).join('\n');
        productsBlock = `📦 Товары:\n${itemsList}`;
    } else if (order.items && order.items.length === 1) {
        productsBlock = `📦 Товар: ${order.items[0].name || 'Товар'}`;
    } else if (order.displayName) {
        productsBlock = `📦 Товар: ${order.displayName}`;
    }

    const createdAt = order.createdAt
        ? new Date(order.createdAt).toLocaleString('ru-RU')
        : new Date().toLocaleString('ru-RU');

    return `🆕 Новый заказ\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📍 Адрес: ${address}\n\n${productsBlock}\n\n📝 Детали проекта: ${projectDetails}\n\n💰 Сумма: ${total} ₸\n📅 Дата: ${createdAt}`;
}

async function sendOrderImages(imagePaths) {
    if (imagePaths.length === 0) {
        console.log('[telegram trace] no images to send');
        return;
    }

    const imageStats = imagePaths.map((imagePath) => {
        const stat = fs.statSync(imagePath);
        return {
            path: imagePath,
            exists: fs.existsSync(imagePath),
            size: stat.size
        };
    });

    console.log('[telegram trace] image files ready for Telegram', imageStats);

    if (imagePaths.length === 1) {
        try {
            console.log('[telegram trace] sending single photo', {
                method: 'sendPhoto',
                photo: imagePaths[0]
            });
            const response = await bot.sendPhoto(CHAT_ID, imagePaths[0]);
            console.log('[telegram trace] sendPhoto response', {
                message_id: response?.message_id,
                photoCount: Array.isArray(response?.photo) ? response.photo.length : null
            });
        } catch (error) {
            console.error('Telegram photo notification error:', error);
        }
        return;
    }

    const media = imagePaths.map((imagePath) => ({
        type: 'photo',
        media: imagePath
    }));

    try {
        console.log('[telegram trace] sending media group', {
            method: 'sendMediaGroup',
            media
        });
        const response = await bot.sendMediaGroup(CHAT_ID, media);
        console.log('[telegram trace] sendMediaGroup response', {
            messageIds: Array.isArray(response) ? response.map((message) => message.message_id) : null
        });
    } catch (error) {
        console.error('Telegram media group notification error:', error);

        await Promise.all(imagePaths.map(async (imagePath) => {
            try {
                console.log('[telegram trace] sending fallback photo', {
                    method: 'sendPhoto',
                    photo: imagePath
                });
                const response = await bot.sendPhoto(CHAT_ID, imagePath);
                console.log('[telegram trace] fallback sendPhoto response', {
                    message_id: response?.message_id,
                    photoCount: Array.isArray(response?.photo) ? response.photo.length : null
                });
            } catch (photoError) {
                console.error('Telegram fallback photo notification error:', photoError);
            }
        }));
    }
}

async function sendOrderNotification(order) {
    try {
        const message = buildOrderMessage(order);
        const imagePaths = getExistingImagePaths(order.images);

        console.log('[telegram trace] notification input', {
            orderId: order.id,
            orderType: order.type,
            rawImages: order.images,
            absoluteImagePaths: imagePaths,
            imageExists: imagePaths.map((imagePath) => fs.existsSync(imagePath))
        });

        try {
            console.log('[telegram trace] sending text notification', {
                method: 'sendMessage',
                textLength: message.length
            });
            const response = await bot.sendMessage(CHAT_ID, message);
            console.log('[telegram trace] sendMessage response', {
                message_id: response?.message_id,
                date: response?.date
            });
        } catch (error) {
            console.error('Telegram text notification error:', error);
        }

        await sendOrderImages(imagePaths);
    } catch (error) {
        console.error('Telegram notification error:', error);
    }
}

module.exports = {
    sendOrderNotification,
    buildOrderMessage,
    getExistingImagePaths
};
