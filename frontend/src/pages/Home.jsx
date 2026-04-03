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
                // Берём первые 4 товара для секции "Каталог" на главной
                setFeaturedProducts(data.slice(0, 4));
            } catch (e) {
                console.error('Failed to load featured products', e);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="relative w-full overflow-hidden bg-[#F5F5F5] text-[#1A1A1A] font-sans">

            {/* 1. HERO СЕКЦИЯ */}
            <div className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
                {/* Мягкие градиентные blob формы на фоне */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#EAE5DF] rounded-full filter blur-[100px] opacity-80 mix-blend-multiply animate-blob pointer-events-none"></div>
                <div className="absolute bottom-[10%] right-[-5%] w-[45vw] h-[45vw] bg-[#DDE2E0] rounded-full filter blur-[120px] opacity-70 mix-blend-multiply animate-blob animation-delay-2000 pointer-events-none"></div>

                <div className="max-w-[1240px] mx-auto px-6 lg:px-10 w-full relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* Контент слева */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}
                        className="flex-1 w-full mt-10 lg:mt-0"
                    >
                        <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm mb-6 block">Эксклюзивный массив</span>

                        <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-extrabold text-[#1A1A1A] leading-[1.05] tracking-tight mb-8">
                            Создано <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-400">Природой.</span>
                        </h1>

                        <p className="text-xl lg:text-2xl text-gray-500 font-light max-w-lg mb-12 leading-relaxed">
                            Минималистичный дизайн и живая фактура дерева. Мы превращаем благородный массив в искусство для вашего пространства.
                        </p>

                        <Link to="/catalog" className="inline-block bg-[#1A1A1A] text-white px-10 py-5 rounded-[20px] font-bold text-lg hover:bg-black transition-all shadow-[0_15px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] hover:-translate-y-1">
                            Смотреть коллекции
                        </Link>
                    </motion.div>

                    {/* Изображение блок справа */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                        className="flex-1 relative w-full lg:max-w-[500px]"
                    >
                        {/* Смещенная подложка-тень для асимметрии и глубины */}
                        <div className="absolute inset-4 bg-[#EAE5DF] rounded-[32px] transform rotate-3 z-0"></div>

                        {/* Главный контейнер с картинкой */}
                        <div className="relative z-10 bg-white/50 backdrop-blur-sm p-3 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                            <img src="https://images.unsplash.com/photo-1599696848652-f0ff23bc911f?auto=format&fit=crop&q=80&w=800" className="w-full h-auto aspect-[4/5] object-cover rounded-[24px]" alt="Hero Furniture" />
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* 2. FEATURES СЕКЦИЯ */}
            <div className="py-24 relative z-10">
                <div className="max-w-[1240px] mx-auto px-6 lg:px-10">

                    <motion.div
                        initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative"
                    >

                        {/* Карточка 1 */}
                        <div className="bg-gradient-to-br from-white/90 to-white/40 backdrop-blur-xl p-10 rounded-[24px] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all transform hover:-translate-y-2 relative overflow-hidden group">
                            <div className="w-14 h-14 bg-[#F5F5F5] rounded-[16px] flex items-center justify-center mb-8 group-hover:bg-white transition-colors shadow-sm">
                                <svg className="w-6 h-6 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4 relative z-10">5 Лет Опыта</h3>
                            <p className="text-gray-500 font-light leading-relaxed relative z-10">Сотни успешно реализованных проектов от строгих стульев до массивных переговорных столов.</p>
                        </div>

                        {/* Карточка 2 (асимметрия, смещена вниз) */}
                        <div className="bg-gradient-to-br from-[#EAE5DF]/70 to-white/50 backdrop-blur-xl p-10 rounded-[24px] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all transform hover:-translate-y-2 md:translate-y-12 relative overflow-hidden group">
                            <div className="w-14 h-14 bg-white/60 rounded-[16px] flex items-center justify-center mb-8 group-hover:bg-white transition-colors shadow-sm">
                                <svg className="w-6 h-6 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4 relative z-10">B2B & Проекты</h3>
                            <p className="text-gray-500 font-light leading-relaxed relative z-10">Оборудуем рестораны, архитектурные бюро и дома стильной мебелью, выдерживающей высокие нагрузки.</p>
                        </div>

                        {/* Карточка 3 */}
                        <div className="bg-gradient-to-br from-[#DDE2E0]/60 to-white/50 backdrop-blur-xl p-10 rounded-[24px] border border-white/60 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all transform hover:-translate-y-2 relative overflow-hidden group md:mt-0 mt-8">
                            <div className="w-14 h-14 bg-white/60 rounded-[16px] flex items-center justify-center mb-8 group-hover:bg-white transition-colors shadow-sm">
                                <svg className="w-6 h-6 text-[#1A1A1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                            </div>
                            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4 relative z-10">Чистые Материалы</h3>
                            <p className="text-gray-500 font-light leading-relaxed relative z-10">Только отборный массив, бережная шлифовка и натуральные масла с твердым воском для безупречного вида.</p>
                        </div>

                    </motion.div>
                </div>
            </div>

            {/* 3. PRODUCTS СЕКЦИЯ (2 КАРТОЧКИ В РЯД) */}
            <div className="py-32 relative z-10">
                <div className="max-w-[1240px] mx-auto px-6 lg:px-10">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
                        className="mb-16 flex flex-col lg:flex-row justify-between lg:items-end gap-6"
                    >
                        <div>
                            <span className="text-gray-400 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">Избранное</span>
                            <h2 className="text-5xl font-extrabold text-[#1A1A1A] tracking-tight">Популярные <span className="text-gray-400">Модели</span></h2>
                        </div>
                        <Link to="/catalog" className="text-[#1A1A1A] font-bold hover:text-gray-500 transition-colors uppercase tracking-wider text-sm flex items-center">
                            Весь каталог
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                        {featuredProducts.length === 0 ? (
                            <p className="text-gray-400 font-light">Каталог обновляется...</p>
                        ) : (
                            featuredProducts.map(p => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
                                    className="group relative bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-md rounded-[32px] p-6 lg:p-8 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all duration-500 hover:-translate-y-2 flex flex-col"
                                >
                                    <Link to={`/product/${p.id}`} className="overflow-hidden rounded-[24px] mb-8 bg-gray-50 aspect-[4/3] block relative">
                                        {p.image ? (
                                            <img src={getImageUrl(p.image)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" alt={p.name} />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-medium tracking-wide">Нет фото</div>
                                        )}
                                        {/* Мягкий оверлей градиента на фото */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[24px]" />
                                    </Link>

                                    <div className="flex justify-between items-start mb-4 gap-4">
                                        <h3 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] leading-tight flex-1">{p.name}</h3>
                                        <span className="text-lg font-bold text-[#1A1A1A] bg-white px-4 py-2 rounded-[16px] shadow-sm whitespace-nowrap">{p.price} ₸</span>
                                    </div>

                                    <p className="text-gray-500 font-light text-lg mb-8 flex-grow leading-relaxed line-clamp-2">{p.description}</p>

                                    <Link to={`/product/${p.id}`} className="w-full bg-white group-hover:bg-[#1A1A1A] group-hover:text-white text-[#1A1A1A] font-bold py-4 rounded-[20px] text-center transition-colors duration-300 shadow-sm">
                                        Подробнее
                                    </Link>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 4. ABOUT / КОНЦЕПЦИЯ СЕКЦИЯ */}
            <div className="py-32 relative overflow-hidden z-10">
                <div className="max-w-[1240px] mx-auto px-6 lg:px-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    <motion.div
                        initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <h2 className="text-5xl md:text-6xl font-extrabold text-[#1A1A1A] tracking-tight mb-8">Философия <br /><span className="text-gray-400">Формы</span></h2>
                        <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed mb-6">
                            Мы верим, что мебель не должна перекрикивать пространство. Наша задача — раскрыть естественную красоту дерева через выверенные пропорции и полное отсутствие лишних деталей.
                        </p>
                        <p className="text-lg text-gray-400 font-light leading-relaxed">
                            Каждый срез, шлифовка и стыковка выполняется вручную, сохраняя жизненную энергию массива.
                        </p>
                    </motion.div>

                    <div className="lg:w-1/2 grid grid-cols-2 gap-6 lg:gap-8 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/80 backdrop-blur-md p-8 lg:p-12 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white text-center flex flex-col justify-center"
                        >
                            <h4 className="text-5xl lg:text-7xl font-extrabold text-[#1A1A1A] mb-4">20+</h4>
                            <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Уникальных пород</p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, delay: 0.4 }}
                            className="bg-[#EAE5DF]/60 backdrop-blur-md p-8 lg:p-12 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-white text-center flex flex-col justify-center mt-12 lg:mt-20"
                        >
                            <h4 className="text-5xl lg:text-7xl font-extrabold text-[#1A1A1A] mb-4">1К+</h4>
                            <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Изделий в мире</p>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* 5. CTA БЛОК */}
            <div className="pb-32 px-6 lg:px-10 relative z-10 pt-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }}
                    className="max-w-[1240px] mx-auto bg-gradient-to-br from-[#1E1E1E] to-[#2A2A2A] rounded-[40px] p-12 lg:p-24 text-center relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)]"
                >
                    {/* Свечения на фоне темного блока */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#EAE5DF]/10 rounded-full filter blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-100/10 rounded-full filter blur-[80px] pointer-events-none"></div>

                    <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 relative z-10 tracking-tight">
                        Готовы создать <br />ваш проект?
                    </h2>

                    <p className="text-gray-400 text-xl md:text-2xl font-light max-w-3xl mx-auto mb-14 relative z-10 leading-relaxed">
                        Оставьте заявку, и мы бесплатно подготовим концепт, сделаем 3D-модель и рассчитаем стоимость вашего индивидуального заказа.
                    </p>

                    <Link to="/custom-order" className="inline-block bg-white text-[#1A1A1A] px-12 py-6 rounded-[24px] font-bold text-lg hover:scale-105 hover:shadow-[0_20px_40px_rgba(255,255,255,0.2)] transition-all duration-300 relative z-10">
                        Начать обсуждение
                    </Link>
                </motion.div>
            </div>

        </div>
    );
}
