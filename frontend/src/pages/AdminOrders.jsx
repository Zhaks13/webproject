import { useState, useEffect } from 'react';
import { api } from '../api';
import AdminTabs from '../components/AdminTabs';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);

    // Ручное создание заказа
    const [manualOrder, setManualOrder] = useState({ name: '', phone: '', productId: '', comment: '' });
    const [creatingOrder, setCreatingOrder] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

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
            await loadData();
        } catch (e) {
            console.error(e);
            alert('Ошибка обновления статуса заказа');
        } finally {
            setUpdatingStatusId(null);
        }
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        setCreatingOrder(true);
        try {
            const token = localStorage.getItem('token');
            const data = {
                productId: manualOrder.productId || null,
                name: manualOrder.name || 'Ручной заказ',
                phone: manualOrder.phone,
                comment: manualOrder.comment,
                address: '',
                whatsapp: false,
                quantity: 1,
                paymentMethod: 'CASH',
                selectedOptions: {}
            };
            await api.post('/orders', data, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setManualOrder({ name: '', phone: '', productId: '', comment: '' });
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
        if (s === 'DONE' || s === 'READY') return 'bg-green-100 text-green-700';
        if (s === 'PROCESS' || s === 'IN_PROGRESS') return 'bg-blue-100 text-blue-700';
        return 'bg-zinc-100 text-zinc-700'; // Серый для NEW
    };

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
            <div className="bg-white p-8 rounded-2xl shadow-sm mb-12">
                <h2 className="text-xl font-bold tracking-tight mb-6">Создать заказ вручную</h2>
                <form onSubmit={handleCreateOrder} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 items-end">
                    <div className="xl:col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Имя клиента</label>
                        <input type="text" value={manualOrder.name} onChange={e => setManualOrder({ ...manualOrder, name: e.target.value })} placeholder="Имя" className="w-full bg-[#f5f5f5] border border-transparent focus:border-zinc-300 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors" />
                    </div>
                    <div className="xl:col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Телефон</label>
                        <input required type="text" value={manualOrder.phone} onChange={e => setManualOrder({ ...manualOrder, phone: e.target.value })} placeholder="+7..." className="w-full bg-[#f5f5f5] border border-transparent focus:border-zinc-300 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors" />
                    </div>
                    <div className="xl:col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Товар</label>
                        <select required value={manualOrder.productId} onChange={e => setManualOrder({ ...manualOrder, productId: e.target.value })} className="w-full bg-[#f5f5f5] border border-transparent focus:border-zinc-300 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors">
                            <option value="">Выберите товар</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="xl:col-span-1">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Комментарий</label>
                        <input type="text" value={manualOrder.comment} onChange={e => setManualOrder({ ...manualOrder, comment: e.target.value })} placeholder="Важное..." className="w-full bg-[#f5f5f5] border border-transparent focus:border-zinc-300 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-colors" />
                    </div>
                    <div className="xl:col-span-1 md:col-span-2 xl:mt-0 mt-2">
                        <button type="submit" disabled={creatingOrder} className="w-full bg-black text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50">
                            {creatingOrder ? 'Создание...' : 'Создать заказ'}
                        </button>
                    </div>
                </form>
            </div>

            {/* СПИСОК ЗАКАЗОВ */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight mb-8">Заказы клиентов <span className="text-zinc-400 font-medium text-lg ml-2">{orders.length}</span></h2>

                {loading ? (
                    <div className="text-zinc-400 text-sm font-medium">Загрузка заказов...</div>
                ) : orders.length === 0 ? (
                    <p className="text-zinc-400 text-sm italic">Заказов пока нет.</p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map(o => {
                            const product = products.find(p => p.id === o.productId);
                            const customer = o.name || o.customerName || 'Ручной заказ';
                            const phone = o.phone || 'Нет телефона';
                            const badgeStyle = getStatusStyle(o.status);

                            return (
                                <div key={o.id} className="bg-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                                    <div className="flex items-start md:items-center gap-6 flex-1">
                                        <div className="w-14 h-14 bg-[#f5f5f5] rounded-xl flex items-center justify-center text-zinc-400 font-bold text-sm flex-shrink-0">
                                            #{o.id}
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 w-full text-sm">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Клиент</p>
                                                <p className="font-bold text-[#111] truncate">{customer}</p>
                                                <p className="text-zinc-500 font-medium mt-0.5 truncate">{phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Товар</p>
                                                <p className="font-bold text-[#111] line-clamp-2">{product ? product.name : `Товар #${o.productId}`}</p>
                                            </div>
                                            {o.comment && (
                                                <div className="sm:col-span-1 hidden sm:block">
                                                    <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mb-1">Комментарий</p>
                                                    <p className="font-medium text-zinc-600 line-clamp-2">{o.comment}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 md:w-64 pt-4 md:pt-0">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${badgeStyle}`}>
                                            {o.status || 'NEW'}
                                        </span>
                                        <select
                                            value={(o.status || 'new').toLowerCase()}
                                            onChange={e => updateOrderStatus(o.id, e.target.value)}
                                            disabled={updatingStatusId === o.id}
                                            className="text-xs font-bold text-zinc-500 outline-none cursor-pointer bg-transparent uppercase tracking-wider text-right hover:text-[#111] transition-colors"
                                        >
                                            <option value="new">NEW</option>
                                            <option value="in_progress">PROCESS</option>
                                            <option value="done">DONE</option>
                                        </select>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
