import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
    const loc = useLocation();
    const navigate = useNavigate();

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const token = localStorage.getItem('token');
    const isLoggedIn = !!user && !!token;
    const isAdmin = user && user.role === 'ADMIN';

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const links = [
        { path: '/', label: 'Главная' },
        { path: '/catalog', label: 'Каталог' },
        { path: '/custom-order', label: 'На заказ' },
        { path: '/contacts', label: 'Контакты' },
    ];

    return (
        <motion.nav
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100"
        >
            <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20 h-24 flex items-center justify-between">

                {/* Логотип */}
                <Link to="/" className="text-2xl font-bold tracking-tighter text-[#111] hover:opacity-70 transition-opacity">
                    WOODDOO
                </Link>

                {/* Центр - Ссылки (Десктоп) */}
                <div className="hidden md:flex items-center space-x-10">
                    {links.map(l => (
                        <Link key={l.path} to={l.path} className="relative group p-2">
                            <span className={`text-[11px] uppercase tracking-widest font-semibold transition-colors ${loc.pathname === l.path ? 'text-[#111]' : 'text-zinc-400 group-hover:text-[#111]'}`}>
                                {l.label}
                            </span>
                        </Link>
                    ))}
                    {isAdmin && (
                        <Link to="/admin" className="relative group p-2">
                            <span className={`text-[11px] uppercase tracking-widest font-semibold transition-colors ${loc.pathname === '/admin' ? 'text-[#111]' : 'text-zinc-400 group-hover:text-[#111]'}`}>
                                АДМИН
                            </span>
                        </Link>
                    )}
                </div>

                {/* Правая часть - Auth */}
                <div className="hidden md:flex items-center space-x-4">
                    {!isLoggedIn ? (
                        <Link
                            to="/auth"
                            className="px-6 py-2.5 bg-[#111] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 hover:scale-[1.02] transition-all duration-300"
                        >
                            ВХОД
                        </Link>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/profile"
                                className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 hover:text-[#111] transition-colors p-2"
                            >
                                ПРОФИЛЬ
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2.5 bg-zinc-100 text-[#111] rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300"
                            >
                                ВЫЙТИ
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </motion.nav>
    );
}
