import { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '../api';
import AdminTabs from '../components/AdminTabs';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import * as XLSX from 'xlsx';

// ─── DATE UTILS ───────────────────────────────────────────────────────────────

function startOfDay(d) {
    const r = new Date(d); r.setHours(0, 0, 0, 0); return r;
}
function endOfDay(d) {
    const r = new Date(d); r.setHours(23, 59, 59, 999); return r;
}
function daysAgo(n) {
    const d = new Date(); d.setDate(d.getDate() - n); return startOfDay(d);
}
function formatDate(d) {
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
function isSameDay(a, b) {
    return startOfDay(a).getTime() === startOfDay(b).getTime();
}
function inRange(d, start, end) {
    const t = startOfDay(d).getTime();
    return t >= startOfDay(start).getTime() && t <= startOfDay(end).getTime();
}
function getRangeDays(dr) {
    return Math.max(1, Math.ceil((dr.end.getTime() - dr.start.getTime()) / 86400000));
}

function getCalendarDays(year, month) {
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    const startDow = (first.getDay() + 6) % 7; // Mon = 0
    const days = [];
    for (let i = startDow - 1; i >= 0; i--)
        days.push({ date: new Date(year, month, -i), outside: true });
    for (let d = 1; d <= last.getDate(); d++)
        days.push({ date: new Date(year, month, d), outside: false });
    while (days.length < 42) {
        const d = new Date(year, month + 1, days.length - last.getDate() - startDow + 1);
        days.push({ date: d, outside: true });
    }
    return days;
}

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// ─── ANALYTICS HELPERS ────────────────────────────────────────────────────────

function filterOrdersByDateRange(orders, dr) {
    const s = dr.start.getTime();
    const e = dr.end.getTime();
    return orders.filter(o => {
        if (!o.createdAt) return false;
        const t = new Date(o.createdAt).getTime();
        return t >= s && t <= e;
    });
}

function getPreviousPeriodOrders(orders, dr) {
    const duration = dr.end.getTime() - dr.start.getTime();
    const prevEnd = new Date(dr.start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - duration);
    return orders.filter(o => {
        if (!o.createdAt) return false;
        const t = new Date(o.createdAt).getTime();
        return t >= prevStart.getTime() && t <= prevEnd.getTime();
    });
}

function pctChange(cur, prev) {
    if (!prev || prev === 0) return null;
    return ((cur - prev) / prev) * 100;
}

function formatPrice(v) {
    if (!v && v !== 0) return '—';
    return Number(v).toLocaleString('ru-RU') + ' ₸';
}

function groupOrdersForChart(orders, dr) {
    const days = getRangeDays(dr);

    if (days > 30) {
        // Group by MONTH
        const months = Math.ceil(days / 30);
        const map = {};
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(dr.end.getFullYear(), dr.end.getMonth() - i, 1);
            const key = `${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
            map[key] = { date: key, orders: 0, revenue: 0 };
        }
        orders.forEach(o => {
            if (!o.createdAt) return;
            const d = new Date(o.createdAt);
            const key = `${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
            if (map[key]) { map[key].orders++; map[key].revenue += o.totalPrice || 0; }
        });
        return Object.values(map);
    } else {
        // Group by DAY
        const map = {};
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(dr.end);
            d.setDate(d.getDate() - i);
            const iso = d.toISOString().slice(0, 10);
            map[iso] = { date: iso.slice(5).replace('-', '.'), orders: 0, revenue: 0 };
        }
        orders.forEach(o => {
            if (!o.createdAt) return;
            const iso = new Date(o.createdAt).toISOString().slice(0, 10);
            if (map[iso]) { map[iso].orders++; map[iso].revenue += o.totalPrice || 0; }
        });
        return Object.values(map);
    }
}

function buildOrderItemsStr(order) {
    if (order.items?.length > 0) {
        return order.items.map(i => {
            const name = i.name || i.productName || `Товар #${i.productId}`;
            return `${name} ×${i.quantity || 1}`;
        }).join(', ');
    }
    return order.displayName || '—';
}

function exportToExcel(orders, dateRange) {
    const wb = XLSX.utils.book_new();
    const fmtD = d => d.toLocaleDateString('ru-RU');
    const fmtP = d => d.toLocaleDateString('ru-RU').replace(/\./g, '-');
    const now = new Date();
    const periodStr = `${fmtD(dateRange.start)} — ${fmtD(dateRange.end)}`;

    // ── Sheet 1: Заказы ──────────────────────────────────────────────────────
    const headerBlock = [
        ['ОТЧЕТ ПО ЗАКАЗАМ'],
        [`Период: ${periodStr}`],
        [`Дата формирования: ${fmtD(now)}`],
        [],
    ];
    const tableHeaders = ['ID', 'Дата', 'Клиент', 'Телефон', 'Адрес', 'Товары', 'Кол-во товаров', 'Сумма (₸)', 'Статус'];
    const tableRows = orders.map(o => {
        const items = o.items || [];
        const totalQty = items.length > 0 ? items.reduce((s, i) => s + (i.quantity || 1), 0) : 1;
        return [
            o.id ?? '',
            o.createdAt ? new Date(o.createdAt).toLocaleString('ru-RU') : '',
            o.name || '',
            o.phone || '',
            o.address || '',
            buildOrderItemsStr(o),
            totalQty,
            o.totalPrice ?? 0,
            o.status || '',
        ];
    });
    const ws1 = XLSX.utils.aoa_to_sheet([...headerBlock, tableHeaders, ...tableRows]);
    ws1['!cols'] = [
        { wch: 6 }, { wch: 22 }, { wch: 20 }, { wch: 16 },
        { wch: 25 }, { wch: 38 }, { wch: 16 }, { wch: 14 }, { wch: 14 },
    ];
    XLSX.utils.book_append_sheet(wb, ws1, 'Заказы');

    // ── Sheet 2: Сводка ───────────────────────────────────────────────────────
    const revenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const avg = orders.length > 0 ? Math.round(revenue / orders.length) : 0;
    const newCount = orders.filter(o => (o.status || '').toUpperCase() === 'NEW').length;

    const itemCount = {};
    orders.forEach(o => {
        (o.items || []).forEach(item => {
            const nm = item.name || item.productName || `Товар #${item.productId}`;
            itemCount[nm] = (itemCount[nm] || 0) + (item.quantity || 1);
        });
    });
    const popular = Object.entries(itemCount).sort((a, b) => b[1] - a[1])[0];
    const popularStr = popular ? `${popular[0]} (${popular[1]} шт.)` : '—';

    const ws2 = XLSX.utils.aoa_to_sheet([
        ['СВОДКА'],
        [`Период: ${periodStr}`],
        [],
        ['Показатель', 'Значение'],
        ['Общее количество заказов', orders.length],
        ['Общая выручка (₸)', revenue],
        ['Средний чек (₸)', avg],
        ['Самый популярный товар', popularStr],
        ['Кол-во новых заказов', newCount],
    ]);
    ws2['!cols'] = [{ wch: 32 }, { wch: 36 }];
    XLSX.utils.book_append_sheet(wb, ws2, 'Сводка');

    // ── Sheet 3: По дням ──────────────────────────────────────────────────────
    const dayMap = {};
    orders.forEach(o => {
        if (!o.createdAt) return;
        const day = new Date(o.createdAt).toLocaleDateString('ru-RU');
        if (!dayMap[day]) dayMap[day] = { cnt: 0, rev: 0 };
        dayMap[day].cnt++;
        dayMap[day].rev += o.totalPrice || 0;
    });
    const ws3 = XLSX.utils.aoa_to_sheet([
        ['ПО ДНЯМ'],
        [`Период: ${periodStr}`],
        [],
        ['Дата', 'Кол-во заказов', 'Выручка (₸)'],
        ...Object.entries(dayMap).map(([day, { cnt, rev }]) => [day, cnt, rev]),
    ]);
    ws3['!cols'] = [{ wch: 16 }, { wch: 18 }, { wch: 16 }];
    XLSX.utils.book_append_sheet(wb, ws3, 'По дням');

    // ── Filename ──────────────────────────────────────────────────────────────
    XLSX.writeFile(wb, `Отчет_заказов_${fmtP(dateRange.start)}_${fmtP(dateRange.end)}.xlsx`);
}

// ─── DATE RANGE PICKER ────────────────────────────────────────────────────────

function DateRangePicker({ dateRange, onChange }) {
    const [open, setOpen] = useState(false);
    const [picking, setPicking] = useState(null); // { start: Date } | null
    const [hovered, setHovered] = useState(null);
    const [vy, setVy] = useState(() => dateRange.end.getFullYear());
    const [vm, setVm] = useState(() => dateRange.end.getMonth());
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setPicking(null); } };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [open]);

    const todayReal = new Date();

    const presets = [
        { label: 'Сегодня', fn: () => applyRange(startOfDay(new Date()), endOfDay(new Date())) },
        { label: '7 дней', fn: () => applyRange(daysAgo(6), endOfDay(new Date())) },
        { label: '30 дней', fn: () => applyRange(daysAgo(29), endOfDay(new Date())) },
        {
            label: 'Этот месяц', fn: () => {
                const n = new Date();
                applyRange(startOfDay(new Date(n.getFullYear(), n.getMonth(), 1)), endOfDay(n));
            }
        },
    ];

    function applyRange(start, end) {
        onChange({ start, end });
        setPicking(null);
        setOpen(false);
    }

    function prevM() { if (vm === 0) { setVm(11); setVy(y => y - 1); } else setVm(m => m - 1); }
    function nextM() { if (vm === 11) { setVm(0); setVy(y => y + 1); } else setVm(m => m + 1); }

    function handleDay(date) {
        const d = startOfDay(date);
        if (!picking) {
            setPicking({ start: d });
        } else {
            let s = picking.start, e = d;
            if (e < s) [s, e] = [e, s];
            applyRange(s, endOfDay(e));
        }
    }

    const calDays = getCalendarDays(vy, vm);

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                onClick={() => { setOpen(o => !o); setPicking(null); setHovered(null); }}
                className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-800 text-xs font-bold rounded-xl px-4 py-2.5 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300 transition-all"
            >
                <svg className="w-4 h-4 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Период: {formatDate(dateRange.start)} — {formatDate(dateRange.end)}</span>
                <svg className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Popup */}
            {open && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-50 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-5 w-[300px]">

                    {/* Presets */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {presets.map(p => (
                            <button key={p.label} onClick={p.fn}
                                className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white transition-colors">
                                {p.label}
                            </button>
                        ))}
                    </div>

                    {/* Month nav */}
                    <div className="flex items-center justify-between mb-3">
                        <button onClick={prevM}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <span className="text-sm font-bold text-zinc-800">{MONTHS[vm]} {vy}</span>
                        <button onClick={nextM}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-1">
                        {DAYS.map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-zinc-400 py-1">{d}</div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-7">
                        {calDays.map(({ date, outside }, i) => {
                            if (outside) {
                                return <div key={i} className="h-9" />;
                            }

                            const isToday = isSameDay(date, todayReal);

                            // Compute visual range
                            const anchor = picking ? picking.start : dateRange.start;
                            const terminus = picking
                                ? (hovered ? (hovered < picking.start ? picking.start : hovered) : picking.start)
                                : dateRange.end;
                            const effectiveStart = picking
                                ? (hovered && hovered < picking.start ? hovered : anchor)
                                : anchor;
                            const effectiveEnd = terminus;

                            const isSelStart = isSameDay(date, picking ? picking.start : dateRange.start);
                            const isSelEnd = !picking && isSameDay(date, dateRange.end);
                            const isSel = isSelStart || isSelEnd;
                            const isInRng = inRange(date, effectiveStart, effectiveEnd);
                            const isEdge = isSameDay(date, effectiveStart) || isSameDay(date, effectiveEnd);

                            return (
                                <button key={i}
                                    onClick={() => handleDay(date)}
                                    onMouseEnter={() => picking && setHovered(startOfDay(date))}
                                    onMouseLeave={() => picking && setHovered(null)}
                                    className={[
                                        'relative h-9 w-full text-[12px] font-semibold transition-colors duration-100',
                                        isSel || isEdge
                                            ? 'bg-zinc-900 text-white rounded-lg z-10'
                                            : isInRng
                                                ? 'bg-zinc-100 text-zinc-800'
                                                : 'text-zinc-700 hover:bg-zinc-50 rounded-lg',
                                        isToday && !isSel && !isEdge ? 'text-emerald-600' : '',
                                    ].filter(Boolean).join(' ')}
                                >
                                    {date.getDate()}
                                    {isToday && !isSel && !isEdge && (
                                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500 block" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {picking && (
                        <p className="text-center text-[11px] text-zinc-400 mt-3 font-semibold">
                            Кликните на конечную дату
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

function defaultRange() {
    return { start: daysAgo(6), end: endOfDay(new Date()) };
}

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notes, setNotes] = useState(localStorage.getItem('adminNotes') || '');
    const [dateRange, setDateRange] = useState(defaultRange);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [oRes, pRes] = await Promise.all([api.get('/orders'), api.get('/products')]);
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

    const filteredOrders = useMemo(() => filterOrdersByDateRange(orders, dateRange), [orders, dateRange]);
    const prevOrders = useMemo(() => getPreviousPeriodOrders(orders, dateRange), [orders, dateRange]);

    const totalRevenue = useMemo(() => filteredOrders.reduce((s, o) => s + (o.totalPrice || 0), 0), [filteredOrders]);
    const prevRevenue = useMemo(() => prevOrders.reduce((s, o) => s + (o.totalPrice || 0), 0), [prevOrders]);
    const newOrdersCount = useMemo(() => filteredOrders.filter(o => (o.status || '').toUpperCase() === 'NEW').length, [filteredOrders]);
    const allNewOrders = useMemo(() => orders.filter(o => (o.status || '').toUpperCase() === 'NEW').length, [orders]);
    const avgCheck = filteredOrders.length > 0 ? Math.round(totalRevenue / filteredOrders.length) : 0;
    const revenuePct = useMemo(() => pctChange(totalRevenue, prevRevenue), [totalRevenue, prevRevenue]);
    const chartData = useMemo(() => groupOrdersForChart(filteredOrders, dateRange), [filteredOrders, dateRange]);
    const topOrders = useMemo(() => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5), [orders]);

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

            {/* ─── HEADER ──────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                <h1 className="text-4xl font-bold tracking-tighter">Панель Управления</h1>
                <div className="flex items-center gap-3">
                    <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
                    <button
                        onClick={() => exportToExcel(filteredOrders, dateRange)}
                        disabled={filteredOrders.length === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Скачать отчет
                    </button>
                </div>
            </div>

            <AdminTabs />

            {/* ─── STATS ───────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100/50 flex flex-col justify-center items-center text-center">
                    <p className="text-4xl font-bold text-[#111] mb-2">{products.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Всех товаров</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100/50 flex flex-col justify-center items-center text-center">
                    <p className="text-4xl font-bold text-[#111] mb-2">{filteredOrders.length}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Заказов за период</p>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-6 shadow-md flex flex-col justify-center items-center text-center">
                    <p className="text-4xl font-bold text-white mb-2">{newOrdersCount}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Новых заказов</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100/50 flex flex-col justify-center items-center text-center">
                    <p className="text-xl font-bold text-emerald-600 mb-1 leading-tight break-all">{formatPrice(totalRevenue)}</p>
                    {revenuePct !== null ? (
                        <p className={`text-[11px] font-bold mb-2 ${revenuePct >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {revenuePct >= 0 ? '+' : ''}{revenuePct.toFixed(1)}% за период
                        </p>
                    ) : (
                        <p className="text-[11px] text-zinc-300 mb-2">нет данных прошлого периода</p>
                    )}
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Общая выручка</p>
                </div>
            </div>

            {/* Avg check wide bar */}
            <div className="bg-white rounded-2xl px-8 py-5 shadow-sm border border-zinc-100/50 flex items-center justify-between mb-10">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Средний чек</p>
                    <p className="text-3xl font-bold text-[#111]">{formatPrice(avgCheck)}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Всего новых</p>
                    <p className="text-3xl font-bold text-[#111]">{allNewOrders}</p>
                </div>
            </div>

            {/* ─── CHART ───────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100/50 mb-10">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold tracking-tight text-zinc-800">Динамика заказов</h2>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                        {getRangeDays(dateRange) > 30 ? 'по месяцам' : 'по дням'}
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fontWeight: 600, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="orders" allowDecimals={false} tick={{ fontSize: 11, fontWeight: 600, fill: '#a1a1aa' }} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="revenue" orientation="right" tick={{ fontSize: 10, fontWeight: 600, fill: '#a1a1aa' }} axisLine={false} tickLine={false}
                            tickFormatter={v => v > 0 ? (v / 1000).toFixed(0) + 'k' : '0'} />
                        <Tooltip
                            contentStyle={{ background: '#18181b', border: 'none', borderRadius: 10, color: '#fff', fontSize: 12, fontWeight: 600 }}
                            labelStyle={{ color: '#a1a1aa', marginBottom: 4 }}
                            formatter={(val, name) => name === 'revenue'
                                ? [val.toLocaleString('ru-RU') + ' ₸', 'Выручка']
                                : [val, 'Заказов']}
                        />
                        <Legend iconType="circle" iconSize={8}
                            formatter={n => n === 'revenue' ? 'Выручка' : 'Заказов'}
                            wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 8 }} />
                        <Line yAxisId="orders" type="monotone" dataKey="orders" stroke="#18181b" strokeWidth={2.5}
                            dot={{ fill: '#18181b', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, fill: '#18181b' }} />
                        <Line yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2}
                            dot={{ fill: '#10b981', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: '#10b981' }} strokeDasharray="5 3" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ─── NOTES + RECENT ORDERS ───────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col h-full border border-zinc-100/50">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Заметки</h2>
                    <textarea
                        className="w-full flex-grow min-h-[200px] bg-[#f5f5f5] rounded-xl p-5 text-sm font-medium outline-none resize-none mb-6 border border-transparent focus:border-zinc-300 transition-colors"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Запишите идеи, номера или дела на сегодня..."
                    />
                    <button onClick={saveNotes}
                        className="w-full py-4 rounded-xl text-xs font-bold uppercase tracking-widest bg-zinc-900 text-white hover:bg-black transition-colors">
                        Сохранить заметки
                    </button>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100/50 h-full flex flex-col">
                    <h2 className="text-2xl font-bold tracking-tight mb-6">Последние заказы</h2>
                    <div className="flex flex-col gap-4 flex-grow">
                        {topOrders.length === 0 ? (
                            <p className="text-zinc-400 text-sm italic py-4">Пока нет заказов.</p>
                        ) : topOrders.map(o => {
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
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}
