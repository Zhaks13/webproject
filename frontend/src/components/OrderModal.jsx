import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api';
import {
    buildInitialOrderFormState,
    formatPhoneDisplay,
    formatPrice,
    hasRequiredOrderFields,
    normalizePhoneInput,
    parsePrice,
    parseQuantity,
    sanitizeNameInput,
    sanitizeQuantityInput,
    validateOrderForm
} from '../utils/orderForm';

const fieldBaseClassName = 'w-full rounded-xl border px-3.5 py-3 text-sm text-[#051F20] outline-none transition-all duration-200 placeholder:text-gray-300';
const fieldIdleClassName = 'border-gray-200 bg-white focus:border-[#2E6B50] focus:ring-4 focus:ring-[#2E6B50]/10';
const fieldErrorClassName = 'border-red-300 bg-red-50/60 focus:border-red-400 focus:ring-4 focus:ring-red-100';
const requiredFields = ['name', 'phone', 'address', 'quantity', 'paymentMethod'];

function getUserFromStorage() {
    try {
        const userString = localStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    } catch {
        return null;
    }
}

export default function OrderModal({ isOpen, onClose, product, selectedOptions = {} }) {
    const user = useMemo(() => getUserFromStorage(), [isOpen]);
    const initialState = useMemo(
        () => buildInitialOrderFormState(user, selectedOptions),
        [user, selectedOptions]
    );

    const [formData, setFormData] = useState(initialState);
    const [submitting, setSubmitting] = useState(false);
    const [submitAttempted, setSubmitAttempted] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [submitError, setSubmitError] = useState('');
    const [touchedFields, setTouchedFields] = useState({});

    const firstInputRef = useRef(null);
    const closeTimerRef = useRef(null);
    const fieldRefs = useRef({});

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        setFormData(initialState);
        setTouchedFields({});
        setSubmitAttempted(false);
        setSubmitError('');
        setSuccessMessage('');

        const focusTimer = window.setTimeout(() => {
            firstInputRef.current?.focus();
        }, 80);

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.clearTimeout(focusTimer);
            window.removeEventListener('keydown', handleEscape);
        };
    }, [initialState, isOpen]);

    useEffect(() => {
        return () => {
            if (closeTimerRef.current) {
                window.clearTimeout(closeTimerRef.current);
            }
        };
    }, []);

    const errors = useMemo(() => validateOrderForm(formData), [formData]);
    const unitPrice = useMemo(() => parsePrice(product?.price), [product?.price]);
    const quantityValue = parseQuantity(formData.quantity) || 0;
    const totalPrice = unitPrice * quantityValue;
    const isFormValid = hasRequiredOrderFields(formData) && Object.keys(errors).length === 0;
    const showValidationSummary = submitAttempted && !isFormValid;
    const isSubmitDisabled = !isFormValid || submitting || Boolean(successMessage);

    const handleClose = () => {
        if (submitting) {
            return;
        }

        if (closeTimerRef.current) {
            window.clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
        }

        setSuccessMessage('');
        setSubmitError('');
        onClose();
    };

    const markTouched = (field) => {
        setTouchedFields((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
    };

    const updateField = (field, value) => {
        markTouched(field);
        setSubmitError('');
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const setFieldRef = (field, node) => {
        fieldRefs.current[field] = node;
    };

    const getFieldError = (field) => ((touchedFields[field] || submitAttempted) ? errors[field] : '');

    const getFieldClassName = (field) => {
        const hasError = Boolean(getFieldError(field));
        return `${fieldBaseClassName} ${hasError ? fieldErrorClassName : fieldIdleClassName}`;
    };

    const handlePhoneKeyDown = (event) => {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }

        const allowedKeys = [
            'Backspace',
            'Delete',
            'Tab',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Home',
            'End'
        ];

        if (allowedKeys.includes(event.key)) {
            return;
        }

        if (!/^\d$/.test(event.key)) {
            event.preventDefault();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitAttempted(true);
        setTouchedFields(requiredFields.reduce((accumulator, field) => ({ ...accumulator, [field]: true }), {}));

        if (!isFormValid) {
            const firstInvalidField = requiredFields.find((field) => errors[field]);
            fieldRefs.current[firstInvalidField]?.focus();
            return;
        }

        setSubmitting(true);
        setSubmitError('');

        try {
            const token = localStorage.getItem('token');
            const data = {
                productId: product?.id,
                ...formData,
                phone: normalizePhoneInput(formData.phone),
                quantity: parseQuantity(formData.quantity),
                name: formData.name.trim(),
                address: formData.address.trim(),
                comment: formData.comment.trim()
            };

            await api.post('orders', data, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            setSuccessMessage('Заказ оформлен. Мы свяжемся с вами');
            setFormData(initialState);
            setTouchedFields({});
            setSubmitAttempted(false);

            closeTimerRef.current = window.setTimeout(() => {
                handleClose();
            }, 1800);
        } catch (error) {
            console.error(error);
            setSubmitError('Не удалось оформить заказ. Попробуйте еще раз.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-[#051F20]/80 p-4 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.96, opacity: 0, y: 16 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.96, opacity: 0, y: 16 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        onClick={(event) => event.stopPropagation()}
                        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white shadow-2xl"
                    >
                        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-100 bg-white/95 px-6 py-5 backdrop-blur md:px-8">
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                                    Оформление заказа
                                </p>
                                <h2 className="mt-2 text-2xl font-light text-[#051F20]">
                                    Проверьте данные и подтвердите заказ
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200"
                                aria-label="Закрыть"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                                    <path d="M6 6L18 18" />
                                    <path d="M18 6L6 18" />
                                </svg>
                            </button>
                        </div>

                        <div className="px-6 py-6 md:px-8 md:py-8">
                            <div className="mb-6 grid gap-4 rounded-2xl border border-gray-100 bg-[#F5F5F7] p-4 md:grid-cols-[1.4fr_1fr_1fr]">
                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                        Товар
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={product?.name || 'Товар'}
                                        className={`${fieldBaseClassName} border-gray-200 bg-white/90 text-[#0D3B2E]`}
                                        tabIndex={-1}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                        Цена за единицу
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={formatPrice(unitPrice)}
                                        className={`${fieldBaseClassName} border-gray-200 bg-white/90 text-[#0D3B2E]`}
                                        tabIndex={-1}
                                    />
                                </div>

                                <div className="rounded-2xl border border-[#2E6B50]/10 bg-white px-4 py-3">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                        Итого
                                    </p>
                                    <p className="mt-2 text-2xl font-semibold text-[#0D3B2E]">
                                        {formatPrice(totalPrice)}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {quantityValue || 0} шт. x {formatPrice(unitPrice)}
                                    </p>
                                </div>
                            </div>

                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900"
                                >
                                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium">✅ {successMessage}</p>
                                        <p className="mt-1 text-sm text-emerald-800/80">Окно закроется автоматически.</p>
                                    </div>
                                </motion.div>
                            )}

                            {submitError && (
                                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                                    {submitError}
                                </div>
                            )}

                            {showValidationSummary && (
                                <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900" role="alert">
                                    Проверьте обязательные поля: имя, телефон и адрес должны быть заполнены корректно.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5" noValidate aria-busy={submitting}>
                                <fieldset disabled={submitting || Boolean(successMessage)} className="space-y-5 disabled:cursor-not-allowed disabled:opacity-95">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="order-name" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                            Имя
                                        </label>
                                        <input
                                            id="order-name"
                                            ref={(node) => {
                                                firstInputRef.current = node;
                                                setFieldRef('name', node);
                                            }}
                                            type="text"
                                            autoComplete="name"
                                            value={formData.name}
                                            onChange={(event) => updateField('name', sanitizeNameInput(event.target.value))}
                                            onBlur={() => markTouched('name')}
                                            className={getFieldClassName('name')}
                                            placeholder="Иван Иванов"
                                            aria-invalid={Boolean(getFieldError('name'))}
                                            aria-describedby="order-name-hint order-name-error"
                                        />
                                        <p id="order-name-hint" className="mt-2 text-xs text-gray-500">
                                            Укажите имя не короче 2 символов.
                                        </p>
                                        {getFieldError('name') && (
                                            <p id="order-name-error" className="mt-2 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="order-phone" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                            Телефон
                                        </label>
                                        <input
                                            id="order-phone"
                                            ref={(node) => setFieldRef('phone', node)}
                                            type="tel"
                                            autoComplete="tel"
                                            inputMode="numeric"
                                            value={formatPhoneDisplay(formData.phone)}
                                            onChange={(event) => updateField('phone', normalizePhoneInput(event.target.value))}
                                            onBlur={() => markTouched('phone')}
                                            onKeyDown={handlePhoneKeyDown}
                                            className={getFieldClassName('phone')}
                                            placeholder="+7 (___) ___-__-__"
                                            aria-invalid={Boolean(getFieldError('phone'))}
                                            aria-describedby="order-phone-hint order-phone-error"
                                        />
                                        <p id="order-phone-hint" className="mt-2 text-xs text-gray-500">
                                            Номер нужен в формате +7XXXXXXXXXX.
                                        </p>
                                        {getFieldError('phone') && (
                                            <p id="order-phone-error" className="mt-2 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="order-address" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                        Адрес доставки
                                    </label>
                                    <input
                                        id="order-address"
                                        ref={(node) => setFieldRef('address', node)}
                                        type="text"
                                        autoComplete="street-address"
                                        value={formData.address}
                                        onChange={(event) => updateField('address', event.target.value)}
                                        onBlur={() => markTouched('address')}
                                        className={getFieldClassName('address')}
                                        placeholder="Город, улица, дом"
                                        aria-invalid={Boolean(getFieldError('address'))}
                                        aria-describedby="order-address-hint order-address-error"
                                    />
                                    <p id="order-address-hint" className="mt-2 text-xs text-gray-500">
                                        Добавьте полный адрес доставки, чтобы мы могли подтвердить заказ быстрее.
                                    </p>
                                    {getFieldError('address') && (
                                        <p id="order-address-error" className="mt-2 text-sm text-red-600">{errors.address}</p>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-gray-100 bg-[#DAF1DE]/20 px-4 py-3">
                                    <label htmlFor="whatsapp" className="flex cursor-pointer items-center gap-3">
                                        <input
                                            id="whatsapp"
                                            type="checkbox"
                                            checked={formData.whatsapp}
                                            onChange={(event) => setFormData((prev) => ({ ...prev, whatsapp: event.target.checked }))}
                                            className="h-4 w-4 cursor-pointer accent-[#2E6B50]"
                                        />
                                        <span className="text-sm text-[#0D3B2E]">Связаться по WhatsApp</span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="order-quantity" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                            Количество
                                        </label>
                                        <input
                                            id="order-quantity"
                                            ref={(node) => setFieldRef('quantity', node)}
                                            type="text"
                                            inputMode="numeric"
                                            value={formData.quantity}
                                            onChange={(event) => updateField('quantity', sanitizeQuantityInput(event.target.value))}
                                            onBlur={() => markTouched('quantity')}
                                            className={getFieldClassName('quantity')}
                                            placeholder="1"
                                            aria-invalid={Boolean(getFieldError('quantity'))}
                                        />
                                        {getFieldError('quantity') && (
                                            <p className="mt-2 text-sm text-red-600">{errors.quantity}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="order-payment" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                            Способ оплаты
                                        </label>
                                        <select
                                            id="order-payment"
                                            ref={(node) => setFieldRef('paymentMethod', node)}
                                            value={formData.paymentMethod}
                                            onChange={(event) => updateField('paymentMethod', event.target.value)}
                                            onBlur={() => markTouched('paymentMethod')}
                                            className={getFieldClassName('paymentMethod')}
                                            aria-invalid={Boolean(getFieldError('paymentMethod'))}
                                        >
                                            <option value="CASH">Наличными при получении</option>
                                            <option value="CARD">Перевод на карту</option>
                                        </select>
                                        {getFieldError('paymentMethod') && (
                                            <p className="mt-2 text-sm text-red-600">{errors.paymentMethod}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="order-comment" className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-400">
                                        Комментарий
                                    </label>
                                    <textarea
                                        id="order-comment"
                                        rows="4"
                                        value={formData.comment}
                                        onChange={(event) => setFormData((prev) => ({ ...prev, comment: event.target.value }))}
                                        className={`${fieldBaseClassName} ${fieldIdleClassName} resize-none`}
                                        placeholder="Уточнения к заказу, удобное время для связи и пожелания"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        disabled={submitting}
                                        className="order-2 px-5 py-3 text-sm uppercase tracking-[0.2em] text-gray-500 transition-colors hover:text-gray-800 sm:order-1"
                                    >
                                        Отмена
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmitDisabled}
                                        className={`order-1 inline-flex min-w-[220px] items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm uppercase tracking-[0.2em] transition-all sm:order-2 ${isSubmitDisabled
                                            ? 'cursor-not-allowed bg-[#0D3B2E]/45 text-white'
                                            : 'bg-[#0D3B2E] text-[#DAF1DE] hover:bg-[#1a5a48]'
                                            }`}
                                    >
                                        {submitting && (
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        )}
                                        {successMessage ? 'Заказ оформлен' : submitting ? 'Оформление...' : 'Заказать'}
                                    </button>
                                </div>
                                </fieldset>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
