import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
    const { t } = useLang();
    const f = t.footer;
    const n = t.nav;
    const location = useLocation();

    // Minimal footer on the Contacts page (no duplicate info)
    if (location.pathname === '/contacts') {
        return (
            <div className="max-w-6xl w-full mx-auto px-4 mt-24">
                <footer className="bg-[#0f1412] rounded-t-[32px] overflow-hidden shadow-xl">
                    <div className="py-10 flex flex-col items-center gap-6">

                        {/* Nav links */}
                        <nav className="flex flex-wrap justify-center gap-6">
                            {[
                                { path: '/', label: n.home },
                                { path: '/catalog', label: n.catalog },
                                { path: '/custom-order', label: n.customOrder },
                                { path: '/contacts', label: n.contacts },
                            ].map(({ path, label }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className="text-zinc-400 hover:text-white hover:underline underline-offset-4 transition-colors text-sm uppercase tracking-widest font-semibold"
                                >
                                    {label}
                                </Link>
                            ))}
                        </nav>

                        {/* CTA */}
                        <a
                            href="https://wa.me/77774754775"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest px-8 py-3 hover:scale-105 transition-transform"
                        >
                            {f.cta}
                        </a>

                        {/* Copyright */}
                        <p className="text-zinc-600 text-xs tracking-wide">{f.rights}</p>

                    </div>
                </footer>
            </div>
        );
    }

    const navLinks = [
        { path: '/', label: n.home },
        { path: '/catalog', label: n.catalog },
        { path: '/custom-order', label: n.customOrder },
        { path: '/contacts', label: n.contacts },
    ];

    // Show Admin link only when the user is logged in as ADMIN
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    const isAdmin = user && user.role === 'ADMIN';

    return (
        <div className="max-w-5xl w-full mx-auto px-4 mt-16">
            <footer className="bg-[#0f1412] border-t border-white/10 rounded-t-[48px] shadow-xl overflow-hidden">
                <div className="px-10 py-14">

                    {/* Main grid — 4 columns on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">

                        {/* Col 1 — Brand / О компании */}
                        <div className="flex flex-col gap-3">
                            <span className="text-2xl font-semibold text-white tracking-tight">
                                Stolyarniy Dvor
                            </span>
                            <p className="text-zinc-400 text-sm leading-relaxed max-w-[220px]">
                                {f.tagline}
                            </p>
                        </div>

                        {/* Col 2 — Contacts */}
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                {f.contacts}
                            </p>
                            <a
                                href="tel:+77774754775"
                                className="text-zinc-400 hover:text-white transition-colors text-sm"
                            >
                                +7 (777) 475-47-75
                            </a>
                            <a
                                href="https://wa.me/77774754775"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-white transition-colors text-sm"
                            >
                                WhatsApp
                            </a>
                            <p className="text-zinc-400 text-sm">
                                г. Астана, ул. Баршын 26
                            </p>
                            <a
                                href="https://2gis.kz/astana/search/%D0%91%D0%B0%D1%80%D1%88%D1%8B%D0%BD%2026"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-500 hover:text-white transition-colors text-xs underline underline-offset-4"
                            >
                                2GIS
                            </a>
                        </div>

                        {/* Col 3 — Socials */}
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                {f.socials}
                            </p>
                            <a
                                href="https://www.instagram.com/stolyarniy_dvor"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-white transition-colors text-sm"
                            >
                                Instagram
                            </a>
                            <a
                                href="#"
                                className="text-zinc-400 hover:text-white transition-colors text-sm"
                            >
                                TikTok
                            </a>
                            <a
                                href="https://wa.me/77774754775"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-block rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest px-6 py-3 hover:scale-105 transition-transform w-fit"
                            >
                                {f.cta}
                            </a>
                        </div>

                        {/* Col 4 — Navigation (NEW) */}
                        <div className="flex flex-col gap-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
                                {f.navigation}
                            </p>
                            {navLinks.map(({ path, label }) => (
                                <Link
                                    key={path}
                                    to={path}
                                    className="text-zinc-400 hover:text-white hover:underline underline-offset-4 transition-colors text-sm"
                                >
                                    {label}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link
                                    to="/admin"
                                    className="text-zinc-400 hover:text-white hover:underline underline-offset-4 transition-colors text-sm"
                                >
                                    {n.admin}
                                </Link>
                            )}
                        </div>

                    </div>

                    {/* Bottom bar */}
                    <div className="mt-12 pt-6 border-t border-white/10">
                        <p className="text-zinc-600 text-xs">
                            {f.rights}
                        </p>
                    </div>

                </div>
            </footer>
        </div>
    );
}
