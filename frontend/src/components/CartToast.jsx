import { AnimatePresence, motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LanguageContext';

export default function CartToast() {
    const { toast, dismissToast } = useCart();
    const { t } = useLang();

    return (
        <AnimatePresence>
            {toast && (
                <motion.div
                    initial={{ opacity: 0, y: -30, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: -20, x: '-50%' }}
                    transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                    className="fixed top-28 left-1/2 z-[80] flex items-center gap-3 px-5 py-3.5 bg-[#111] text-white rounded-2xl shadow-2xl shadow-black/20 max-w-sm"
                    onClick={dismissToast}
                    role="status"
                    aria-live="polite"
                >
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wider opacity-70">
                            {t.product?.addedToCart || '✓ Добавлено'}
                        </p>
                        <p className="text-sm font-medium truncate">{toast}</p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
