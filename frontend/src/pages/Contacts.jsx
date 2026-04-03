import { motion } from 'framer-motion';

export default function Contacts() {
    return (
        <div className="min-h-screen pt-12 pb-32 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full mix-blend-multiply filter blur-[120px] opacity-70 z-0 hidden lg:block"></div>

            <div className="max-w-6xl mx-auto relative z-10 pt-10">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-16">
                    <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-4 block">Связь с нами</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-[#111] tracking-tight">
                        Всегда на <span className="text-gray-400">связи</span>
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Телефон</h3>
                            <p className="text-gray-500 font-light">+7 (999) 123-45-67</p>
                            <p className="text-gray-500 font-light mt-1">Пн-Вс: 10:00 - 20:00</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Шоурум</h3>
                            <p className="text-gray-500 font-light leading-relaxed">г. Алматы, пр. Абая 150<br />Уг. ул. Розыбакиева</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] transition-all">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Наши соцсети</h3>
                            <div className="flex space-x-4">
                                <a href="#" className="w-14 h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 flex flex-col justify-center items-center font-bold text-gray-800 transition-colors shadow-sm border border-gray-100/50">In</a>
                                <a href="#" className="w-14 h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 flex flex-col justify-center items-center font-bold text-gray-800 transition-colors shadow-sm border border-gray-100/50">Tg</a>
                                <a href="#" className="w-14 h-14 rounded-2xl bg-gray-50 hover:bg-gray-100 flex flex-col justify-center items-center font-bold text-gray-800 transition-colors shadow-sm border border-gray-100/50">Wa</a>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="lg:col-span-2">
                        <div className="w-full h-full min-h-[500px] bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-gray-100 p-4 overflow-hidden relative group">
                            <div className="absolute inset-4 bg-gray-50/80 rounded-[2.5rem] overflow-hidden flex items-center justify-center border border-gray-100 transition-colors duration-500 group-hover:bg-gray-50">
                                {/* Fake Map representation for aesthetics */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat"></div>
                                <div className="text-center relative z-10">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                                        className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center text-white shadow-xl mx-auto mb-6"
                                    >
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    </motion.div>
                                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Шоурум WOODOO</h3>
                                    <p className="text-gray-500 font-light mt-2">Ждем вас в гости!</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
