import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api';
import { getImageUrl } from '../utils/image';
import OrderModal from '../components/OrderModal';
import ImageGallery from '../components/product/StickyGallery';
import ProductInfo from '../components/product/ProductInfo';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            const found = data.find(p => p.id === parseInt(id));
            setProduct(found);
            setAllProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user) {
            alert('Пожалуйста, войдите в систему, чтобы сделать заказ.');
            return;
        }
        setIsModalOpen(true);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-t-2 border-[#111] animate-spin"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center text-zinc-500">
            Товар не найден
        </div>
    );

    const related = allProducts.filter(p => p.id !== product.id).slice(0, 3);
    const mobileThumb = product.images?.[0] || product.image || null;

    return (
        <div className="bg-[#f5f5f5] text-[#111] min-h-screen font-sans">
            <OrderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                selectedOptions={{}}
            />

            {/* Мобильная навигация */}
            <div className="px-6 pt-8 pb-4 lg:hidden">
                <Link to="/catalog" className="text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-[#111] transition-colors">
                    ← Каталог
                </Link>
            </div>

            {/* Desktop: две колонки */}
            <div className="hidden lg:flex">
                {/* ЛЕВАЯ: галерея */}
                <div className="w-1/2 p-12 flex items-start pt-24">
                    <ImageGallery images={product.images} image={product.image} />
                </div>

                {/* ПРАВАЯ: ProductInfo */}
                <div className="w-1/2 overflow-y-auto">
                    <ProductInfo product={product} openModal={openModal} />
                </div>
            </div>

            {/* Мобильная версия */}
            <div className="lg:hidden px-6 pb-16">
                <div className="w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm mb-10">
                    {mobileThumb ? (
                        <img src={getImageUrl(mobileThumb)} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold uppercase tracking-widest">Нет фото</div>
                    )}
                </div>

                <h1 className="text-4xl font-semibold tracking-tight leading-[1.05] mb-4">{product.name}</h1>
                <p className="text-xl font-medium text-zinc-500 mb-10">{product.price} ₸</p>

                <div className="mb-10">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#111] mb-4">Об изделии</h3>
                    <p className="text-base text-zinc-500 leading-relaxed">{product.description}</p>
                </div>

                <div className="mb-10">
                    {[
                        ['Материалы', 'Массив дуба / ясеня / ореха.'],
                        ['Конфигурация', 'Индивидуальные размеры.'],
                        ['Срок изготовления', 'От 14 до 30 рабочих дней.'],
                    ].map(([title, desc]) => (
                        <div key={title} className="border-t border-zinc-200 py-5">
                            <h4 className="text-xs uppercase tracking-widest font-bold text-[#111] mb-1">{title}</h4>
                            <p className="text-sm text-zinc-500 font-medium">{desc}</p>
                        </div>
                    ))}
                    <div className="border-t border-zinc-200" />
                </div>

                <button
                    onClick={openModal}
                    className="w-full bg-[#111] text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                    Заказать проект
                </button>
            </div>

            {/* Related Products */}
            {related.length > 0 && (
                <div className="max-w-6xl mx-auto px-6 py-12 border-t border-zinc-200">
                    <h2 className="text-3xl font-semibold tracking-tight mb-12">Дополните интерьер</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {related.map((p, idx) => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group"
                            >
                                <Link to={`/product/${p.id}`}>
                                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100 mb-4 shadow-sm">
                                        {(p.images?.[0] || p.image) ? (
                                            <img
                                                src={getImageUrl(p.images?.[0] || p.image)}
                                                alt={p.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold uppercase tracking-widest">Нет фото</div>
                                        )}
                                    </div>
                                    <h3 className="font-semibold text-base text-[#111] mb-1 group-hover:opacity-80 transition-opacity">{p.name}</h3>
                                    <p className="text-sm text-zinc-500">{p.price} ₸</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* CTA Footer */}
            <div className="bg-[#111] text-white py-32 px-6 text-center rounded-t-3xl mt-16">
                <h2 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8">
                    Ощутите<br />фактуру.
                </h2>
                <p className="text-zinc-400 text-lg mb-12 max-w-md mx-auto">
                    Приходите в шоурум или обсудите индивидуальный проект с нашим мастером.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/contacts" className="px-10 py-4 bg-white text-[#111] rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">
                        Контакты
                    </Link>
                    <Link to="/custom-order" className="px-10 py-4 border border-zinc-700 hover:border-white text-white rounded-2xl text-xs font-bold uppercase tracking-widest transition-colors">
                        Индивидуальный заказ
                    </Link>
                </div>
            </div>
        </div>
    );
}
