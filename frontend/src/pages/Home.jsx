import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import { getImageUrl } from '../utils/image';

export default function Home() {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setFeaturedProducts(data.slice(0, 4));
            } catch (e) {
                console.error('Failed to load featured products', e);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="w-full font-sans text-[#051F20]">

            {/* ======== HERO ======== */}
            <div className="relative w-full h-screen min-h-[900px] max-h-[1100px] overflow-hidden" style={{ background: 'linear-gradient(170deg, #051F20 0%, #051F20 20%, #0B2B26 45%, #163832 72%, #235347 100%)' }}>

                {/* Top cinematic dim overlay (navbar contrast + depth) */}
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 30%)' }} />

                {/* Radial vignette — darker corners, slightly lighter center */}
                <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 70% at 40% 50%, rgba(35,83,71,0.18) 0%, rgba(5,31,32,0.55) 100%)' }} />

                {/* Right: workshop photo */}
                <div className="absolute top-0 right-0 w-[56%] h-full z-[1]">
                    <img
                        src="https://images.unsplash.com/photo-1621293954908-907159247fc8?auto=format&fit=crop&q=80"
                        alt="Workshop"
                        className="w-full h-full object-cover opacity-75 mix-blend-luminosity"
                    />
                    {/* Left-fade to blend image edge into gradient background */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0B2B26 0%, transparent 40%)' }} />
                    <div className="absolute inset-0 bg-[#051F20]/20" />
                </div>

                {/* SVG organic wave layers — multi-node bezier, asymmetric, no straight edges */}
                <svg
                    className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                    preserveAspectRatio="none"
                    viewBox="0 0 1000 1000"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Right-cast shadow for wave separation depth */}
                        <filter id="ws1" x="-5%" y="0%" width="115%" height="100%">
                            <feDropShadow dx="8" dy="0" stdDeviation="14" floodColor="#000" floodOpacity="0.50" />
                        </filter>
                        <filter id="ws2" x="-5%" y="0%" width="115%" height="100%">
                            <feDropShadow dx="6" dy="0" stdDeviation="10" floodColor="#000" floodOpacity="0.38" />
                        </filter>
                        <filter id="ws3" x="-5%" y="0%" width="115%" height="100%">
                            <feDropShadow dx="5" dy="0" stdDeviation="8" floodColor="#000" floodOpacity="0.28" />
                        </filter>
                    </defs>

                    {/*
                      PATH DESIGN (all coordinates in 0–1000 viewBox):
                      Each path anchors at top-left (0,0) and bottom-left (0,1000).
                      The RIGHT edge is drawn top-to-bottom with 4 bezier control points
                      giving: inward shoulder at top → outward belly mid → slight tuck → wider base.
                      No two paths share the same curve shape — deliberate asymmetry.
                    */}

                    {/* LAYER 1 — cream/light (#f4f0e8)
                        Covers 0→750 at top, S-curves to 770 belly, 755 base.
                        Rightmost layer rendered first (sits behind dark layers). */}
                    <path
                        d="
                          M 0,0
                          L 755,0
                          C 738,80  792,260  788,440
                          C 784,620  762,800  758,1000
                          L 0,1000 Z
                        "
                        fill="#f4f0e8"
                        filter="url(#ws1)"
                    />

                    {/* LAYER 2 — mid-green #163832
                        top 635, S-curve belly to 672 at y=480, base 645 */}
                    <path
                        d="
                          M 0,0
                          L 635,0
                          C 612,80  665,270  668,460
                          C 671,640  650,820  645,1000
                          L 0,1000 Z
                        "
                        fill="#163832"
                        filter="url(#ws2)"
                    />

                    {/* LAYER 3 — #0B2B26
                        top 510, belly 542 at y=440, base 518 */}
                    <path
                        d="
                          M 0,0
                          L 510,0
                          C 492,80  538,270  540,450
                          C 542,630  524,820  518,1000
                          L 0,1000 Z
                        "
                        fill="#0B2B26"
                        filter="url(#ws3)"
                    />

                    {/* LAYER 4 — #051F20 (darkest, locks left text zone)
                        top 390, subtle S: 374 at y=180, 412 at y=480, 398 base */}
                    <path
                        d="
                          M 0,0
                          L 390,0
                          C 372,100  415,280  416,460
                          C 417,640  400,820  396,1000
                          L 0,1000 Z
                        "
                        fill="#051F20"
                        filter="url(#ws3)"
                    />

                </svg>

                {/* Content grid — z-20 above all waves */}
                <div className="absolute inset-0 z-20 flex items-center pointer-events-none">

                    {/* LEFT: title + button — max-width roughly matches dark layer */}
                    <div className="pointer-events-auto w-[28%] min-w-[240px] ml-10 xl:ml-16 flex flex-col gap-8">
                        <motion.h1
                            initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, ease: 'easeOut' }}
                            className="text-5xl md:text-6xl xl:text-7xl font-light text-[#DAF1DE] leading-[1.05] tracking-tight"
                        >
                            Форма<br /><span className="text-white">и Суть.</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            transition={{ duration: 1.2, delay: 0.35 }}
                            className="text-sm font-light text-[#8EB69B]/75 max-w-[240px] leading-relaxed"
                        >
                            Мастерская ручная обработка каждого изделия.
                        </motion.p>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}>
                            <Link
                                to="/catalog"
                                className="inline-flex items-center gap-3 text-[#DAF1DE] text-[13px] tracking-wider font-light border border-[#163832] bg-[#0B2B26]/50 rounded-full px-7 py-3 transition-all duration-400 hover:bg-[#163832] hover:border-[#8EB69B]/40 hover:brightness-110"
                            >
                                Смотреть коллекции <span className="opacity-50">&rarr;</span>
                            </Link>
                        </motion.div>
                    </div>

                    {/* CENTER: inside cream band, ~63–75% of viewport → centre at 69% */}
                    <div
                        className="pointer-events-auto absolute flex flex-col items-center justify-center text-center text-[#0B2B26]"
                        style={{ left: '69%', top: '50%', transform: 'translate(-50%,-50%)', width: '14%', minWidth: 170 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.4, delay: 0.2 }}
                            className="flex flex-col items-center gap-6"
                        >
                            <span className="uppercase tracking-[0.25em] text-[11px] text-[#163832] font-medium opacity-80">
                                столярный
                            </span>
                            <h2
                                className="font-serif font-light leading-none tracking-tight text-[#051F20]"
                                style={{ fontSize: 'clamp(5rem, 9vw, 8rem)' }}
                            >
                                Цех
                            </h2>
                            <p className="text-[13px] font-light leading-relaxed text-[#163832]/85 max-w-[190px]">
                                Индивидуальный подход, честный труд, безупречный результат.
                            </p>
                            <div
                                className="mt-4 opacity-50 text-[#163832] border-t border-[#163832]/15 pt-5 w-full text-center"
                                style={{ fontFamily: 'cursive', fontSize: '1.3rem' }}
                            >
                                Wooddoo
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* ======== CATALOG ======== */}
            <div className="py-24 bg-[#0B2B26] text-[#DAF1DE]">
                <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-16 text-center">
                        <h2 className="text-4xl md:text-5xl font-light tracking-tight">Избранное</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredProducts.length === 0 ? (
                            <p className="text-[#8EB69B] font-light text-lg col-span-full text-center">Загрузка каталога...</p>
                        ) : featuredProducts.map(p => (
                            <motion.div key={p.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="group">
                                <Link to={`/product/${p.id}`} className="block bg-[#DAF1DE] rounded-xl p-4 overflow-hidden transform transition-transform duration-500 group-hover:scale-[1.03]">
                                    <div className="relative aspect-[3/4] mb-5 overflow-hidden rounded-md bg-[#8EB69B]/30">
                                        {p.image
                                            ? <img src={getImageUrl(p.image)} className="w-full h-full object-cover" alt={p.name} />
                                            : <div className="w-full h-full flex items-center justify-center text-[#163832]/50 font-light text-xs uppercase tracking-widest">Нет фото</div>
                                        }
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-medium text-[#051F20] mb-1">{p.name}</h3>
                                        <span className="text-sm font-light text-[#163832]">{p.price} ₸</span>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ======== CTA ======== */}
            <div className="py-32 px-6 bg-[#051F20] flex justify-center">
                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1 }} className="text-center max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-light text-[#DAF1DE] mb-10 tracking-tight">
                        Создадим ваш проект вместе
                    </h2>
                    <Link to="/custom-order" className="inline-block bg-[#8EB69B] text-[#051F20] border border-[#8EB69B] px-10 py-3.5 rounded-full uppercase tracking-[0.1em] text-sm font-medium hover:bg-[#051F20] hover:text-[#8EB69B] transition-colors duration-300">
                        Обсудить проект
                    </Link>
                </motion.div>
            </div>
        </div >
    );
}
