export default function Footer() {
    return (
        <footer className="w-full bg-brand-dark1 border-t border-brand-dark2 py-16 px-6 lg:px-12 relative overflow-hidden">
            {/* Мягкие свечения в футере */}
            <div className="absolute bottom-[0%] left-[5%] w-[40vw] h-[40vw] bg-brand-dark3 rounded-full filter blur-[150px] opacity-40 mix-blend-screen pointer-events-none z-0"></div>

            <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-10 relative z-10">
                <div className="flex flex-col items-center md:items-start">
                    <h3 className="font-light tracking-[0.2em] uppercase text-brand-light2 text-lg mb-4 hover:text-brand-light1 transition-colors">WOODOO</h3>
                    <p className="text-brand-light2/60 font-light text-sm">
                        © {new Date().getFullYear()} Форма и Суть. <br />Все права защищены.
                    </p>
                </div>

                <div className="flex gap-8 text-xs font-medium text-brand-light2/60 uppercase tracking-[0.15em]">
                    <a href="#" className="hover:text-brand-light1 transition-colors">Facebook</a>
                    <a href="#" className="hover:text-brand-light1 transition-colors">Instagram</a>
                    <a href="#" className="hover:text-brand-light1 transition-colors">Behance</a>
                </div>
            </div>
        </footer>
    );
}
