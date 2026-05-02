import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';
import { getImageUrl } from '../utils/image';

export default function MiniCart({ isOpen, onClose }) {
    const { items, removeItem, updateQuantity, totalPrice, MIN_QTY, MAX_QTY } = useCart();
    const { t } = useLang();
    const c = t.cart;
    const panelRef = useRef(null);

    useEffect(() => {
        if (!isOpen) return;
        const handleClick = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                onClose();
            }
        };
        const handleKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [isOpen, onClose]);

    const formatPrice = (n) => Number(n).toLocaleString('ru-RU');

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={panelRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
                            <h2 className="text-lg font-semibold tracking-tight">{c.title}</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-[#111] hover:bg-zinc-100 transition-all"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <path d="M18 6L6 18" /><path d="M6 6L18 18" />
                                </svg>
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="9" cy="21" r="1" />
                                            <circle cx="20" cy="21" r="1" />
                                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                        </svg>
                                    </div>
                                    <p className="text-zinc-500 text-sm font-medium">{c.emptyTitle}</p>
                                    <p className="text-zinc-400 text-xs mt-1">{c.emptyDesc}</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {items.map(item => (
                                        <div key={item.productId} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50/80 border border-zinc-100">
                                            {/* Image */}
                                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-zinc-100 flex-shrink-0">
                                                {item.image ? (
                                                    <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[8px] font-bold uppercase">{c.noPhoto}</div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{item.name}</p>
                                                <p className="text-xs text-zinc-500">{formatPrice(item.price)} ₸</p>
                                            </div>

                                            {/* Qty controls */}
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= MIN_QTY}
                                                    className="w-6 h-6 rounded bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 hover:bg-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >−</button>
                                                <span className="w-7 text-center text-xs font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    disabled={item.quantity >= MAX_QTY}
                                                    className="w-6 h-6 rounded bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600 hover:bg-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >+</button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center text-zinc-400 hover:text-red-500 transition-colors"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                                    <path d="M18 6L6 18" /><path d="M6 6L18 18" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-zinc-100 px-6 py-5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">{c.total}</span>
                                    <span className="text-xl font-semibold">{formatPrice(totalPrice)} ₸</span>
                                </div>
                                <Link
                                    to="/cart"
                                    onClick={onClose}
                                    className="block w-full py-3.5 bg-[#111] text-white rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:opacity-90 transition-opacity shadow-lg shadow-black/10"
                                >
                                    {c.goToCart || 'Перейти в корзину'}
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
