import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import LanguageSwitcher from './LanguageSwitcher';
import MiniCart from './MiniCart';

export default function Navbar() {
    const loc = useLocation();
    const navigate = useNavigate();
    const { t } = useLang();
    const n = t.nav;
    const { itemCount } = useCart();

    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [miniCartOpen, setMiniCartOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 50) {
                setVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setVisible(false);
            } else if (currentScrollY < lastScrollY) {
                setVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

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

    const handleCartClick = useCallback((e) => {
        e.preventDefault();
        setMiniCartOpen(true);
    }, []);

    const links = [
        { path: '/', label: n.home },
        { path: '/catalog', label: n.catalog },
        { path: '/custom-order', label: n.customOrder },
        { path: '/contacts', label: n.contacts },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100 transition-transform duration-300 ease-in-out ${visible ? 'translate-y-0' : '-translate-y-full'}`}
            >
                <div className="w-full max-w-[1400px] mx-auto px-6 lg:px-12 xl:px-20 h-24 flex items-center justify-between">

                    {/* Логотип */}
                    <Link to="/" className="text-2xl font-bold tracking-tighter text-[#111] hover:opacity-70 transition-opacity">
                        Stolyarniy Dvor
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
                                    {n.admin}
                                </span>
                            </Link>
                        )}
                    </div>

                    {/* Правая часть - Cart + Auth + Language Switcher */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Cart button → opens mini-cart */}
                        <button
                            onClick={handleCartClick}
                            className="relative group p-2 flex items-center gap-1.5"
                            aria-label={n.cart}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`transition-colors ${loc.pathname === '/cart' ? 'text-[#111]' : 'text-zinc-400 group-hover:text-[#111]'}`}>
                                <circle cx="9" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            <span className={`text-[11px] uppercase tracking-widest font-semibold transition-colors ${loc.pathname === '/cart' ? 'text-[#111]' : 'text-zinc-400 group-hover:text-[#111]'}`}>
                                {n.cart}
                            </span>
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#111] text-white text-[10px] font-bold leading-none animate-[pulse_0.3s_ease-in-out]">
                                    {itemCount > 99 ? '99+' : itemCount}
                                </span>
                            )}
                        </button>

                        {!isLoggedIn ? (
                            <Link
                                to="/auth"
                                className="px-6 py-2.5 bg-[#111] text-white rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 hover:scale-[1.02] transition-all duration-300"
                            >
                                {n.login}
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/profile"
                                    className="text-[11px] uppercase tracking-widest font-semibold text-zinc-400 hover:text-[#111] transition-colors p-2"
                                >
                                    {n.profile}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="px-6 py-2.5 bg-zinc-100 text-[#111] rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300"
                                >
                                    {n.logout}
                                </button>
                            </div>
                        )}
                        <LanguageSwitcher />
                    </div>

                </div>
            </nav>

            <MiniCart isOpen={miniCartOpen} onClose={() => setMiniCartOpen(false)} />
        </>
    );
}
