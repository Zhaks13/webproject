import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { api } from '../api';

export default function OrderModal({ isOpen, onClose, product }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        whatsapp: false,
        quantity: 1,
        paymentMethod: 'CASH',
        comment: '',
        selectedOptions: {}
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const data = {
                productId: product?.id,
                ...formData
            };

            await api.post('orders', data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert('Заказ успешно создан');
            onClose();
        } catch (error) {
            console.error(error);
            alert('Ошибка при создании заказа');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#051F20]/80 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
                    >
                        х
                    </button>

                    <h2 className="text-2xl font-light text-[#051F20] uppercase tracking-widest mb-6">
                        Оформление заказа
                    </h2>

                    <div className="mb-6 bg-[#F5F5F7] p-4 rounded-xl border border-gray-100">
                        <p className="font-medium text-[#0D3B2E]">{product?.name || 'Товар'}</p>
                        <p className="text-gray-500 text-sm mt-1">Цена: {product?.price || 0} ₸</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Имя</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#2E6B50] outline-none transition-colors" placeholder="Иван Иванов" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Телефон</label>
                                <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#2E6B50] outline-none transition-colors" placeholder="+7..." />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Адрес доставки</label>
                            <input required type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#2E6B50] outline-none transition-colors" placeholder="Город, Улица, Дом" />
                        </div>

                        <div className="flex items-center gap-3 bg-[#DAF1DE]/20 p-3 rounded-lg border border-gray-100">
                            <input type="checkbox" id="whatsapp" checked={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.checked })} className="w-4 h-4 cursor-pointer accent-[#2E6B50]" />
                            <label htmlFor="whatsapp" className="text-sm text-[#0D3B2E] cursor-pointer">Связаться по WhatsApp</label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Количество</label>
                                <input required type="number" min="1" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#2E6B50] outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Способ оплаты</label>
                                <select value={formData.paymentMethod} onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#2E6B50] outline-none transition-colors bg-white">
                                    <option value="CASH">Наличными при получении</option>
                                    <option value="CARD">Перевод на карту</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Комментарий</label>
                            <textarea rows="3" value={formData.comment} onChange={e => setFormData({ ...formData, comment: e.target.value })} className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#2E6B50] outline-none transition-colors resize-none" placeholder="Уточнения к заказу..."></textarea>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 text-gray-500 hover:text-gray-800 text-sm tracking-widest uppercase transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`px-6 py-2.5 rounded-lg text-sm tracking-widest uppercase transition-colors ${submitting ? 'bg-[#0D3B2E]/50 text-white cursor-not-allowed' : 'bg-[#0D3B2E] hover:bg-[#1a5a48] text-[#DAF1DE]'
                                    }`}
                            >
                                {submitting ? 'Обработка...' : 'Заказать'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
