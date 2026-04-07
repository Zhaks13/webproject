export default function CustomOrder() {
    const submitHandler = (e) => {
        e.preventDefault();
        alert('Заявка на индивидуальный заказ успешно отправлена!');
    };

    return (
        <div className="bg-[#f5f5f5] text-[#111] min-h-screen py-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-20">

                {/* TEXT CONTENT */}
                <div className="flex-1 w-full flex flex-col justify-center">
                    <h1 className="text-6xl md:text-7xl font-semibold tracking-tight mb-8">
                        Индивидуальный <br className="hidden md:block" />
                        <span className="text-zinc-400">проект.</span>
                    </h1>
                    <p className="text-lg text-zinc-500 mb-16 leading-relaxed max-w-md">
                        От наброска до финального изделия. Опишите вашу идею, и мы подготовим смету.
                    </p>

                    <div className="space-y-12 max-w-md border-l-2 border-zinc-200 pl-8 relative">
                        <div className="relative">
                            <span className="absolute -left-[37px] top-1.5 w-3 h-3 bg-[#111] rounded-full ring-4 ring-[#f5f5f5]"></span>
                            <h4 className="text-xs uppercase tracking-widest text-[#111] font-bold mb-2">01. Обсуждение</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Выясняем сценарии использования, размеры и стилистику.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[37px] top-1.5 w-3 h-3 bg-zinc-300 rounded-full ring-4 ring-[#f5f5f5]"></span>
                            <h4 className="text-xs uppercase tracking-widest text-[#111] font-bold mb-2">02. Проектирование</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Готовим чертеж и точную смету изделия.</p>
                        </div>
                        <div className="relative">
                            <span className="absolute -left-[37px] top-1.5 w-3 h-3 bg-zinc-300 rounded-full ring-4 ring-[#f5f5f5]"></span>
                            <h4 className="text-xs uppercase tracking-widest text-[#111] font-bold mb-2">03. Производство</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">Отбираем массив и реализуем проект в дереве.</p>
                        </div>
                    </div>
                </div>

                {/* FORM CONTAINER */}
                <div className="flex-1 w-full flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold text-[#111] mb-10 tracking-tight">Запрос на расчет</h3>

                    <form className="space-y-8" onSubmit={submitHandler}>
                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">Имя и фамилия</label>
                            <input
                                required
                                type="text"
                                placeholder="Иван Иванов"
                                className="w-full bg-transparent border-b border-zinc-300 focus:border-[#111] py-3 outline-none transition-colors text-lg font-medium text-[#111] placeholder-zinc-300"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">Телефон</label>
                            <input
                                required
                                type="tel"
                                placeholder="+7 (999) 000-00-00"
                                className="w-full bg-transparent border-b border-zinc-300 focus:border-[#111] py-3 outline-none transition-colors text-lg font-medium text-[#111] placeholder-zinc-300"
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">Детали проекта</label>
                            <textarea
                                required
                                placeholder="Хочу дубовый стол 2х1 метр..."
                                rows="4"
                                className="w-full bg-transparent border-b border-zinc-300 focus:border-[#111] py-3 outline-none transition-colors text-lg font-medium text-[#111] placeholder-zinc-300 resize-none"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#111] text-white rounded-xl font-bold uppercase tracking-widest hover:opacity-90 transition-opacity mt-4"
                        >
                            Отправить заявку
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
