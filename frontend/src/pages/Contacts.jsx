export default function Contacts() {
    return (
        <div className="bg-[#f5f5f5] text-[#111] min-h-screen py-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">

                    {/* Левая колонка */}
                    <div className="flex flex-col justify-center">
                        <h1 className="text-6xl md:text-7xl font-semibold tracking-tight mb-8">
                            Связь.
                        </h1>
                        <p className="max-w-md text-lg text-zinc-500 leading-relaxed mb-16">
                            Мы всегда открыты к диалогу. Задайте вопрос, обсудите проект или приходите в наш шоурум, чтобы прикоснуться к массиву лично.
                        </p>

                        <div className="space-y-12">
                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-[#111] font-bold mb-4">Телефон</h3>
                                <p className="text-xl font-medium">+7 (999) 123-45-67</p>
                                <p className="text-zinc-500 mt-1">Пн-Вс: 10:00 - 20:00</p>
                            </div>

                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-[#111] font-bold mb-4">Шоурум</h3>
                                <p className="text-xl font-medium leading-relaxed">
                                    г. Алматы, пр. Абая 150<br />Уг. ул. Розыбакиева
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xs uppercase tracking-widest text-[#111] font-bold mb-4">Соцсети</h3>
                                <div className="flex flex-col gap-2">
                                    <a href="#" className="text-xl font-medium hover:text-zinc-500 transition-colors w-fit">Instagram</a>
                                    <a href="#" className="text-xl font-medium hover:text-zinc-500 transition-colors w-fit">Telegram</a>
                                    <a href="#" className="text-xl font-medium hover:text-zinc-500 transition-colors w-fit">WhatsApp</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка - Карта/Имидж */}
                    <div className="w-full flex items-center justify-center">
                        <div className="w-full aspect-square md:aspect-[4/5] bg-[#0f172a] rounded-2xl flex flex-col items-center justify-center p-8 shadow-sm">
                            <h3 className="text-2xl font-semibold tracking-tight text-white mb-2 uppercase text-sm">Шоурум WOODOO</h3>
                            <p className="text-slate-400">Ждем вас в гости</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
