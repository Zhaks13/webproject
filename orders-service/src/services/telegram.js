const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TG_TOKEN || "8723068068:AAH4stf3wpKTitpXJ40JnJgVr5qZYOdKtKE";
const CHAT_ID = process.env.TG_CHAT_ID || "942356954";

const bot = new TelegramBot(TOKEN, { polling: false });

function sendOrderNotification(order) {
    try {
        const name = order.name || "Не указано";
        const phone = order.phone || "Не указан";
        const address = order.address || "Не указан";
        const total = order.totalPrice || 0;

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

        const message = `🆕 Новый заказ\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📍 Адрес: ${address}\n\n${productsBlock}\n\n💰 Сумма: ${total} ₸\n📅 Дата: ${createdAt}`;

        bot.sendMessage(CHAT_ID, message).catch(err => {
            console.error('Telegram notification error:', err);
        });
    } catch (error) {
        console.error('Telegram notification error:', error);
    }
}

module.exports = { sendOrderNotification };
