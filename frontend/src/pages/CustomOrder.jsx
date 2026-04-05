import { motion } from 'framer-motion';

export default function CustomOrder() {
    const submitHandler = (e) => {
        e.preventDefault();
        alert('Заявка на индивидуальный заказ успешно отправлена!');
    };

    return (
        <div className="min-h-screen pt-32 pb-32 px-6 sm:px-12 lg:px-20 font-sans bg-brand-warm text-[#1a1a1a] relative overflow-hidden">
            {/* Глубина фона */}
            <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] bg-white rounded-full filter blur-[150px] opacity-70 pointer-events-none z-0"></div>

            <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32 relative z-10">

                {/* TEXT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}
                    className="flex-1 w-full"
                >
                    <h1 className="text-5xl md:text-7xl font-light text-[#1a1a1a] tracking-tight mb-8 leading-[1.05]">
                        Индивидуальный <br /><span className="text-[#1a1a1a]/40">проект.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-[#1a1a1a]/70 font-light mb-16 leading-relaxed max-w-lg">
                        От наброска до финального изделия. Опишите вашу идею, и мы подготовим смету.
                    </p>

                    <div className="space-y-12 max-w-md border-l border-[#1a1a1a]/10 pl-8">
                        <div className="relative">
                            <span className="absolute -left-[37px] top-1 w-2.5 h-2.5 bg-brand-dark3 rounded-full"></span>
                            <h4 className="text-sm uppercase tracking-[0.15em] text-[#1a1a1a] font-medium mb-3">01. Обсуждение</h4>
                            <p className="text-[#1a1a1a]/60 font-light text-base leading-relaxed">Выясняем сценарии использования, размеры и стилистику.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[37px] top-1 w-2.5 h-2.5 bg-[#1a1a1a]/10 rounded-full"></span>
                            <h4 className="text-sm uppercase tracking-[0.15em] text-[#1a1a1a] font-medium mb-3">02. Проектирование</h4>
                            <p className="text-[#1a1a1a]/60 font-light text-base leading-relaxed">Готовим чертеж и точную смету изделия.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[37px] top-1 w-2.5 h-2.5 bg-[#1a1a1a]/10 rounded-full"></span>
                            <h4 className="text-sm uppercase tracking-[0.15em] text-[#1a1a1a] font-medium mb-3">03. Производство</h4>
                            <p className="text-[#1a1a1a]/60 font-light text-base leading-relaxed">Отбираем массив и реализуем проект в дереве.</p>
                        </div>
                    </div>
                </motion.div>

                {/* FORM CONTAINER */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }}
                    className="flex-1 w-full"
                >
                    <h3 className="text-xl font-light text-[#1a1a1a] mb-10 tracking-tight">Запрос на расчет</h3>

                    <form className="space-y-10" onSubmit={submitHandler}>
                        <div>
                            <label className="block text-xs uppercase tracking-[0.15em] font-medium text-[#1a1a1a]/50 mb-4">Имя и фамилия</label>
                            <input required type="text" placeholder="Иван Иванов" className="w-full bg-transparent border-b border-[#1a1a1a]/20 focus:border-brand-dark3 py-3 outline-none transition-colors text-lg font-light text-[#1a1a1a] placeholder-[#1a1a1a]/30" />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-[0.15em] font-medium text-[#1a1a1a]/50 mb-4">Телефон</label>
                            <input required type="tel" placeholder="+7 (999) 000-00-00" className="w-full bg-transparent border-b border-[#1a1a1a]/20 focus:border-brand-dark3 py-3 outline-none transition-colors text-lg font-light text-[#1a1a1a] placeholder-[#1a1a1a]/30" />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-[0.15em] font-medium text-[#1a1a1a]/50 mb-4">Детали проекта</label>
                            <textarea required placeholder="Хочу дубовый стол 2х1 метр..." rows="4" className="w-full bg-transparent border-b border-[#1a1a1a]/20 focus:border-brand-dark3 py-3 outline-none transition-colors text-lg font-light text-[#1a1a1a] placeholder-[#1a1a1a]/30 resize-none"></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-6 bg-brand-dark1 hover:bg-brand-dark2 text-brand-light2 transition-colors duration-300 font-light text-lg uppercase tracking-[0.2em] mt-8"
                        >
                            Отправить заявку
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
