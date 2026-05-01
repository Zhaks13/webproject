import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { getImageUrl } from '../utils/image';
import { useLang } from '../context/LanguageContext';

export default function Products() {
    const { t } = useLang();
    const c = t.catalog;

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    const handleOrder = (id) => {
        navigate(`/product/${id}`);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="bg-[#f5f5f5] text-[#111] min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-16 font-sans">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-16"
                >
                    <h1 className="text-6xl md:text-7xl font-semibold tracking-tight mb-6">
                        {c.title}
                    </h1>
                    <p className="max-w-xl text-lg text-zinc-500">
                        {c.desc}
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-start items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111]"></div>
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="py-20 text-zinc-500 text-lg"
                    >
                        {c.empty}
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {products.map(p => (
                            <motion.div
                                key={p.id}
                                variants={itemVariants}
                                className="group bg-white rounded-2xl shadow-sm overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col"
                            >
                                <div className="relative overflow-hidden cursor-pointer" onClick={() => handleOrder(p.id)}>
                                    {p.image ? (
                                        <img
                                            src={getImageUrl(p.image)}
                                            alt={p.name}
                                            className="h-[260px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="h-[260px] w-full bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs font-bold uppercase tracking-widest transition-transform duration-500 group-hover:scale-105">
                                            {c.noPhoto}
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2 gap-4">
                                        <Link to={`/product/${p.id}`} className="hover:opacity-80 transition-opacity">
                                            <h3 className="text-base font-medium text-[#111] leading-tight">{p.name}</h3>
                                        </Link>
                                        <span className="text-sm text-zinc-500 flex-shrink-0">
                                            {p.price} ₸
                                        </span>
                                    </div>

                                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 mb-6 flex-grow">
                                        {p.description}
                                    </p>

                                    <button
                                        onClick={() => handleOrder(p.id)}
                                        className="w-full bg-black text-white rounded-xl py-2 hover:opacity-90 font-medium transition-opacity mt-auto"
                                    >
                                        {c.details}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
