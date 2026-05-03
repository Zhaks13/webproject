import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import ImageGallery from '../components/product/StickyGallery';
import { getImageUrl } from '../utils/image';

const formatPrice = (n) => Number(n).toLocaleString('ru-RU');

/* ─── QUANTITY SELECTOR ─────────────────────────────── */

function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
    return (
        <div className="flex items-center border border-zinc-200 rounded-xl overflow-hidden bg-white w-fit h-12">
            <button
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                className="w-12 h-full flex items-center justify-center text-lg font-medium text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
            >
                −
            </button>
            <span className="w-12 h-full flex items-center justify-center text-sm font-semibold border-x border-zinc-200 select-none">
                {value}
            </span>
            <button
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                className="w-12 h-full flex items-center justify-center text-lg font-medium text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
            >
                +
            </button>
        </div>
    );
}

export default function ProductDetails() {
    const { id } = useParams();
    const { addItem } = useCart();
    const { t } = useLang();
    const p = t.product;

    const [product, setProduct] = useState(null);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        setQuantity(1);
        setAdded(false);
        loadData();
        window.scrollTo(0, 0);
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/products');
            setProduct(data.find(pr => pr.id === parseInt(id)));
            setAllProducts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || product.image || null,
            quantity
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-t-2 border-[#111] animate-spin" />
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center text-zinc-500">
            Товар не найден
        </div>
    );

    const relatedProducts = allProducts.filter(item => item.id !== product.id).slice(0, 4);

    return (
        <div className="bg-[#f5f5f5] text-[#111] min-h-screen font-sans pb-10">
            <div className="max-w-[1240px] mx-auto px-6 py-8">

                {/* ── Breadcrumb ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 lg:mb-10">
                    <Link to="/catalog" className="text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-[#111] transition-colors">
                        {p.backToCatalog}
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* ── LEFT: Sticky Gallery ── */}
                    <div className="lg:sticky lg:top-24 self-start">
                        <ImageGallery images={product.images} image={product.image} />
                    </div>

                    {/* ── RIGHT: Product Info ── */}
                    <div className="h-full pt-2 lg:pt-0">
                        {/* RIGHT COL CONTENT WRAPPER */}
                        <div className="flex flex-col h-full justify-between max-w-[520px]">

                            {/* TOP BLOCK */}
                            <div>
                                {/* Title & Price */}
                                <motion.h1
                                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] mb-3"
                                >
                                    {product.name}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                    className="text-2xl font-bold mb-8 text-[#111]"
                                >
                                    {formatPrice(product.price)} ₸
                                </motion.p>

                                {/* Controls */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="flex flex-col sm:flex-row gap-4 mb-4"
                                >
                                    <QuantitySelector value={quantity} onChange={setQuantity} />

                                    <button
                                        onClick={handleAddToCart}
                                        className={`flex-1 h-12 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-sm ${added
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                                                : 'bg-[#111] text-white hover:opacity-90 active:scale-[0.98]'
                                            }`}
                                    >
                                        {added ? p.addedToCart || '✓ Добавлено' : p.addToCart || 'Добавить в корзину'}
                                    </button>
                                </motion.div>
                            </div>

                            {/* BOTTOM BLOCK: Descriptions */}
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                                className="mt-16 flex flex-col gap-6"
                            >
                                {/* Philosophy */}
                                <div>
                                    <h3 className="text-xs uppercase tracking-widest font-bold text-[#111] mb-2">
                                        {p.philosophy}
                                    </h3>
                                    <p className="text-[15px] text-zinc-500 leading-snug font-medium">
                                        {product.description || p.woodText}
                                    </p>
                                </div>

                                {/* Specs */}
                                <div className="border-t border-zinc-200 pt-6 flex flex-col gap-5">
                                    {p.specs.map(([title, desc], i) => (
                                        <div key={i}>
                                            <h4 className="text-xs uppercase tracking-widest font-bold text-[#111] mb-1">{title}</h4>
                                            <p className="text-[14px] text-zinc-500 font-medium leading-snug">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>
                    </div>
                </div>

                {/* ── RELATED PRODUCTS ── */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 mb-24 lg:mt-32">
                        <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight mb-8 text-[#111]">
                            Похожие товары
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((pr) => (
                                <Link
                                    to={`/product/${pr.id}`}
                                    key={pr.id}
                                    className="group flex flex-col gap-3"
                                >
                                    <div className="w-full aspect-square rounded-2xl overflow-hidden bg-zinc-100 flex items-center justify-center relative shadow-sm">
                                        {(pr.images?.[0] || pr.image) ? (
                                            <img
                                                src={getImageUrl(pr.images?.[0] || pr.image)}
                                                alt={pr.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                        ) : (
                                            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Нет фото</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-sm text-[#111] mb-1 group-hover:text-zinc-600 transition-colors truncate">
                                            {pr.name}
                                        </h3>
                                        <p className="text-sm text-zinc-500 font-medium">
                                            {formatPrice(pr.price)} ₸
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
