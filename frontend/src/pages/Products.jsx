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
        <div className="min-h-screen bg-[#F5F5F7] py-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-24 mt-8"
                >
                    <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-6 block">
                        Каталог изделий
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#111] tracking-tight mb-6">
                        Искусство в каждом <span className="text-gray-400">изгибе</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-light leading-relaxed">
                        Авторская деревянная мебель и декор ручной работы. Создано с вниманием к деталям и уважением к природе.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-20 text-gray-400 text-lg font-light"
                    >
                        Наша коллекция обновляется. Пожалуйста, загляните позже.
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
                    >
                        {products.map(p => (
                            <motion.div
                                key={p.id}
                                variants={itemVariants}
                                whileHover={{ y: -12 }}
                                className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] transition-all duration-500 flex flex-col group overflow-hidden border border-gray-100"
                            >
                                <Link to={`/product/${p.id}`} className="relative h-[340px] overflow-hidden bg-gray-50 flex-shrink-0 block cursor-pointer">
                                    {p.image ? (
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                            src={getImageUrl(p.image)}
                                            alt={p.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-medium tracking-wide">
                                            Без фото
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                </Link>

                                <div className="p-8 flex flex-col flex-grow bg-white z-10 relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <Link to={`/product/${p.id}`} className="hover:text-blue-600 transition-colors pr-4">
                                            <h3 className="text-xl font-bold text-[#111] leading-tight">{p.name}</h3>
                                        </Link>
                                        <span className="text-lg font-bold text-[#111] bg-gray-100/80 px-4 py-1.5 rounded-full whitespace-nowrap">
                                            {p.price} ₸
                                        </span>
                                    </div>

                                    <p className="text-gray-500 mt-2 mb-10 flex-grow leading-relaxed font-light text-[15px] line-clamp-3">
                                        {p.description}
                                    </p>

                                    <div className="mt-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => orderProduct(p.id)}
                                            disabled={loadingOrderId === p.id}
                                            className={`
                        w-full relative flex items-center justify-center px-8 py-4 rounded-[1.25rem] font-bold text-white transition-all duration-300 shadow-[0_10px_20px_rgba(0,0,0,0.1)]
                        ${loadingOrderId === p.id
                                                    ? 'bg-gray-400 opacity-60 cursor-not-allowed'
                                                    : 'bg-[#111] hover:bg-black hover:shadow-[0_15px_25px_rgba(0,0,0,0.15)]'}
                      `}
                                        >
                                            {loadingOrderId === p.id ? 'Обработка...' : 'В корзину'}
                                        </motion.button>
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
