import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function AuthPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', phone: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (mode === 'register' && form.password !== form.confirmPassword) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        try {
            const endpoint = mode === 'login' ? 'auth/login' : 'auth/register';
            const body = mode === 'login'
                ? { phone: form.phone, password: form.password }
                : { name: form.name, phone: form.phone, password: form.password };

            const res = await api.post(endpoint, body);
            const { user, token } = res.data;

            localStorage.setItem('user', JSON.stringify(user));
            if (token) localStorage.setItem('token', token);

            navigate(user.role === 'ADMIN' ? '/admin' : '/profile');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Нет соединения с сервером');
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `
        w-full bg-white border border-gray-300 text-black
        placeholder-gray-400 rounded-lg px-4 py-3 outline-none
        focus:ring-2 focus:ring-black focus:border-transparent
        transition-all duration-200
    `;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative flex w-full max-w-[900px] min-h-[500px] rounded-2xl overflow-hidden shadow-xl"
            >

                {/* Левая часть */}
                <div className="w-1/2 bg-black text-white flex items-center justify-center pl-10 pr-32 py-10">
                    <div className="text-center w-full max-w-[320px]">
                        <h2 className="text-3xl font-bold mb-4 tracking-tight">Stolyarniy Dvor</h2>
                        <p className="text-gray-400 text-base">
                            Мебель с характером и качеством
                        </p>
                    </div>
                </div>

                {/* Правая часть (с вырезом) */}
                <div className="
                    absolute right-0 top-0 z-10
                    w-full md:w-[58%] h-full
                    bg-white
                    md:rounded-l-[80px]
                    shadow-[-20px_0_40px_rgba(0,0,0,0.08)]
                    flex flex-col justify-center
                    px-6 md:px-10
                    before:hidden md:before:block before:absolute before:-left-[40px] before:top-0 before:h-full before:w-[40px] before:bg-gradient-to-r before:from-black before:to-transparent before:pointer-events-none
                ">
                    <div className="w-full max-w-sm mx-auto">

                        {/* Переключатель */}
                        <div className="flex gap-6 mb-8 text-sm mt-4 md:mt-0">
                            <button
                                type="button"
                                onClick={() => { setMode('login'); setError(''); }}
                                className={`pb-3 font-semibold transition-all ${mode === 'login' ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Вход
                            </button>
                            <button
                                type="button"
                                onClick={() => { setMode('register'); setError(''); }}
                                className={`pb-3 font-semibold transition-all ${mode === 'register' ? 'text-black border-b-2 border-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Регистрация
                            </button>
                        </div>

                        {/* Форма */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <AnimatePresence>
                                {mode === 'register' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Ваше имя"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <input
                                name="phone"
                                type="text"
                                placeholder="Телефон (+7...)"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />

                            <input
                                name="password"
                                type="password"
                                placeholder="Пароль"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className={inputClass}
                            />

                            <AnimatePresence>
                                {mode === 'register' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <input
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="Подтверждение пароля"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className={inputClass}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Ошибка */}
                            <AnimatePresence>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-center"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {/* Кнопка */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full bg-black text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm py-3 rounded-lg transition-all"
                            >
                                {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
                            </button>
                        </form>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}