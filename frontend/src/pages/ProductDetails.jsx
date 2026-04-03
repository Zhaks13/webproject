import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api';
import { getImageUrl } from '../utils/image';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ordering, setOrdering] = useState(false);

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            const { data } = await api.get('/products');
            const found = data.find(p => p.id === parseInt(id));
            setProduct(found);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const orderProduct = async () => {
        setOrdering(true);
        try {
            await api.post('/orders', {
                customerName: 'Заказ со страницы',
                phone: 'Не указан',
                productId: product.id
            });
            alert('Заказ успешно отправлен!');
        } catch (e) {
            alert('Ошибка при оформлении заказа');
        } finally {
            setOrdering(false);
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>;
    if (!product) return <div className="min-h-screen flex justify-center items-center"><h2 className="text-2xl text-gray-500 font-light">Товар не найден</h2></div>;

    return (
        <div className="min-h-screen pt-12 pb-32 px-4 sm:px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10 pt-10">

                {/* Фото товара */}
                <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="flex-1 w-full relative">
                    <div className="aspect-square bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden p-4">
                        {product.image ? (
                            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover rounded-[2.5rem]" />
                        ) : (
                            <div className="w-full h-full bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-400 font-medium">Нет фото</div>
                        )}
                    </div>
                </motion.div>

                {/* Информация справа */}
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="flex-1 w-full pt-8 lg:pt-16">
                    <Link to="/catalog" className="text-xs font-bold tracking-[0.1em] text-gray-400 uppercase mb-8 inline-flex items-center hover:text-gray-900 transition-colors">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Назад в каталог
                    </Link>

                    <h1 className="text-5xl lg:text-6xl font-extrabold text-[#111] tracking-tight mb-4 leading-tight">{product.name}</h1>
                    <p className="text-3xl font-bold text-gray-900 mb-10 bg-gray-100 w-max px-4 py-2 rounded-2xl">{product.price} ₸</p>

                    <div className="h-px w-full bg-gray-200 mb-10"></div>

                    <h3 className="text-xl font-bold text-gray-900 mb-4">Описание</h3>
                    <p className="text-lg text-gray-500 font-light leading-relaxed mb-12">{product.description}</p>

                    <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-50 mb-10">
                        <h4 className="font-bold text-gray-900 mb-4">Опции кастомизации</h4>
                        <ul className="space-y-4 text-gray-500 font-light text-sm sm:text-base">
                            <li className="flex items-start"><span className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-3 mt-0.5 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span> Любые размеры (+/- 20% к стоимости)</li>
                            <li className="flex items-start"><span className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-3 mt-0.5 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span> Выбор породы дерева (Дуб, Ясень, Орех)</li>
                            <li className="flex items-start"><span className="w-6 h-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center mr-3 mt-0.5 shrink-0"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></span> Более 15 оттенков итальянского масла</li>
                        </ul>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                        onClick={orderProduct}
                        disabled={ordering}
                        className={`w-full py-5 rounded-[1.5rem] font-bold text-lg text-white shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-all ${ordering ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-black hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)]'}`}
                    >
                        {ordering ? 'АВТОРИЗАЦИЯ...' : 'В корзину'}
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
