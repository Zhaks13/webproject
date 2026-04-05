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

    return (
        <div className="min-h-screen bg-brand-warm pt-32 pb-32 px-6 sm:px-12 lg:px-20 font-sans relative overflow-hidden">
            <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] bg-white rounded-full filter blur-[150px] opacity-60 pointer-events-none"></div>

            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 relative z-10">

                {/* Фото товара */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="flex-1 w-full relative">
                    <div className="aspect-[4/5] overflow-hidden w-full h-full relative group">
                        <div className="absolute inset-0 bg-brand-dark1 opacity-0 group-hover:opacity-5 transition-opacity duration-700 z-10 pointer-events-none"></div>
                        {product.image ? (
                            <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#f0ede5] flex items-center justify-center text-[#1a1a1a]/30 font-light tracking-[0.2em] uppercase text-xs">Нет фото</div>
                        )}
                    </div>
                </motion.div>

                {/* Информация справа */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="flex-1 w-full flex flex-col justify-center">
                    <Link to="/catalog" className="uppercase tracking-[0.15em] text-[10px] text-[#1a1a1a]/50 mb-12 hover:text-[#1a1a1a] transition-colors inline-block w-max">
                        ← В каталог
                    </Link>

                    <h1 className="text-4xl lg:text-6xl font-light text-[#1a1a1a] tracking-tight mb-8 leading-[1.1]">{product.name}</h1>
                    <p className="text-2xl font-light text-brand-dark4 mb-12">{product.price} ₸</p>

                    <div className="w-full flex-grow">
                        <h3 className="text-sm uppercase tracking-[0.15em] text-[#1a1a1a] mb-6 font-medium">Об изделии</h3>
                        <p className="text-lg text-[#1a1a1a]/70 font-light leading-relaxed mb-16">{product.description}</p>

                        <div className="mb-16">
                            <h4 className="text-sm uppercase tracking-[0.15em] text-[#1a1a1a] mb-6 font-medium">Детали</h4>
                            <ul className="space-y-4 text-[#1a1a1a]/70 font-light text-base">
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-dark4 rounded-full mr-4 shrink-0 opacity-60"></span> Индивидуальные размеры под заказ</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-dark4 rounded-full mr-4 shrink-0 opacity-60"></span> Отборные породы массива дерева</li>
                                <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-dark4 rounded-full mr-4 shrink-0 opacity-60"></span> Натуральное финишное покрытие маслами</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={orderProduct}
                            disabled={ordering}
                            className={`w-full py-6 font-light text-lg uppercase tracking-[0.2em] transition-all duration-300 ${ordering ? 'opacity-50 cursor-not-allowed bg-brand-dark1 text-brand-light2' : 'bg-brand-dark1 text-brand-light2 hover:bg-brand-dark2'}`}
                        >
                            {ordering ? 'Обработка...' : 'Запросить расчет'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
