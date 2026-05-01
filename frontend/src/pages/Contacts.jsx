import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
});

export default function Contacts() {
    const { t } = useLang();
    const c = t.contacts;

    return (
        <div className="bg-[#f5f5f5] text-[#111] min-h-screen py-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                    {/* Левая колонка */}
                    <div className="flex flex-col justify-center">
                        <motion.h1 {...fadeUp(0)} className="text-6xl md:text-7xl font-semibold tracking-tight mb-8">
                            {c.title}
                        </motion.h1>
                        <motion.p {...fadeUp(0.1)} className="max-w-md text-lg text-zinc-500 leading-relaxed mb-16">
                            {c.desc}
                        </motion.p>

                        <div className="space-y-10">

                            {/* Телефон */}
                            <motion.div {...fadeUp(0.15)}>
                                <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">{c.phone}</h3>
                                <a
                                    href="tel:+77774754775"
                                    className="text-xl font-semibold hover:text-zinc-500 transition-colors"
                                >
                                    +7 (777) 475-47-75
                                </a>
                                <p className="text-zinc-400 text-sm mt-1">{c.schedule}</p>
                            </motion.div>

                            {/* WhatsApp */}
                            <motion.div {...fadeUp(0.2)}>
                                <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">{c.whatsapp}</h3>
                                <a
                                    href="https://wa.me/77774754775"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xl font-semibold hover:text-zinc-500 transition-colors"
                                >
                                    {c.whatsappLink}
                                </a>
                            </motion.div>

                            {/* Адрес */}
                            <motion.div {...fadeUp(0.25)}>
                                <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">{c.showroom}</h3>
                                <p className="text-xl font-semibold leading-relaxed">
                                    {c.address}<br />
                                </p>
                                <a
                                    href="https://2gis.kz/astana/search/%D0%91%D0%B0%D1%80%D1%88%D1%8B%D0%BD%2026"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block text-sm font-medium text-zinc-500 hover:text-black transition-colors underline underline-offset-4"
                                >
                                    {c.twoGis}
                                </a>
                            </motion.div>

                            {/* Соцсети */}
                            <motion.div {...fadeUp(0.3)}>
                                <h3 className="text-xs uppercase tracking-widest text-zinc-400 font-bold mb-3">{c.socials}</h3>
                                <div className="flex flex-col gap-2">
                                    <a href="https://www.instagram.com/stolyarniy_dvor?igsh=MWJ1cmFma3hpczdpbw==" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:text-zinc-500 transition-colors w-fit">Instagram</a>
                                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:text-zinc-500 transition-colors w-fit">TikTok</a>
                                </div>
                            </motion.div>

                            {/* CTA кнопка */}
                            <motion.div {...fadeUp(0.35)}>
                                <a
                                    href="https://wa.me/77774754775"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-black text-white text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-zinc-800 transition-colors"
                                >
                                    {c.writeUs}
                                </a>
                            </motion.div>

                        </div>
                    </div>

                    {/* Правая колонка — Карта */}
                    <motion.div {...fadeUp(0.2)} className="w-full sticky top-8">
                        <div className="w-full rounded-2xl overflow-hidden shadow-sm border border-zinc-200 aspect-[4/5]">
                            <iframe
                                title="Шоурум на карте"
                                src="https://yandex.ru/map-widget/v1/?ll=71.325672%2C51.199345&z=16&text=%D0%90%D1%81%D1%82%D0%B0%D0%BD%D0%B0%2C%20%D1%83%D0%BB.%20%D0%91%D0%B0%D1%80%D1%88%D1%8B%D0%BD%2026"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                        <p className="text-xs text-zinc-400 mt-3 text-center">
                            {c.mapCaption}
                        </p>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
