import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import { api } from '../api';
import { getImageUrl } from '../utils/image';

export default function Cart() {
    const { items, removeItem, updateQuantity, clearCart, totalPrice, MIN_QTY, MAX_QTY } = useCart();
    const { t } = useLang();
    const c = t.cart;

    const [formData, setFormData] = useState({ name: '', phone: '', address: '', comment: '' });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [touched, setTouched] = useState({});
    const [unavailable, setUnavailable] = useState(new Set());

    // Pre-fill from user data if logged in
    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setFormData(prev => ({
                    ...prev,
                    name: user.name || prev.name,
                    phone: user.phone || prev.phone
                }));
            }
        } catch { /* ignore */ }
    }, []);

    // Validate cart items against actual products
    useEffect(() => {
        if (items.length === 0) return;
        api.get('/products')
            .then(res => {
                const productIds = new Set(res.data.map(p => p.id));
                const missing = new Set();
                items.forEach(item => {
                    if (!productIds.has(item.productId)) {
                        missing.add(item.productId);
                    }
                });
                setUnavailable(missing);
            })
            .catch(() => { /* silent - don't block checkout on network error */ });
    }, [items.length]);

    const hasUnavailable = items.some(i => unavailable.has(i.productId));

    const validate = () => {
        const errs = {};
        if (!formData.name.trim() || formData.name.trim().length < 2) errs.name = c.errName;
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (phoneDigits.length < 10) errs.phone = c.errPhone;
        return errs;
    };

    const errors = validate();
    const isValid = items.length > 0 && !hasUnavailable && Object.keys(errors).length === 0;

    const handleRemoveUnavailable = () => {
        unavailable.forEach(id => removeItem(id));
        setUnavailable(new Set());
    };

    const handleQuantityInput = (productId, rawValue) => {
        const cleaned = rawValue.replace(/\D/g, '');
        if (cleaned === '') return;
        const val = parseInt(cleaned, 10);
        if (val >= MIN_QTY && val <= MAX_QTY) {
            updateQuantity(productId, val);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, phone: true });

        if (!isValid) return;

        setSubmitting(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            await api.post('/orders', {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                address: formData.address.trim() || undefined,
                comment: formData.comment.trim() || undefined,
                type: 'PRODUCT',
                items: items.map(i => ({
                    productId: i.productId,
                    quantity: i.quantity
                }))
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            clearCart();
            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError(c.submitError);
        } finally {
            setSubmitting(false);
        }
    };

    const formatPrice = (n) => Number(n).toLocaleString('ru-RU');

    if (success) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.15 }}
                        className="w-20 h-20 rounded-full bg-[#111] text-white flex items-center justify-center mx-auto mb-8"
                    >
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </motion.div>
                    <h1 className="text-4xl font-semibold tracking-tight mb-4">{c.successTitle}</h1>
                    <p className="text-zinc-500 text-lg mb-10">{c.successDesc}</p>
                    <Link
                        to="/catalog"
                        className="inline-block px-10 py-4 bg-[#111] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        {c.continueShopping}
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center max-w-md"
                >
                    <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-8">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold tracking-tight mb-3">{c.emptyTitle}</h1>
                    <p className="text-zinc-500 mb-10">{c.emptyDesc}</p>
                    <Link
                        to="/catalog"
                        className="inline-block px-10 py-4 bg-[#111] text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        {c.goToCatalog}
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f5f5] font-sans text-[#111]">
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                    <Link to="/catalog" className="text-xs uppercase tracking-widest font-bold text-zinc-400 hover:text-[#111] transition-colors mb-4 inline-block">
                        ← {c.backToCatalog}
                    </Link>
                    <h1 className="text-5xl font-semibold tracking-tight">{c.title}</h1>
                </motion.div>

                {/* Unavailable items banner */}
                {hasUnavailable && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 flex items-center justify-between gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-200"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                            <p className="text-sm text-amber-800 font-medium">{c.unavailableWarning || 'Некоторые товары недоступны'}</p>
                        </div>
                        <button
                            onClick={handleRemoveUnavailable}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-xl transition-colors flex-shrink-0"
                        >
                            {c.removeUnavailable || 'Удалить'}
                        </button>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                    {/* Items list */}
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {items.map((item, idx) => {
                                const isItemUnavailable = unavailable.has(item.productId);
                                return (
                                    <motion.div
                                        key={item.productId}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                                        className={`flex items-center gap-5 bg-white rounded-2xl p-5 shadow-sm border transition-colors ${isItemUnavailable ? 'border-amber-200 bg-amber-50/50' : 'border-zinc-100'}`}
                                    >
                                        {/* Image */}
                                        <div className={`w-20 h-20 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 ${isItemUnavailable ? 'opacity-50' : ''}`}>
                                            {item.image ? (
                                                <img
                                                    src={getImageUrl(item.image)}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px] font-bold uppercase">
                                                    {c.noPhoto}
                                                </div>
                                            )}
                                        </div>

                                        {/* Name + Price */}
                                        <div className="flex-grow min-w-0">
                                            <h3 className={`font-semibold text-sm truncate mb-1 ${isItemUnavailable ? 'text-zinc-400 line-through' : ''}`}>
                                                {item.name}
                                            </h3>
                                            {isItemUnavailable ? (
                                                <p className="text-xs text-amber-600 font-semibold">{c.unavailableItem || 'Товар недоступен'}</p>
                                            ) : (
                                                <p className="text-zinc-500 text-sm">{formatPrice(item.price)} ₸</p>
                                            )}
                                        </div>

                                        {/* Quantity */}
                                        {!isItemUnavailable && (
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= MIN_QTY}
                                                    className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg font-medium select-none"
                                                >
                                                    −
                                                </button>
                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityInput(item.productId, e.target.value)}
                                                    onBlur={(e) => {
                                                        const val = parseInt(e.target.value, 10);
                                                        if (isNaN(val) || val < MIN_QTY) updateQuantity(item.productId, MIN_QTY);
                                                        else if (val > MAX_QTY) updateQuantity(item.productId, MAX_QTY);
                                                    }}
                                                    className="w-12 text-center text-sm font-semibold bg-transparent border-none outline-none"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    disabled={item.quantity >= MAX_QTY}
                                                    className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-600 hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-lg font-medium select-none"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}

                                        {/* Subtotal */}
                                        {!isItemUnavailable && (
                                            <p className="font-semibold text-sm w-24 text-right flex-shrink-0">
                                                {formatPrice(item.price * item.quantity)} ₸
                                            </p>
                                        )}

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeItem(item.productId)}
                                            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-50 active:scale-95 transition-all"
                                            title={c.removeItem || 'Удалить'}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                                <path d="M18 6L6 18" /><path d="M6 6L18 18" />
                                            </svg>
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar: Summary + Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:sticky lg:top-32 self-start"
                    >
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 mb-6">
                            <h2 className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-4">{c.summary}</h2>
                            <div className="space-y-3 mb-6">
                                {items.filter(i => !unavailable.has(i.productId)).map(item => (
                                    <div key={item.productId} className="flex justify-between text-sm">
                                        <span className="text-zinc-600 truncate mr-3">{item.name} × {item.quantity}</span>
                                        <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)} ₸</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-zinc-100 pt-4 flex justify-between items-center">
                                <span className="text-sm font-bold uppercase tracking-widest">{c.total}</span>
                                <span className="text-2xl font-semibold">{formatPrice(totalPrice)} ₸</span>
                            </div>
                        </div>

                        {/* Order form */}
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                            <h2 className="text-xs uppercase tracking-widest font-bold text-zinc-400 mb-5">{c.orderData}</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">{c.name} *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        onBlur={() => setTouched(p => ({ ...p, name: true }))}
                                        placeholder={c.namePlaceholder}
                                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${touched.name && errors.name ? 'border-red-300 bg-red-50/60' : 'border-zinc-200 bg-zinc-50 focus:border-[#111] focus:bg-white'}`}
                                    />
                                    {touched.name && errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">{c.phone} *</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        onBlur={() => setTouched(p => ({ ...p, phone: true }))}
                                        placeholder="+7 (___) ___-__-__"
                                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${touched.phone && errors.phone ? 'border-red-300 bg-red-50/60' : 'border-zinc-200 bg-zinc-50 focus:border-[#111] focus:bg-white'}`}
                                    />
                                    {touched.phone && errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">{c.address}</label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                        placeholder={c.addressPlaceholder}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm outline-none transition-all focus:border-[#111] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">{c.comment}</label>
                                    <textarea
                                        rows="3"
                                        value={formData.comment}
                                        onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                                        placeholder={c.commentPlaceholder}
                                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 text-sm outline-none transition-all focus:border-[#111] focus:bg-white resize-none"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!isValid || submitting}
                                className={`w-full mt-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!isValid || submitting
                                        ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                                        : 'bg-[#111] text-white hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-black/10'
                                    }`}
                            >
                                {submitting && (
                                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                )}
                                {submitting ? c.submitting : c.submitOrder}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
