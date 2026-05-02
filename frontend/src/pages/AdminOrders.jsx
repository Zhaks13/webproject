import { useState, useEffect, useMemo } from 'react';
import { api } from '../api';
import AdminTabs from '../components/AdminTabs';
import {
    formatPhoneDisplay,
    normalizePhoneInput,
    parseQuantity,
    sanitizeNameInput,
    sanitizeQuantityInput
} from '../utils/orderForm';

const adminFieldClassName = 'w-full rounded-xl border border-transparent bg-[#f5f5f5] px-4 py-3 text-sm font-medium outline-none transition-colors focus:border-zinc-300';
const adminSectionLabelClassName = 'mb-2 block text-[10px] font-bold uppercase tracking-widest text-zinc-400';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    // Ручное создание заказа
    const [manualOrder, setManualOrder] = useState({
        name: '',
        phone: '+7',
        address: '',
        items: [{ productId: '', quantity: '1' }],
        paymentMethod: 'CASH',
        whatsapp: false,
        comment: '',
        selectedOptionsInput: ''
    });
    const [creatingOrder, setCreatingOrder] = useState(false);
    const [isManualOrderOpen, setIsManualOrderOpen] = useState(false);

    // Просмотр деталей заказа (Modal)
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState(['NEW', 'IN_PROGRESS', 'DONE', 'CANCELLED']);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [adminCommentDraft, setAdminCommentDraft] = useState('');
    const [savingAdminComment, setSavingAdminComment] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        setAdminCommentDraft(selectedOrder?.adminComment || '');
    }, [selectedOrder]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [oRes, pRes] = await Promise.all([
                api.get('/orders'),
                api.get('/products')
            ]);
            setOrders(oRes.data);
            setProducts(pRes.data);
        } catch (e) {
            console.error('Failed to load admin orders', e);
            setError('Ошибка загрузки данных.');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id, status) => {
        setUpdatingStatusId(id);
        try {
            await api.put(`/orders/${id}/status`, { status });
            // Обновляем список, чтобы не перегружать всю страницу
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
            // Если выбранный заказ сейчас открыт в модалке, обновляем и его статус
            if (selectedOrder?.id === id) {
                setSelectedOrder(prev => ({ ...prev, status }));
            }
        } catch (e) {
            console.error(e);
            alert('Ошибка обновления статуса заказа');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const saveAdminComment = async () => {
        if (!selectedOrder) return;

        setSavingAdminComment(true);

        try {
            const { data } = await api.patch(`/orders/${selectedOrder.id}`, {
                adminComment: adminCommentDraft
            });

            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? data : o));
            setSelectedOrder(data);
        } catch (e) {
            console.error(e);
            alert('Ошибка сохранения комментария администратора');
        } finally {
            setSavingAdminComment(false);
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setCreatingOrder(true);
        try {
            const token = localStorage.getItem('token');
            let parsedSelectedOptions = {};

            if (manualOrder.selectedOptionsInput.trim()) {
                try {
                    parsedSelectedOptions = JSON.parse(manualOrder.selectedOptionsInput);
                } catch {
                    parsedSelectedOptions = { note: manualOrder.selectedOptionsInput.trim() };
                }
            }

            const data = {
                type: 'PRODUCT',
                items: manualOrder.items.map(i => {
                    const selectedProduct = products.find(p => String(p.id) === String(i.productId));
                    return {
                        productId: i.productId ? Number(i.productId) : undefined,
                        quantity: parseQuantity(i.quantity) || 1,
                        productName: selectedProduct?.name
                    };
                }).filter(i => i.productId),
                name: manualOrder.name || 'Ручной заказ',
                phone: normalizePhoneInput(manualOrder.phone),
                address: manualOrder.address,
                comment: manualOrder.comment,
                whatsapp: Boolean(manualOrder.whatsapp),
                paymentMethod: manualOrder.paymentMethod || 'CASH',
                selectedOptions: parsedSelectedOptions
            };
            await api.post('/orders', data, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setManualOrder({
                name: '',
                phone: '+7',
                address: '',
                items: [{ productId: '', quantity: '1' }],
                paymentMethod: 'CASH',
                whatsapp: false,
                comment: '',
                selectedOptionsInput: ''
            });
            await loadData();
        } catch (e) {
            console.error(e);
            alert('Ошибка создания заказа');
        } finally {
            setCreatingOrder(false);
        }
    };

    const getStatusStyle = (status) => {
        const s = status ? status.toUpperCase() : 'NEW';
        if (s === 'DONE' || s === 'READY') return 'bg-green-100 text-green-700 border border-green-200';
        if (s === 'PROCESS' || s === 'IN_PROGRESS') return 'bg-blue-100 text-blue-700 border border-blue-200';
        if (s === 'CANCELLED') return 'bg-red-100 text-red-700 border border-red-200';
        return 'bg-zinc-100 text-zinc-700 border border-zinc-200';
    };

    const getStatusBorder = (status) => {
        const s = status ? status.toUpperCase() : 'NEW';
        if (s === 'DONE' || s === 'READY') return 'border-l-green-500';
        if (s === 'PROCESS' || s === 'IN_PROGRESS') return 'border-l-blue-500';
        if (s === 'CANCELLED') return 'border-l-red-500';
        return 'border-l-zinc-300';
    };

    const formatCurrency = (value) => (
        new Intl.NumberFormat('ru-KZ', {
            maximumFractionDigits: 0
        }).format(Number(value) || 0)
    );

    const normalizeOrderStatus = (status) => {
        const normalized = (status || 'NEW').toUpperCase();
        if (normalized === 'READY') return 'DONE';
        if (normalized === 'PROCESS') return 'IN_PROGRESS';
        return normalized;
    };

    const toggleStatusFilter = (value) => {
        setStatusFilter((prev) => (
            prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
        ));
    };

    const updateManualOrderField = (field, value) => {
        setManualOrder((prev) => ({ ...prev, [field]: value }));
    };

    const getOrderItems = (order) => (Array.isArray(order.items) ? order.items : []);

    const getTotalQuantity = (order) => (
        getOrderItems(order).reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
    );

    const getCalculatedTotal = (order) => {
        const items = getOrderItems(order);
        if (Number.isFinite(Number(order.totalPrice))) {
            return Number(order.totalPrice);
        }

        if (items.length === 0 || items.some((item) => item.price === null || item.price === undefined)) {
            return 0;
        }

        return items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0);
    };

    // Helper для получения инфы для модалки/карточек
    const getOrderInfo = (o) => {
        const customer = o.name || o.customerName || 'Ручной заказ';
        const phone = o.phone || 'Нет телефона';
        const badgeStyle = getStatusStyle(o.status);
        return { customer, phone, badgeStyle };
    };

    const filteredOrders = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();

        return orders.filter((o) => {
            const normalizedStatus = normalizeOrderStatus(o.status);
            const customer = String(o.name || o.customerName || '').toLowerCase();
            const phone = String(o.phone || '');
            const phoneDigits = phone.replace(/\D/g, '');
            const queryDigits = normalizedQuery.replace(/\D/g, '');

            const matchesStatus = statusFilter.length === 0 || statusFilter.includes(normalizedStatus);
            const matchesSearch = !normalizedQuery
                || customer.includes(normalizedQuery)
                || phone.toLowerCase().includes(normalizedQuery)
                || (queryDigits && phoneDigits.includes(queryDigits));

            return matchesStatus && matchesSearch;
        });
    }, [orders, searchQuery, statusFilter]);

    return (
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24 font-sans text-zinc-900 bg-[#f5f5f5] min-h-screen">
            <h1 className="text-4xl font-bold tracking-tighter mb-8 pt-8">Панель Управления</h1>

            <AdminTabs />

            {error && (
                <div className="bg-red-50 text-red-500 p-4 mb-8 rounded-xl text-sm font-medium">
                    {error}
                </div>
            )}

            {/* РУЧНОЕ СОЗДАНИЕ ЗАКАЗА */}
            <div className="mb-12 overflow-hidden rounded-2xl bg-white shadow-sm [&>h2]:hidden">
                <h2 className="text-xl font-bold tracking-tight mb-6">Создать заказ вручную</h2>
                <button
                    type="button"
                    onClick={() => setIsManualOrderOpen((prev) => !prev)}
                    className="mb-0 flex w-full items-center justify-between gap-4 px-8 py-6 text-left transition-colors hover:bg-zinc-50"
                    aria-expanded={isManualOrderOpen}
                >
                    <div>
                        <p className="text-xl font-bold tracking-tight text-zinc-950">Создать заказ вручную</p>
                        {!isManualOrderOpen && (
                            <p className="mt-1 text-sm text-zinc-500">Нажмите, чтобы открыть форму</p>
                        )}
                    </div>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-transform duration-300 ${isManualOrderOpen ? 'rotate-180' : ''}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 9L12 15L18 9" />
                        </svg>
                    </span>
                </button>
                <div className={`grid transition-all duration-300 ease-out ${isManualOrderOpen ? 'grid-rows-[1fr] border-t border-zinc-100' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                        <div className="px-8 pb-8 pt-6">
                            <form onSubmit={handleCreateOrder} className="space-y-5">

                                <div className="space-y-4 mb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className={adminSectionLabelClassName}>Товары</label>
                                        <button
                                            type="button"
                                            onClick={() => updateManualOrderField('items', [...manualOrder.items, { productId: '', quantity: '1' }])}
                                            className="text-xs font-bold uppercase tracking-widest text-[#2E6B50] hover:text-[#1a5a48]"
                                        >
                                            + Добавить товар
                                        </button>
                                    </div>
                                    {manualOrder.items.map((item, index) => {
                                        const unitPrice = products.find(p => String(p.id) === String(item.productId))?.price || 0;
                                        const qty = parseQuantity(item.quantity) || 0;
                                        return (
                                            <div key={index} className="grid gap-4 rounded-2xl border border-zinc-100 bg-[#F5F5F7] p-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
                                                <div>
                                                    <label className={adminSectionLabelClassName}>Товар</label>
                                                    <select
                                                        required
                                                        value={item.productId}
                                                        onChange={e => {
                                                            const newItems = [...manualOrder.items];
                                                            newItems[index].productId = e.target.value;
                                                            updateManualOrderField('items', newItems);
                                                        }}
                                                        className={`${adminFieldClassName} border-zinc-200 bg-white`}
                                                    >
                                                        <option value="">Выберите товар</option>
                                                        {products.map(p => (
                                                            <option key={p.id} value={p.id}>{p.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className={adminSectionLabelClassName}>Количество</label>
                                                    <input
                                                        type="text"
                                                        inputMode="numeric"
                                                        value={item.quantity}
                                                        onChange={e => {
                                                            const newItems = [...manualOrder.items];
                                                            newItems[index].quantity = sanitizeQuantityInput(e.target.value);
                                                            updateManualOrderField('items', newItems);
                                                        }}
                                                        placeholder="1"
                                                        className={`${adminFieldClassName} border-zinc-200 bg-white`}
                                                    />
                                                </div>
                                                <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Итого</p>
                                                    <p className="mt-2 text-xl font-semibold text-zinc-950">
                                                        {formatCurrency(unitPrice * qty)} ₸
                                                    </p>
                                                </div>
                                                {manualOrder.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newItems = [...manualOrder.items];
                                                            newItems.splice(index, 1);
                                                            updateManualOrderField('items', newItems);
                                                        }}
                                                        className="mb-1 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-zinc-400 hover:text-red-500 border border-zinc-200 self-end"
                                                    >
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"></path></svg>
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className={adminSectionLabelClassName}>Имя клиента</label>
                                        <input type="text" autoComplete="name" value={manualOrder.name} onChange={e => updateManualOrderField('name', sanitizeNameInput(e.target.value))} placeholder="Введите имя" className={adminFieldClassName} />
                                    </div>
                                    <div>
                                        <label className={adminSectionLabelClassName}>Телефон</label>
                                        <input required type="tel" autoComplete="tel" inputMode="numeric" value={formatPhoneDisplay(manualOrder.phone)} onChange={e => updateManualOrderField('phone', normalizePhoneInput(e.target.value))} placeholder="+7 (___) ___-__-__" className={adminFieldClassName} />
                                    </div>
                                </div>

                                <div>
                                    <label className={adminSectionLabelClassName}>Адрес доставки</label>
                                    <input type="text" autoComplete="street-address" value={manualOrder.address} onChange={e => updateManualOrderField('address', e.target.value)} placeholder="Город, улица, дом" className={adminFieldClassName} />
                                </div>

                                <div className="rounded-2xl border border-zinc-100 bg-[#DAF1DE]/20 px-4 py-3">
                                    <label htmlFor="admin-whatsapp" className="flex cursor-pointer items-center gap-3">
                                        <input id="admin-whatsapp" type="checkbox" checked={manualOrder.whatsapp} onChange={e => updateManualOrderField('whatsapp', e.target.checked)} className="h-4 w-4 cursor-pointer accent-black" />
                                        <span className="text-sm font-medium text-zinc-800">Связаться через WhatsApp</span>
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className={adminSectionLabelClassName}>Способ оплаты</label>
                                        <select value={manualOrder.paymentMethod} onChange={e => updateManualOrderField('paymentMethod', e.target.value)} className={adminFieldClassName}>
                                            <option value="CASH">Наличными при получении</option>
                                            <option value="CARD">Перевод на карту</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className={adminSectionLabelClassName}>Комментарий</label>
                                    <textarea rows="4" value={manualOrder.comment} onChange={e => updateManualOrderField('comment', e.target.value)} placeholder="Дополнительная информация, пожелания клиента или детали" className={`${adminFieldClassName} resize-none`} />
                                </div>

                                <div>
                                    <label className={adminSectionLabelClassName}>Варианты / Опции</label>
                                    <textarea rows="3" value={manualOrder.selectedOptionsInput} onChange={e => updateManualOrderField('selectedOptionsInput', e.target.value)} placeholder='JSON или текст, например: {"size":"160x80","color":"oak"}' className={`${adminFieldClassName} resize-none`} />
                                </div>

                                <div className="flex justify-end border-t border-zinc-100 pt-5">
                                    <button type="submit" disabled={creatingOrder} className="min-w-[220px] rounded-xl bg-black px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50">
                                        {creatingOrder ? 'Создание...' : 'Создать заказ'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* СПИСОК ЗАКАЗОВ */}
            <div>
                <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Заказы клиентов <span className="text-zinc-400 font-medium text-lg ml-2">{filteredOrders.length}</span></h2>
                        <p className="mt-2 text-sm text-zinc-500">Быстрый поиск по клиенту и статусу, без перезагрузки списка.</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.9fr)] lg:min-w-[560px]">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Поиск по имени или телефону"
                            className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
                        />
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsFilterOpen((prev) => !prev)}
                                className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-300"
                            >
                                <span>{statusFilter.length === 0 ? 'Статусы не выбраны' : `Статусы: ${statusFilter.join(', ')}`}</span>
                                <span className="text-xs uppercase tracking-[0.18em] text-zinc-400">Фильтр</span>
                            </button>

                            {isFilterOpen && (
                                <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-full rounded-2xl border border-zinc-200 bg-white p-3 shadow-lg">
                                    <div className="mb-2 flex items-center justify-between">
                                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">Статусы</p>
                                        <button
                                            type="button"
                                            onClick={() => setStatusFilter(['NEW', 'IN_PROGRESS', 'DONE', 'CANCELLED'])}
                                            className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500 hover:text-zinc-900"
                                        >
                                            Сбросить
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {['NEW', 'IN_PROGRESS', 'DONE', 'CANCELLED'].map((value) => (
                                            <label key={value} className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 hover:bg-zinc-50">
                                                <span className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-700">{value}</span>
                                                <input
                                                    type="checkbox"
                                                    checked={statusFilter.includes(value)}
                                                    onChange={() => toggleStatusFilter(value)}
                                                    className="h-4 w-4 accent-black"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="text-zinc-400 text-sm font-medium">Загрузка заказов...</div>
                ) : filteredOrders.length === 0 ? (
                    <p className="text-zinc-400 text-sm italic">Заказов пока нет.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredOrders.map(o => {
                            const { customer, phone, badgeStyle } = getOrderInfo(o);
                            const phoneDigits = phone.replace(/\D/g, '');
                            const paymentMethod = o.paymentMethod || 'CASH';
                            const createdAt = o.createdAt
                                ? new Date(o.createdAt).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })
                                : 'Нет даты';
                            const items = getOrderItems(o);

                            return (
                                <div
                                    key={o.id}
                                    onClick={() => setSelectedOrder(o)}
                                    className={`bg-white rounded-[24px] p-5 md:p-6 flex flex-col gap-5 shadow-sm cursor-pointer hover:shadow-md border border-zinc-200 border-l-4 ${getStatusBorder(o.status)} transition-all`}
                                >
                                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            <div className="w-12 h-12 bg-[#f5f5f5] rounded-2xl flex items-center justify-center text-zinc-500 font-bold text-sm flex-shrink-0">
                                                #{o.id}
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 flex-1 w-full text-sm min-w-0">
                                                <div className="min-w-0">
                                                    <p className="text-[10px] uppercase font-bold tracking-[0.22em] text-zinc-400 mb-1">Клиент</p>
                                                    <p className="font-semibold text-zinc-900 truncate">{customer}</p>
                                                    <a
                                                        href={phoneDigits ? `tel:+${phoneDigits}` : undefined}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="text-zinc-500 font-medium mt-1 inline-block hover:text-zinc-900 transition-colors truncate"
                                                    >
                                                        {phone}
                                                    </a>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] uppercase font-bold tracking-[0.22em] text-zinc-400 mb-1">Товары ({getTotalQuantity(o)} шт.)</p>
                                                    <div className="space-y-1 mt-1">
                                                        {items.length === 0 ? (
                                                            <p className="font-medium text-zinc-700 line-clamp-2 text-xs">Нет товаров</p>
                                                        ) : items.map((item, idx) => (
                                                            <p key={idx} className="font-medium text-zinc-700 line-clamp-2 text-[13px]">
                                                                <span className="text-zinc-400 font-semibold">{item.quantity} x </span>
                                                                {item.productName || `ID Товара: ${item.productId}`}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-bold tracking-[0.22em] text-zinc-400 mb-1">Оплата</p>
                                                    <p className="font-semibold text-zinc-900">{formatCurrency(getCalculatedTotal(o))} ₸</p>
                                                    <p className="text-zinc-500 text-sm mt-1">{createdAt}</p>
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] uppercase font-bold tracking-[0.22em] text-zinc-400 mb-1">Адрес</p>
                                                    <p className="font-medium text-zinc-600 line-clamp-2">{o.address || 'Не указан'}</p>
                                                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">{paymentMethod}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-stretch gap-3 xl:w-[240px]" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center justify-between gap-3">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${badgeStyle}`}>
                                                    {o.status || 'NEW'}
                                                </span>
                                                <select
                                                    value={(o.status || 'new').toLowerCase()}
                                                    onChange={e => updateOrderStatus(o.id, e.target.value)}
                                                    disabled={updatingStatusId === o.id}
                                                    className="text-xs font-bold text-zinc-600 outline-none cursor-pointer bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 uppercase tracking-wider hover:text-[#111] transition-colors"
                                                >
                                                    <option value="new">NEW</option>
                                                    <option value="in_progress">PROCESS</option>
                                                    <option value="done">DONE</option>
                                                    <option value="cancelled">CANCELLED</option>
                                                </select>
                                            </div>

                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrder(o)}
                                                    className="px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
                                                >
                                                    Открыть
                                                </button>
                                                <a
                                                    href={phoneDigits ? `tel:+${phoneDigits}` : undefined}
                                                    className="px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
                                                >
                                                    Позвонить
                                                </a>
                                                <a
                                                    href={phoneDigits ? `https://wa.me/${phoneDigits}` : undefined}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="px-3.5 py-2 rounded-xl border border-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider hover:border-zinc-300 hover:bg-zinc-50 transition-colors"
                                                >
                                                    WhatsApp
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={() => updateOrderStatus(o.id, 'cancelled')}
                                                    disabled={updatingStatusId === o.id || normalizeOrderStatus(o.status) === 'CANCELLED'}
                                                    className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Отменить
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* MODAL: Детали заказа */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
                        onClick={() => setSelectedOrder(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative z-10 flex max-h-[85vh] w-full max-w-[820px] flex-col overflow-hidden rounded-[28px] bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.22)] animate-in fade-in zoom-in duration-200">
                        {/* Кнопка закрытия */}
                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-black"
                        >
                            <span className="text-sm font-bold leading-none">X</span>
                        </button>

                        {/* Данные для модалки */}
                        {(() => {
                            const { customer, phone, badgeStyle } = getOrderInfo(selectedOrder);
                            const items = getOrderItems(selectedOrder);
                            const createdAt = selectedOrder.createdAt
                                ? new Date(selectedOrder.createdAt).toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                : 'Не указано';
                            const updatedAt = selectedOrder.updatedAt
                                ? new Date(selectedOrder.updatedAt).toLocaleString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                                : 'Не указано';

                            return (
                                <div className="flex min-h-0 flex-1 flex-col">
                                    <div className="mb-6 flex items-start gap-3 border-b border-zinc-200 pb-5 pr-14">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-[28px] font-bold tracking-tight text-zinc-950">Заказ #{selectedOrder.id}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${badgeStyle}`}>
                                                    {selectedOrder.status || 'NEW'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                                        <div className="space-y-5 pb-6">
                                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                                                <div className="space-y-3 rounded-2xl bg-zinc-50 p-4">
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Клиент</p>
                                                        <p className="text-base font-semibold text-zinc-950">{customer}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Телефон</p>
                                                        <p className="text-base font-semibold text-zinc-950">{phone}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Товары ({getTotalQuantity(selectedOrder)} шт.)</p>
                                                        <div className="space-y-2 mt-2">
                                                            {items.length === 0 ? (
                                                                <p className="text-sm text-zinc-600">Нет товаров</p>
                                                            ) : items.map((item, idx) => (
                                                                <div key={idx} className="flex justify-between items-start text-sm">
                                                                    <span className="font-semibold text-zinc-950 pr-2">
                                                                        <span className="text-zinc-500">{item.quantity} x</span> {item.productName || `ID Товара: ${item.productId}`}
                                                                    </span>
                                                                    {item.price && (
                                                                        <span className="text-zinc-500 whitespace-nowrap">{formatCurrency(Number(item.price) * parseQuantity(item.quantity))} ₸</span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 mt-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Общая сумма</p>
                                                        <p className="text-lg font-semibold text-zinc-950">{formatCurrency(getCalculatedTotal(selectedOrder))} ₸</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Адрес</p>
                                                        <p className="text-base font-semibold text-zinc-950">{selectedOrder.address || 'Не указан'}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3 rounded-2xl bg-zinc-50 p-4">
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Дата создания</p>
                                                        <p className="text-base font-semibold text-zinc-950">{createdAt}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Дата обновления</p>
                                                        <p className="text-base font-semibold text-zinc-950">{updatedAt}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Способ оплаты</p>
                                                        <p className="text-base font-semibold text-zinc-950">{selectedOrder.paymentMethod || 'CASH'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Источник</p>
                                                        <p className="text-base font-semibold text-zinc-950">{selectedOrder.source || 'WEB'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">WhatsApp</p>
                                                        <p className="text-base font-semibold text-zinc-950">{selectedOrder.whatsapp ? 'Да' : 'Нет'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Статус</p>
                                                        <p className="text-base font-semibold text-zinc-950">{selectedOrder.status || 'NEW'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedOrder.comment && (
                                                <div className="rounded-2xl bg-zinc-50 p-4">
                                                    <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Комментарий клиента</h4>
                                                    <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-zinc-700">
                                                        {selectedOrder.comment}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="rounded-2xl bg-zinc-50 p-4">
                                                <h4 className="mb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Комментарий администратора</h4>
                                                <textarea
                                                    rows="4"
                                                    value={adminCommentDraft}
                                                    onChange={(e) => setAdminCommentDraft(e.target.value)}
                                                    className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-800 outline-none transition-colors focus:border-zinc-300"
                                                    placeholder="Внутренний комментарий для команды"
                                                />
                                            </div>

                                            {selectedOrder.images && selectedOrder.images.length > 0 && (
                                                <div className="rounded-2xl bg-zinc-50 p-4">
                                                    <h4 className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">Изображения референсов</h4>
                                                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                                                        {selectedOrder.images.map((img, idx) => {
                                                            const imgUrl = img.startsWith('http') ? img : `http://localhost:3002${img}`;
                                                            return (
                                                                <a key={idx} href={imgUrl} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-xl border border-zinc-200 shadow-sm transition-all hover:border-zinc-400 hover:shadow-md">
                                                                    <img src={imgUrl} alt="Загружено пользователем" className="h-full w-full object-cover" />
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-2 flex flex-col gap-3 border-t border-zinc-200 bg-white pt-5 sm:sticky sm:bottom-0 sm:flex-row sm:items-center sm:justify-between">
                                        <button
                                            onClick={() => setSelectedOrder(null)}
                                            className="rounded-xl border border-zinc-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-950"
                                        >
                                            Закрыть
                                        </button>

                                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                                            <button
                                                type="button"
                                                onClick={saveAdminComment}
                                                disabled={savingAdminComment || adminCommentDraft === (selectedOrder.adminComment || '')}
                                                className="rounded-xl bg-zinc-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-800 transition-colors hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {savingAdminComment ? 'Сохранение...' : 'Сохранить комментарий'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'done')}
                                                disabled={updatingStatusId === selectedOrder.id || normalizeOrderStatus(selectedOrder.status) === 'DONE'}
                                                className="rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Готово
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                                                disabled={updatingStatusId === selectedOrder.id || normalizeOrderStatus(selectedOrder.status) === 'CANCELLED'}
                                                className="rounded-xl border border-red-200 px-5 py-3 text-xs font-bold uppercase tracking-widest text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                Отменить
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                </div>
            )}
        </div>
    );
}
