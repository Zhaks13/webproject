import { motion } from 'framer-motion';

export default function CTASection() {
    return (
        <div className="bg-[#111] text-white py-32 lg:py-48 px-6 text-center rounded-t-3xl border-t border-zinc-800">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-3xl mx-auto"
            >
                <h2 className="text-5xl md:text-8xl font-semibold tracking-tighter mb-8 leading-none">
                    Ощутите <br className="hidden md:block" />фактуру.
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 mb-16 max-w-lg mx-auto font-medium">
                    Приходите в наш шоурум, чтобы прикоснуться к массиву лично. Или свяжитесь с нами для обсуждения индивидуального проекта.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href="/contacts"
                        className="w-full sm:w-auto px-10 py-5 bg-white text-[#111] rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform duration-300 shadow-xl"
                    >
                        Наши контакты
                    </a>
                    <a
                        href="/custom-order"
                        className="w-full sm:w-auto px-10 py-5 bg-transparent text-white border border-zinc-700 hover:border-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all duration-300"
                    >
                        Индивидуальный заказ
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
