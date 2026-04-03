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
            initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="fixed top-0 inset-x-0 z-50 flex justify-center pt-6 px-4"
        >
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-full px-8 py-4 flex items-center justify-between w-full max-w-5xl">
                <Link to="/" className="text-xl font-extrabold tracking-tighter text-gray-900 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                    WOODOO
                </Link>

                <div className="hidden md:flex items-center space-x-1">
                    {links.map(l => (
                        <Link key={l.path} to={l.path} className="relative px-5 py-2 group">
                            <span className={`relative z-10 font-medium transition-colors duration-300 ${loc.pathname === l.path ? 'text-white' : 'text-gray-600 group-hover:text-gray-900'}`}>{l.label}</span>
                            {loc.pathname === l.path && (
                                <motion.div layoutId="nav-pill" className="absolute inset-0 bg-gray-900 rounded-full z-0" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                            )}
                        </Link>
                    ))}
                </div>

                <Link to="/admin" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </Link>
            </div>
        </motion.nav>
    );
}
