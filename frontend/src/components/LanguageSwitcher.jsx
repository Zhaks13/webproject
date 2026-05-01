import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang, LANG_NAMES } from '../context/LanguageContext';

const LANGS = ['ru', 'kz', 'en'];

export default function LanguageSwitcher() {
    const { lang, switchLang } = useLang();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative ml-4">
            {/* Trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-[11px] font-bold uppercase tracking-widest text-[#111] hover:bg-zinc-50 transition-colors duration-200 select-none"
            >
                {lang.toUpperCase()}
                <svg
                    className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute right-0 top-[calc(100%+6px)] w-36 bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden z-50"
                    >
                        {LANGS.map((l) => (
                            <button
                                key={l}
                                onClick={() => { switchLang(l); setOpen(false); }}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors duration-150
                                    ${lang === l
                                        ? 'bg-zinc-50 text-[#111]'
                                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-[#111]'
                                    }`}
                            >
                                <span>{LANG_NAMES[l]}</span>
                                {lang === l && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#111] block" />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
