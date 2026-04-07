import { useState, useEffect } from 'react';
import { api } from '../api';
import AdminTabs from '../components/AdminTabs';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState(localStorage.getItem('adminNotes') || '');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [oRes, pRes] = await Promise.all([
                    api.get('/orders'),
                    api.get('/products')
                ]);
                setOrders(oRes.data);
                setProducts(pRes.data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const saveNotes = () => {
        localStorage.setItem('adminNotes', notes);
        alert('Заметки сохранены');
    };

    const newOrdersCount = orders.filter(o => {
        const s = (o.status || '').toUpperCase();
        return s === 'NEW' || s === 'new';
    }).length;

    const topOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    if (loading) {
        return (
            <div className="max-w-[1200px] mx-auto px-6 pb-24 bg-[#f5f5f5] min-h-screen pt-8 font-sans text-zinc-900">
                <h1 className="text-4xl font-bold tracking-tighter mb-8">Панель Управления</h1>
                <AdminTabs />
                <div className="text-zinc-500 font-medium">Загрузка данных...</div>
            </div>
        );
    }

    return (
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 pb-24 font-sans text-zinc-900 bg-[#f5f5f5] min-h-screen pt-8">
            <h1 className="text-4xl font-bold tracking-tighter mb-8">Панель Управления</h1>

            <AdminTabs />

            {/* СТАТИСТИКА */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100/50 flex flex-col justify-center items-center text-center">
                    <p className="text-4xl font-bold text-[#111] mb-2">{products.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Всех товаров</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100/50 flex flex-col justify-center items-center text-center">
                    <p className="text-4xl font-bold text-[#111] mb-2">{orders.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Всего заказов</p>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-6 shadow-md flex flex-col justify-center items-center text-center">
                    <p className="text-4xl font-bold text-white mb-2">{newOrdersCount}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Новых заказов</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* ЗАМЕТКИ */}
                <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col h-full border border-zinc-100/50">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Заметки</h2>
                    <textarea
                        className="w-full flex-grow min-h-[200px] bg-[#f5f5f5] rounded-xl p-5 text-sm font-medium outline-none resize-none mb-6 border border-transparent focus:border-zinc-300 transition-colors"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Запишите идеи, номера или дела на сегодня..."
                    ></textarea>
                    <button
                        onClick={saveNotes}
                        className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-zinc-900 text-white hover:bg-black transition-colors"
                    >
                        Сохранить заметки
                    </button>
                </div>

                {/* ПОСЛЕДНИЕ ЗАКАЗЫ */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100/50 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">Последние заказы</h2>
                    </div>

                    <div className="flex flex-col gap-4 flex-grow">
                        {topOrders.length === 0 ? (
                            <p className="text-zinc-400 text-sm italic py-4">Пока нет заказов.</p>
                        ) : (
                            topOrders.map(o => {
                                const st = (o.status || 'NEW').toUpperCase();
                                let stColor = 'text-zinc-500 bg-zinc-100';
                                if (st === 'DONE' || st === 'READY') stColor = 'text-green-700 bg-green-100';
                                if (st === 'PROCESS' || st === 'IN_PROGRESS') stColor = 'text-blue-700 bg-blue-100';

                                return (
                                    <div key={o.id} className="bg-[#f5f5f5] rounded-xl p-4 flex items-center justify-between hover:bg-zinc-100 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-zinc-400 shadow-sm">
                                                #{o.id}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-[#111]">{o.name || o.customerName || 'Ручной заказ'}</p>
                                                <p className="text-xs font-medium text-zinc-500">{o.phone}</p>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${stColor}`}>
                                            {st}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
