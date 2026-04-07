import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import { getImageUrl } from '../utils/image';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setFeaturedProducts(data.slice(0, 4));
            } catch (e) {
                console.error('Failed to load featured products', e);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="w-full font-sans text-[#111] bg-[#f5f5f5]">

            {/* ======== HERO ======== */}
            <div className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-6 lg:px-12 xl:px-20 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-40">
                    <div className="w-[80vw] h-[80vw] bg-white rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 w-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-between gap-16 mt-16">
                    <div className="flex-1 flex flex-col gap-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-[#111] leading-[0.9]"
                        >
                            Мебель<br />
                            <span className="text-zinc-400">Со Смыслом.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="text-lg md:text-xl font-medium text-zinc-500 max-w-lg leading-relaxed tracking-tight"
                        >
                            Исключительный дизайн, чистота форм и натуральные материалы. Создаем объекты, которые становятся частью вашей жизни.
                        </motion.p>

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}>
                            <Link
                                to="/catalog"
                                className="inline-flex items-center justify-center px-10 py-5 bg-[#111] text-white rounded-2xl text-sm font-semibold uppercase tracking-widest hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
                            >
                                Смотреть коллекцию <span className="ml-3 opacity-50">&rarr;</span>
                            </Link>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-[4/5] lg:aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80"
                            alt="Minimalist Wood Furniture"
                            className="w-full h-full object-cover"
                        />
                    </motion.div>
                </div>
            </div>

            {/* ======== CATALOG PREVIEW ======== */}
            <div className="py-32 bg-white">
                <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#111]">
                            Избранное
                        </h2>
                        <Link to="/catalog" className="text-zinc-500 hover:text-[#111] font-medium tracking-tight flex items-center transition-colors text-lg">
                            Смотреть всё <span className="ml-2">&rarr;</span>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                        {featuredProducts.length === 0 ? (
                            <p className="text-zinc-400 font-medium col-span-full">Загрузка каталога...</p>
                        ) : featuredProducts.map((p, i) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.1 }}
                                className="group cursor-pointer"
                            >
                                <Link to={`/product/${p.id}`} className="block w-full">
                                    <div className="w-full aspect-[4/5] bg-zinc-100 rounded-3xl overflow-hidden mb-6 relative shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-2">
                                        <div className="absolute inset-0 bg-[#111]/0 group-hover:bg-[#111]/5 transition-colors duration-300 z-10 pointer-events-none"></div>
                                        {p.image ? (
                                            <img
                                                src={getImageUrl(p.image)}
                                                alt={p.name}
                                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-[1.05]"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 text-xs tracking-widest uppercase">Нет фото</div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 px-2">
                                        <h3 className="text-xl font-bold tracking-tight text-[#111] group-hover:text-zinc-600 transition-colors">
                                            {p.name}
                                        </h3>
                                        <p className="text-sm font-medium text-zinc-500">
                                            {p.price} ₸
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ======== CTA ======== */}
            <div className="w-full py-40 bg-[#f5f5f5] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-5xl bg-white rounded-[3rem] p-16 md:p-24 text-center shadow-xl flex flex-col items-center border border-zinc-100"
                >
                    <h2 className="text-5xl md:text-7xl font-bold text-[#111] tracking-tighter mb-8 leading-[0.9]">
                        Готовы создать<br />проект?
                    </h2>
                    <p className="text-xl text-zinc-500 mb-12 max-w-xl font-medium tracking-tight">
                        Мы воплотим ваши идеи в реальность с безупречным вниманием к деталям.
                    </p>
                    <Link
                        to="/custom-order"
                        className="inline-block bg-[#111] text-white px-12 py-5 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-zinc-800 hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
                    >
                        Обсудить проект
                    </Link>
                </motion.div>
            </div>

        </div>
    );
}
