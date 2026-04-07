import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { getImageUrl } from '../../utils/image';

export default function StickyGallery({ containerRef, image }) {
    const images = [image, image, image];

    const [currentIndex, setCurrentIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    });

    useEffect(() => {
        return scrollYProgress.on('change', (latest) => {
            if (latest < 0.33) {
                setCurrentIndex(0);
            } else if (latest < 0.66) {
                setCurrentIndex(1);
            } else {
                setCurrentIndex(2);
            }
        });
    }, [scrollYProgress]);

    return (
        <div className="w-full h-[85vh] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm relative">
            <AnimatePresence mode="wait">
                {images[currentIndex] ? (
                    <motion.img
                        key={currentIndex}
                        src={getImageUrl(images[currentIndex])}
                        alt={`View ${currentIndex + 1}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        Нет фото
                    </div>
                )}
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentIndex === i ? 'bg-white scale-125' : 'bg-white/40'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
}
