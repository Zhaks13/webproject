import { Link, useLocation } from 'react-router-dom';

export default function AdminTabs() {
    const loc = useLocation();

    return (
        <div className="flex gap-2 bg-gray-100/50 p-1 rounded-xl mb-8 max-w-md">
            <Link
                to="/admin"
                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold tracking-tight transition-all duration-300 ${loc.pathname === '/admin' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/50'}`}
            >
                Главная
            </Link>
            <Link
                to="/admin/orders"
                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold tracking-tight transition-all duration-300 ${loc.pathname === '/admin/orders' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/50'}`}
            >
                Заказы
            </Link>
            <Link
                to="/admin/products"
                className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold tracking-tight transition-all duration-300 ${loc.pathname === '/admin/products' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/50'}`}
            >
                Товары
            </Link>
        </div>
    );
}
