import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../api';

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            Promise.all([
                api.get('orders/my'),
                api.get('products')
            ])
                .then(([resOrders, resProducts]) => {
                    const productsList = resProducts.data;
                    const ordersWithNames = resOrders.data.map(order => {
                        const matched = productsList.find(p => p.id === order.productId);
                        return {
                            ...order,
                            productName: matched ? matched.name : `Товар #${order.productId}`
                        };
                    });
                    setOrders(ordersWithNames);
                })
                .catch(err => console.error('Ошибка загрузки заказов:', err))
                .finally(() => setLoading(false));
        }
    }, []);

    if (!user) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-[#051F20] text-lg">Пожалуйста, войдите в систему.</p>
            </div>
        );
    }

    const translateStatus = (status) => {
        const types = {
            'NEW': 'Новый',
            'IN_PROGRESS': 'В работе',
            'READY': 'Готов'
        };
        return types[status] || status;
    };

    return (
        <div className="min-h-screen p-8 bg-[#F5F5F7] text-gray-900">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto bg-white border border-[#2E6B50]/20 rounded-2xl p-8 shadow-sm"
            >
                <h1 className="text-3xl font-light tracking-widest text-[#051F20] uppercase mb-6 border-b border-[#2E6B50]/20 pb-4">
                    Профиль Пользователя
                </h1>

                <div className="flex flex-col gap-4">
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-light">Имя:</span>
                        <span className="font-medium text-[#0D3B2E]">{user.name}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-light">Телефон:</span>
                        <span className="font-medium text-[#0D3B2E]">{user.phone}</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-gray-500 font-light">Роль:</span>
                        <span className="font-medium text-[#0D3B2E] bg-[#2E6B50]/10 px-2 py-1 rounded text-sm">{user.role}</span>
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className="text-xl font-light tracking-widest text-[#051F20] uppercase mb-4">Мои заказы</h2>

                    {loading ? (
                        <p className="text-gray-500 text-sm">Загрузка...</p>
                    ) : orders.length === 0 ? (
                        <div className="p-4 bg-[#DAF1DE]/30 border border-[#DAF1DE] rounded-xl">
                            <p className="text-gray-500 text-sm">У вас пока нет заказов.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {orders.map((order) => (
                                <div key={order.id} className="p-4 border border-gray-200 rounded-xl flex justify-between items-center transition-colors hover:border-[#2E6B50]/50">
                                    <div>
                                        <p className="font-medium text-[#0D3B2E]">Заказ #{order.id}</p>
                                        <p className="text-sm text-gray-500 font-light">
                                            {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                                        </p>
                                        <p className="text-sm text-gray-500 font-light">
                                            {order.productName}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded text-xs tracking-wider uppercase ${order.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {translateStatus(order.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
