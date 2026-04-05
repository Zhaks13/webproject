import { motion } from 'framer-motion';

export default function Contacts() {
    return (
        <div className="min-h-screen pt-32 pb-32 px-6 sm:px-12 lg:px-20 font-sans bg-brand-warm text-[#1a1a1a] relative overflow-hidden">
            {/* Свечения фона */}
            <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-white rounded-full filter blur-[150px] opacity-60 pointer-events-none z-0"></div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }} className="mb-20">
                    <h1 className="text-5xl md:text-7xl font-light text-[#1a1a1a] tracking-tight mb-8">
                        Связь.
                    </h1>
                    <p className="max-w-xl text-lg text-[#1a1a1a]/70 font-light leading-relaxed">
                        Мы всегда открыты к диалогу. Задайте вопрос, обсудите проект или приходите в наш шоурум, чтобы прикоснуться к массиву лично.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32 border-t border-[#1a1a1a]/10 pt-16">
                    {/* Левая колонка - Контакты */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }} className="space-y-16">
                        <div>
                            <h3 className="text-xs uppercase tracking-[0.15em] text-[#1a1a1a] font-medium mb-6">Телефон</h3>
                            <p className="text-xl font-light text-[#1a1a1a]/70">+7 (999) 123-45-67</p>
                            <p className="text-lg font-light text-[#1a1a1a]/50 mt-2">Пн-Вс: 10:00 - 20:00</p>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase tracking-[0.15em] text-[#1a1a1a] font-medium mb-6">Шоурум</h3>
                            <p className="text-xl font-light text-[#1a1a1a]/70 leading-relaxed">
                                г. Алматы, пр. Абая 150<br />Уг. ул. Розыбакиева
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xs uppercase tracking-[0.15em] text-[#1a1a1a] font-medium mb-6">Соцсети</h3>
                            <div className="flex space-x-8">
                                <a href="#" className="text-lg font-light text-[#1a1a1a]/70 hover:text-brand-dark3 transition-colors border-b border-transparent hover:border-brand-dark3 pb-1">Instagram</a>
                                <a href="#" className="text-lg font-light text-[#1a1a1a]/70 hover:text-brand-dark3 transition-colors border-b border-transparent hover:border-brand-dark3 pb-1">Telegram</a>
                                <a href="#" className="text-lg font-light text-[#1a1a1a]/70 hover:text-brand-dark3 transition-colors border-b border-transparent hover:border-brand-dark3 pb-1">WhatsApp</a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Правая колонка - Карта/Имидж */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }} className="w-full">
                        <div className="aspect-[4/3] bg-brand-dark1 overflow-hidden relative flex items-center justify-center group p-8">
                            <div className="absolute inset-0 bg-brand-dark2 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"></div>
                            <div className="text-center relative z-10">
                                <h3 className="text-2xl font-light tracking-[0.1em] text-brand-light2 mb-2 uppercase text-sm">Шоурум WOODOO</h3>
                                <p className="text-brand-light1 font-light">Ждем вас в гости</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
