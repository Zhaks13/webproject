import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
    const loc = useLocation();
    const links = [
        { path: '/', label: 'Главная' },
        { path: '/catalog', label: 'Каталог' },
        { path: '/custom-order', label: 'На заказ' },
        { path: '/contacts', label: 'Контакты' },
    ];

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: 'easeOut' }}
            className="fixed top-0 inset-x-0 z-50 bg-[#051F20]/40 backdrop-blur-md"
        >
            <div className="flex items-center justify-between w-full lg:px-12 px-6 h-20 max-w-[1600px] mx-auto">
                <Link to="/" className="text-xl font-light tracking-[0.15em] text-[#DAF1DE] hover:text-white transition-colors">
                    WOODDOO
                </Link>

                <div className="hidden md:flex items-center space-x-12">
                    {links.map(l => (
                        <Link key={l.path} to={l.path} className="relative group p-2">
                            <span className={`text-sm uppercase tracking-[0.1em] font-light transition-colors ${loc.pathname === l.path ? 'text-white' : 'text-[#DAF1DE]/70 group-hover:text-[#DAF1DE]'}`}>
                                {l.label}
                            </span>
                        </Link>
                    ))}
                </div>

                <Link to="/admin" className="hidden md:flex items-center justify-center p-2 text-[#DAF1DE]/70 hover:text-[#DAF1DE] transition-colors">
                    <span className="text-sm uppercase tracking-[0.1em] font-light">ВХОД</span>
                </Link>
            </div>
        </motion.nav>
    );
}
