import { motion } from 'framer-motion';

export default function CustomOrder() {
    const submitHandler = (e) => {
        e.preventDefault();
        alert('Заявка на индивидуальный заказ успешно отправлена!');
    };

    return (
        <div className="min-h-screen pt-12 pb-32 px-4 sm:px-6 relative overflow-hidden">
            {/* Background shape */}
            <div className="absolute top-20 right-[5%] w-[400px] h-[400px] bg-blue-50/80 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 z-0 hidden lg:block"></div>

            <div className="max-w-6xl mx-auto relative z-10 hidden md:block absolute -left-10 top-20 w-40 h-40 bg-gray-100 rounded-full filter blur-[80px] opacity-60"></div>

            <div className="max-w-[1200px] mx-auto relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start pt-10">

                {/* TEXT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
                    className="flex-1"
                >
                    <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-6 block hover:text-gray-600 transition-colors">
                        Кастомный проект
                    </span>
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#111] tracking-tight mb-8 leading-[1.1]">
                        Воплотим <br /><span className="text-gray-400">любую идею</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-500 font-light mb-12 leading-relaxed max-w-lg">
                        От наброска на салфетке до финального изделия. Опишите ваши пожелания, и мы свяжемся с вами для расчета стоимости и 3D визуализации.
                    </p>

                    <div className="space-y-6 max-w-lg">
                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-900 font-bold text-xl">1</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Обсуждение</h4>
                                <p className="text-gray-500 font-light text-sm sm:text-base leading-relaxed">Выясняем сценарии использования, размеры помещения и стилистические предпочтения.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-5 lg:ml-8">
                            <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white shadow-lg flex items-center justify-center flex-shrink-0 font-bold text-xl">2</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Эскиз и смета</h4>
                                <p className="text-gray-500 font-light text-sm sm:text-base leading-relaxed">Готовим подробный чертеж, рендеры и прозрачную подробную смету до копейки.</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex items-start gap-5 lg:ml-16">
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-900 font-bold text-xl">3</div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Производство</h4>
                                <p className="text-gray-500 font-light text-sm sm:text-base leading-relaxed">Отбираем лучшее дерево и приступаем к магии в нашем цеху.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* FORM CONTAINER */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="flex-1 w-full bg-white p-8 sm:p-12 rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 relative overflow-hidden"
                >
                    {/* subtle decoration inside card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-bl-full -z-10 opacity-70"></div>

                    <h3 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Отправить заявку</h3>

                    <form className="space-y-6" onSubmit={submitHandler}>
                        <div className="relative group">
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2 ml-2 transition-colors group-focus-within:text-gray-900">Имя и фамилия</label>
                            <input required type="text" placeholder="Иван Иванов" className="w-full bg-[#f8f9fa] border-transparent focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100/50 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400" />
                        </div>

                        <div className="relative group">
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2 ml-2 transition-colors group-focus-within:text-gray-900">Телефон (WhatsApp / Telegram)</label>
                            <input required type="tel" placeholder="+7 (999) 000-00-00" className="w-full bg-[#f8f9fa] border-transparent focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100/50 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-gray-900 placeholder-gray-400" />
                        </div>

                        <div className="relative group">
                            <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2 ml-2 transition-colors group-focus-within:text-gray-900">Описание идеи или ссылка на фото</label>
                            <textarea required placeholder="Хочу дубовый стол 2х1 метр, с живым краем..." rows="5" className="w-full bg-[#f8f9fa] border-transparent focus:border-gray-200 focus:bg-white focus:ring-4 focus:ring-gray-100/50 rounded-2xl px-6 py-5 outline-none transition-all duration-300 resize-none text-gray-900 placeholder-gray-400"></textarea>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                            className="w-full bg-gray-900 text-white font-bold text-lg rounded-[1.5rem] px-8 py-5 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:bg-black transition-all mt-6"
                        >
                            Запросить расчёт
                        </motion.button>
                        <p className="text-center text-[11px] text-gray-400 font-light mt-6 px-4 leading-relaxed">
                            Нажимая кнопку, вы подтверждаете согласие на обработку персональных данных.
                        </p>
                    </form>
                </motion.div>

            </div>
        </div>
    );
}
