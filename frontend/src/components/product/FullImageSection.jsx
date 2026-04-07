import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { getImageUrl } from '../../../utils/image';

export default function FullImageSection({ image }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    if (!image) return null;

    return (
        <div ref={ref} className="w-full h-[60vh] md:h-[80vh] lg:h-screen overflow-hidden relative bg-[#111] mt-16 lg:mt-0">
            <motion.div
                style={{ scale, y }}
                className="w-full h-[120%] absolute -top-[10%] left-0"
            >
                <img
                    src={getImageUrl(image)}
                    alt="Atmosphere"
                    className="w-full h-full object-cover opacity-80"
                />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute bottom-12 left-6 lg:bottom-24 lg:left-24 text-white"
            >
                <p className="text-xs font-bold uppercase tracking-[0.3em] mb-4 opacity-70">Наследие массива</p>
                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">Вечная классика</h2>
            </motion.div>
        </div>
    );
}
