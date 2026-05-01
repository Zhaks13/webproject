import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { api } from '../api';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null); // For "Подробнее" modal

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
                            productName: matched ? matched.name : `Товар #${order.productId}`,
                            productPrice: matched ? matched.price : null
                        };
                    });
                    setOrders(ordersWithNames);
                })
                .catch(err => console.error('Ошибка загрузки заказов:', err))
                .finally(() => setLoading(false));
        }
    }, []); // Убран user из массива зависимостей во избежание бесконечного цикла

    if (!user) {
        return (
            <div className="flex items-center justify-center p-8 bg-gray-50 min-h-screen">
                <p className="text-gray-900 text-lg">Пожалуйста, войдите в систему.</p>
            </div>
        );
    }

    const getStatusStyle = (status) => {
        const styles = {
            'NEW': 'bg-blue-100 text-blue-600',
            'IN_PROGRESS': 'bg-yellow-100 text-yellow-600',
            'READY': 'bg-green-100 text-green-600',
            'DONE': 'bg-green-100 text-green-600',
            'CANCELLED': 'bg-red-100 text-red-600'
        };
        return styles[status] || 'bg-gray-100 text-gray-600';
    };

    const getStatusBorder = (status) => {
        const borders = {
            'NEW': 'border-blue-500',
            'IN_PROGRESS': 'border-yellow-500',
            'READY': 'border-green-400',
            'DONE': 'border-green-500',
            'CANCELLED': 'border-red-500'
        };
        return borders[status] || 'border-gray-300';
    };

    const translateStatus = (status) => {
        const types = {
            'NEW': 'Новый',
            'IN_PROGRESS': 'В работе',
            'READY': 'Готов',
            'DONE': 'Выполнен',
            'CANCELLED': 'Отменен'
        };
        return types[status] || status;
    };

    const Skeletons = () => (
        <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-5 h-[90px] animate-pulse">
                    <div className="flex flex-col gap-2">
                        <div className="w-24 h-5 bg-gray-200 rounded-md"></div>
                        <div className="w-48 h-4 bg-gray-100 rounded-md"></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-6 bg-gray-100 rounded-full"></div>
                        <div className="w-24 h-8 bg-gray-200 rounded-lg"></div>
                        <div className="w-28 h-8 bg-gray-300 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 py-10 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-5xl mx-auto px-4"
            >
                {/* ПРОФИЛЬ КАРТОЧКА (HEADER) */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 hover:shadow-xl">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-500 shrink-0 shadow-inner">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">{user.name}</h1>
                                {user.role === 'ADMIN' && (
                                    <span className="px-2 py-1 rounded-md text-xs font-bold tracking-wide uppercase shadow-sm bg-purple-100 text-purple-700">
                                        ADMIN
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-400">{user.phone}</p>
                        </div>
                    </div>

                    <button className="border border-gray-200 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 w-full md:w-auto shrink-0 active:scale-95">
                        Редактировать профиль
                    </button>
                </div>

                {/* БЛОК "МОИ ЗАКАЗЫ" */}
                <div className="flex items-center justify-between mt-12 mb-6 px-2">
                    <h2 className="text-xl font-semibold tracking-tight text-gray-900">Мои заказы</h2>
                </div>

                {loading ? (
                    /* SKELETON LOADING */
                    <Skeletons />
                ) : orders.length === 0 ? (
                    /* EMPTY STATE */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl py-20 px-6 flex flex-col items-center justify-center shadow-sm text-center border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
                            <span className="text-gray-400 text-3xl">📦</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">У вас пока нет заказов</h3>
                        <p className="text-gray-500 text-sm mb-8 max-w-sm leading-relaxed">
                            Вы еще ничего не заказывали. Перейдите в каталог, чтобы сделать свой первый заказ и обновить интерьер.
                        </p>
                        <Link
                            to="/catalog"
                            className="bg-black text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 inline-block"
                        >
                            Перейти в каталог
                        </Link>
                    </motion.div>
                ) : (
                    /* СПИСОК ЗАКАЗОВ (КАРТОЧКИ) */
                    <div className="flex flex-col gap-4">
                        <AnimatePresence>
                            {orders.map((order, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    key={order.id}
                                    className={`bg-white rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-5 border border-gray-100 border-l-4 ${getStatusBorder(order.status)} flex flex-col md:flex-row md:items-center justify-between gap-5 group`}
                                >
                                    {/* ЛЕВО */}
                                    <div className="flex flex-col space-y-1.5 pl-2">
                                        <h3 className="font-semibold text-gray-900 text-base tracking-tight">Заказ #{order.id}</h3>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-gray-400 font-medium">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="text-gray-600 line-clamp-1">{order.productName}</span>
                                        </div>
                                    </div>

                                    {/* ПРАВО */}
                                    <div className="flex flex-wrap items-center gap-5 mt-2 md:mt-0 justify-between md:justify-end">
                                        <span className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide uppercase shadow-sm ${getStatusStyle(order.status)}`}>
                                            {translateStatus(order.status)}
                                        </span>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-sm border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 hover:text-black transition-all duration-200 hover:shadow-sm active:scale-95"
                                            >
                                                Подробнее
                                            </button>
                                            <button className="bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 hover:shadow-md transition-all duration-200 active:scale-95">
                                                Повторить
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>

            {/* Временная модалка Подробнее */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedOrder(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white rounded-2xl shadow-2xl p-8 relative z-10 w-full max-w-lg"
                        >
                            <h3 className="text-xl font-bold mb-4">Детали заказа #{selectedOrder.id}</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Товар</span>
                                    <span className="font-medium">{selectedOrder.productName}</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Статус</span>
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusStyle(selectedOrder.status)}`}>
                                        {translateStatus(selectedOrder.status)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="text-gray-500">Дата оформления</span>
                                    <span className="font-medium">{new Date(selectedOrder.createdAt).toLocaleDateString('ru-RU')}</span>
                                </div>
                                {selectedOrder.productPrice && (
                                    <div className="flex justify-between border-b border-gray-100 pb-2">
                                        <span className="text-gray-500">Цена</span>
                                        <span className="font-medium font-mono text-lg">{selectedOrder.productPrice.toLocaleString('ru-RU')} ₸</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="w-full bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 transition-colors active:scale-95"
                            >
                                Закрыть
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
