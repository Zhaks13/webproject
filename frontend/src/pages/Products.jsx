import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { getImageUrl } from '../utils/image';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loadingOrderId, setLoadingOrderId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (e) {
            console.error('Failed to load products', e);
        } finally {
            setLoading(false);
        }
    };

    const orderProduct = async (productId) => {
        setLoadingOrderId(productId);
        try {
            await api.post('/orders', {
                customerName: 'Гость (быстрый заказ)',
                phone: 'Не указан',
                productId: productId
            });
            alert('Товар успешно добавлен в корзину (создана заявка)!');
        } catch (e) {
            console.error('Ошибка при отправке заказа:', e);
            alert('Произошла ошибка при регистрации заявки');
        } finally {
            setLoadingOrderId(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="min-h-screen bg-brand-warm pt-32 pb-24 px-6 sm:px-12 lg:px-20 font-sans relative overflow-hidden">
            {/* Мягкие свечения */}
            <div className="absolute top-[10%] right-[-10%] w-[40vw] h-[40vw] bg-white rounded-full filter blur-[150px] opacity-70 pointer-events-none"></div>

            <div className="max-w-[1600px] mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-20"
                >
                    <h1 className="text-5xl md:text-6xl font-light text-[#1a1a1a] tracking-tight mb-8">
                        Предметы.
                    </h1>
                    <p className="max-w-xl text-lg text-[#1a1a1a]/70 font-light leading-relaxed">
                        Естественная фактура массива, чистые линии и ручной труд в каждой детали.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-start items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b border-[#1a1a1a]"></div>
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="py-20 text-[#1a1a1a]/50 text-lg font-light"
                    >
                        Коллекция обновляется.
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24"
                    >
                        {products.map(p => (
                            <motion.div
                                key={p.id}
                                variants={itemVariants}
                                className="group flex flex-col"
                            >
                                <Link to={`/product/${p.id}`} className="relative aspect-[4/5] overflow-hidden mb-8 block">
                                    {/* Убрали серый фон, заменили на мягкий теневой блюр при наведении внутри изображения */}
                                    <div className="absolute inset-0 bg-brand-dark1 opacity-0 group-hover:opacity-5 transition-opacity duration-700 z-10 pointer-events-none"></div>
                                    {p.image ? (
                                        <motion.img
                                            whileHover={{ scale: 1.03 }}
                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                            src={getImageUrl(p.image)}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-[#f0ede5] flex items-center justify-center text-[#1a1a1a]/30 font-light tracking-[0.2em] uppercase text-xs">
                                            Без фото
                                        </div>
                                    )}
                                </Link>

                                <div className="flex flex-col flex-grow">
                                    <div className="flex flex-col mb-4">
                                        <Link to={`/product/${p.id}`} className="hover:opacity-60 transition-opacity">
                                            <h3 className="text-2xl font-light text-[#1a1a1a] mb-2">{p.name}</h3>
                                        </Link>
                                        <span className="text-lg font-light text-brand-dark4">
                                            {p.price} ₸
                                        </span>
                                    </div>

                                    <p className="text-[#1a1a1a]/60 font-light text-[15px] leading-relaxed line-clamp-2 mb-8">
                                        {p.description}
                                    </p>

                                    <div className="mt-auto">
                                        <button
                                            onClick={() => orderProduct(p.id)}
                                            disabled={loadingOrderId === p.id}
                                            className={`
                                                uppercase tracking-[0.15em] text-[11px] font-medium pb-2 border-b border-[#1a1a1a] text-[#1a1a1a] hover:text-brand-dark3 hover:border-brand-dark3 transition-colors
                                                ${loadingOrderId === p.id ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {loadingOrderId === p.id ? 'Подождите...' : 'Обсудить проект'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
