import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useLang } from '../context/LanguageContext';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }
});

export default function CustomOrder() {
    const { t } = useLang();
    const co = t.customOrder;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', comment: '' });
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        addFiles(newFiles);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const newFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        addFiles(newFiles);
    };

    const addFiles = (newFiles) => {
        setFiles(prev => {
            const combined = [...prev, ...newFiles];
            return combined.slice(0, 5);
        });
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('name', formData.name);
            data.append('phone', formData.phone);
            data.append('comment', formData.comment);
            data.append('customTitle', 'Индивидуальный заказ');
            data.append('customDescription', formData.comment);
            data.append('type', 'CUSTOM');
            data.append('address', '');
            data.append('whatsapp', false);
            data.append('paymentMethod', 'CASH');
            data.append('selectedOptions', JSON.stringify({ customOrder: true }));
            data.append('items', JSON.stringify([]));

            files.forEach(file => {
                data.append('images', file);
            });

            await api.post('http://localhost:3002/orders', data, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });

            setSuccess(true);
            setFiles([]);
            setFormData({ name: '', phone: '', comment: '' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Order submit error:', error);
            alert(co.errorAlert);
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `
        w-full bg-zinc-100 border border-zinc-200 text-[#111]
        placeholder-zinc-400 rounded-xl px-4 py-3.5 text-sm outline-none
        focus:ring-2 focus:ring-black focus:border-transparent
        transition-all duration-200
    `;

    return (
        <div className="bg-[#f5f5f5] text-[#111] min-h-screen py-20 px-6 font-sans">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 xl:gap-24">

                {/* ЛЕВАЯ КОЛОНКА */}
                <div className="flex-1 w-full flex flex-col justify-start pt-4">
                    <motion.h1 {...fadeUp(0)} className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-8 leading-[1.1]">
                        {co.title} <br className="hidden md:block" />
                        <span className="text-zinc-400">{co.subtitle}</span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.1)} className="text-lg text-zinc-500 mb-12 leading-relaxed max-w-md">
                        {co.desc}
                    </motion.p>

                    {/* Timeline шагов */}
                    <motion.div {...fadeUp(0.2)} className="space-y-12 max-w-md mb-16 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px md:before:ml-[5px] before:h-full before:w-0.5 before:bg-gradient-to-b before:from-zinc-300 before:via-zinc-300 before:to-transparent">
                        {co.steps.map((item) => (
                            <div key={item.step} className="relative pl-10 group cursor-default">
                                <span className="absolute left-[0px] top-1.5 w-3 h-3 bg-zinc-300 rounded-full ring-4 ring-[#f5f5f5] group-hover:bg-[#111] group-hover:scale-125 transition-all duration-300 z-10"></span>
                                <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2 group-hover:text-[#111] transition-colors">{item.step}. {item.title}</h4>
                                <p className="text-zinc-500 text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Блок доверия */}
                    <motion.div {...fadeUp(0.3)} className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-zinc-200">
                        {co.stats.map((s) => (
                            <div key={s.label} className={s.label.length > 10 ? 'col-span-2 md:col-span-1' : ''}>
                                <p className="text-3xl font-semibold tracking-tight text-[#111]">{s.value}</p>
                                <p className="text-xs uppercase tracking-widest font-bold text-zinc-400 mt-1">{s.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ПРАВАЯ КОЛОНКА (Форма) */}
                <motion.div {...fadeUp(0.2)} className="flex-1 w-full flex flex-col justify-center">
                    <div className="bg-white border border-zinc-200 shadow-lg rounded-2xl p-8 lg:p-10 relative overflow-hidden">

                        <h3 className="text-2xl font-semibold text-[#111] mb-8 tracking-tight">{co.formTitle}</h3>

                        <form className="space-y-5 relative z-10" onSubmit={submitHandler}>
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">{co.labelName}</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={co.placeholderName}
                                    className={inputClass}
                                    disabled={loading || success}
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">{co.labelPhone}</label>
                                <input
                                    required
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder={co.placeholderPhone}
                                    className={inputClass}
                                    disabled={loading || success}
                                />
                            </div>

                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">{co.labelDetails}</label>
                                <textarea
                                    required
                                    value={formData.comment}
                                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder={co.placeholderDetails}
                                    rows="4"
                                    className={`${inputClass} resize-none`}
                                    disabled={loading || success}
                                ></textarea>
                            </div>

                            {/* Загрузка фото */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest font-bold text-zinc-400 mb-2">
                                    {co.labelRefs}
                                </label>

                                <div
                                    className={`relative border-2 border-dashed rounded-xl p-6 transition-colors duration-200 flex flex-col items-center justify-center text-center cursor-pointer
                                        ${isDragging ? 'border-[#111] bg-zinc-50' : 'border-zinc-200 hover:border-zinc-300 bg-zinc-50/50'}
                                    `}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => !loading && !success && document.getElementById('references-upload').click()}
                                >
                                    <input
                                        id="references-upload"
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        disabled={loading || success || files.length >= 5}
                                    />

                                    <svg className="w-6 h-6 text-zinc-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    <p className="text-sm font-medium text-zinc-600">{co.uploadText}</p>
                                    <p className="text-xs text-zinc-400 mt-1">{co.uploadHint}</p>
                                </div>

                                {files.length > 0 && (
                                    <div className="grid grid-cols-5 gap-2 mt-4">
                                        <AnimatePresence>
                                            {files.map((file, i) => (
                                                <motion.div
                                                    key={`${file.name}-${i}`}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 group"
                                                >
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt="preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFile(i)}
                                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        disabled={loading || success}
                                                    >
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                    </button>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading || success}
                                className="w-full mt-6 py-4 bg-[#111] hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold uppercase tracking-widest transition-all duration-200"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        {co.submitting}
                                    </span>
                                ) : success ? (
                                    co.submitted
                                ) : (
                                    co.submit
                                )}
                            </button>
                        </form>

                        {/* Сообщение об успехе */}
                        <AnimatePresence>
                            {success && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-2">{co.successTitle}</h3>
                                    <p className="text-zinc-500">{co.successDesc}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
