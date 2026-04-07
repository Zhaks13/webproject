import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../../utils/image';

export default function RelatedProducts({ products }) {
    if (!products || products.length === 0) return null;

    return (
        <div className="max-w-6xl mx-auto py-32 px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-16 flex items-end justify-between"
            >
                <div>
                    <h2 className="text-4xl font-semibold tracking-tight text-[#111] mb-2">Дополните интерьер</h2>
                    <p className="text-zinc-500 font-medium">Безупречное сочетание предметов коллекции.</p>
                </div>
                <Link to="/catalog" className="text-xs uppercase tracking-widest font-bold text-[#111] border-b border-[#111] pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors hidden md:block">
                    Весь каталог
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {products.map((p, idx) => (
                    <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.1 }}
                        className="group flex flex-col"
                    >
                        <Link to={`/product/${p.id}`} className="relative block aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 shadow-sm mb-6">
                            {p.image ? (
                                <img
                                    src={getImageUrl(p.image)}
                                    alt={p.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-bold uppercase tracking-widest text-zinc-400">Нет фото</div>
                            )}
                        </Link>
                        <div>
                            <Link to={`/product/${p.id}`} className="hover:opacity-75 transition-opacity">
                                <h3 className="font-semibold text-lg text-[#111] mb-1">{p.name}</h3>
                            </Link>
                            <p className="text-zinc-500 font-medium">{p.price} ₸</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 text-center md:hidden">
                <Link to="/catalog" className="text-xs uppercase tracking-widest font-bold text-[#111] border-b border-[#111] pb-1">
                    Весь каталог
                </Link>
            </div>
        </div>
    );
}
