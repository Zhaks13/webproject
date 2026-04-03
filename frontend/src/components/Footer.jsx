export default function Footer() {
    return (
        <footer className="w-full bg-white mt-20 border-t border-gray-100 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
                <div>
                    <div className="flex justify-center md:justify-start items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded-full bg-gray-900"></div>
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight">WOODOO</h3>
                    </div>
                    <p className="text-gray-400 font-light text-sm">© {new Date().getFullYear()} Все права защищены. <br />Крафт, качество, минимализм.</p>
                </div>

                <div className="flex gap-8 text-sm font-medium text-gray-500">
                    <a href="#" className="hover:text-gray-900 transition-colors">Facebook</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Instagram</a>
                    <a href="#" className="hover:text-gray-900 transition-colors">Behance</a>
                </div>
            </div>
        </footer>
    );
}
