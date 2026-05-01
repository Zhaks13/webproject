import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../utils/image';

export default function ImageGallery({ images, image }) {
    // Поддержка images[] и fallback на старый image
    const imgs = (images?.length ? images : image ? [image] : []).filter(Boolean);

    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1); // 1 = вперёд, -1 = назад

    const go = (dir) => {
        setDirection(dir);
        setCurrent(prev => {
            const next = prev + dir;
            if (next < 0) return imgs.length - 1;
            if (next >= imgs.length) return 0;
            return next;
        });
    };

    if (imgs.length === 0) {
        return (
            <div className="w-full h-[85vh] rounded-2xl bg-zinc-100 shadow-sm flex items-center justify-center text-zinc-400 text-xs font-bold uppercase tracking-widest">
                Нет фото
            </div>
        );
    }

    return (
        <div className="w-full h-[85vh] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm relative select-none">
            {/* Изображение */}
            <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                    key={current}
                    custom={direction}
                    src={getImageUrl(imgs[current])}
                    alt={`View ${current + 1}`}
                    variants={{
                        enter: (d) => ({ opacity: 0, scale: 1.04, x: d > 0 ? 30 : -30 }),
                        center: { opacity: 1, scale: 1, x: 0 },
                        exit: (d) => ({ opacity: 0, scale: 0.98, x: d > 0 ? -30 : 30 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </AnimatePresence>

            {/* Кнопки ← → (только если > 1 фото) */}
            {imgs.length > 1 && (
                <>
                    <button
                        onClick={() => go(-1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Предыдущее фото"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <button
                        onClick={() => go(1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
                        aria-label="Следующее фото"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>

                    {/* Dots */}
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {imgs.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                className={`rounded-full transition-all duration-400 ${i === current
                                        ? 'w-5 h-1.5 bg-white'
                                        : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Счётчик */}
                    <div className="absolute top-4 right-4 z-10 bg-black/30 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                        {current + 1} / {imgs.length}
                    </div>
                </>
            )}
        </div>
    );
}
