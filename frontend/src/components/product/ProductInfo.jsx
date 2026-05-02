import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLang } from '../../context/LanguageContext';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: { duration: 0.6, ease: 'easeOut', delay }
});

export default function ProductInfo({ product, onAddToCart, added, mobile }) {
    const { t } = useLang();
    const p = t.product;
    const isLg = !mobile;

    return (
        <div className={`w-full flex flex-col justify-start ${isLg ? 'pt-32 px-16 lg:min-h-[250vh]' : 'px-6'}`}>
            {/* Навигация */}
            <Link
                to="/catalog"
                className="text-xs uppercase tracking-widest text-zinc-400 font-bold hover:text-[#111] transition-colors mb-12 inline-block"
            >
                {p.backToCatalog}
            </Link>

            {/* Заголовок */}
            <motion.h1
                {...fadeUp(0)}
                className="text-5xl lg:text-7xl font-semibold tracking-tight leading-[1.05] mb-6"
            >
                {product.name}
            </motion.h1>

            {/* Цена */}
            <motion.p
                {...fadeUp(0.1)}
                className="text-2xl font-medium text-zinc-500 mb-16"
            >
                {product.price} ₸
            </motion.p>

            {/* Описание */}
            <motion.div {...fadeUp(0.2)} className="mb-16">
                <h3 className="text-xs uppercase tracking-widest font-bold text-[#111] mb-4">{p.philosophy}</h3>
                <p className="text-base text-zinc-500 leading-relaxed">
                    {product.description}
                </p>
                <p className="text-base text-zinc-500 leading-relaxed mt-6">
                    {p.woodText}
                </p>
            </motion.div>

            {/* Характеристики */}
            <motion.div {...fadeUp(0.3)} className="mb-16">
                {p.specs.map(([title, desc]) => (
                    <div key={title} className="border-t border-zinc-200 py-5">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-[#111] mb-1">{title}</h4>
                        <p className="text-sm text-zinc-500 font-medium">{desc}</p>
                    </div>
                ))}
                <div className="border-t border-zinc-200" />
            </motion.div>

            {/* Кнопка */}
            <div className={`${isLg ? 'sticky bottom-12' : 'mb-16'}`}>
                <motion.button
                    {...fadeUp(0.4)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onAddToCart}
                    className={`w-full max-w-md py-5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl shadow-black/10 ${added
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#111] text-white hover:opacity-90'
                        }`}
                >
                    {added ? (p.addedToCart || '✓ Добавлено') : (p.addToCart || 'Добавить в корзину')}
                </motion.button>
            </div>
        </div>
    );
}
