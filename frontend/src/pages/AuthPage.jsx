import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { api } from '../api'; // 🔥 ВАЖНО

export default function AuthPage() {
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', phone: '', password: '' });
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

        try {
            const endpoint = mode === 'login' ? 'auth/login' : 'auth/register';

            const body = mode === 'login'
                ? { phone: form.phone, password: form.password }
                : { name: form.name, phone: form.phone, password: form.password };

            // 🔥 ВМЕСТО fetch → используем api
            const res = await api.post(endpoint, body);

            const user = res.data.user;
            const token = res.data.token;

            // сохраняем пользователя и токен
            localStorage.setItem('user', JSON.stringify(user));
            if (token) {
                localStorage.setItem('token', token);
            }

            // передаём наверх
            if (user.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate('/profile');
            }

        } catch (err) {
            console.error(err);

            if (err.response) {
                setError(err.response.data.message || 'Ошибка');
            } else {
                setError('Нет соединения с сервером');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#051F20]">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#0D3B2E] border border-[#2E6B50]/40 rounded-2xl p-8 shadow-2xl"
            >
                <h1 className="text-2xl font-light tracking-widest text-[#DAF1DE] text-center mb-8 uppercase">
                    {mode === 'login' ? 'Вход' : 'Регистрация'}
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {mode === 'register' && (
                        <input
                            name="name"
                            type="text"
                            placeholder="Имя"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="bg-[#051F20] border border-[#2E6B50]/50 text-[#DAF1DE] placeholder-[#DAF1DE]/40 rounded-lg px-4 py-3 outline-none focus:border-[#DAF1DE]/60 transition-colors"
                        />
                    )}

                    <input
                        name="phone"
                        type="text"
                        placeholder="Телефон (+7...)"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="bg-[#051F20] border border-[#2E6B50]/50 text-[#DAF1DE] placeholder-[#DAF1DE]/40 rounded-lg px-4 py-3 outline-none focus:border-[#DAF1DE]/60 transition-colors"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="bg-[#051F20] border border-[#2E6B50]/50 text-[#DAF1DE] placeholder-[#DAF1DE]/40 rounded-lg px-4 py-3 outline-none focus:border-[#DAF1DE]/60 transition-colors"
                    />

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-[#2E6B50] hover:bg-[#3A8A65] text-[#DAF1DE] font-light tracking-widest uppercase py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Загрузка...' : (mode === 'login' ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                </form>

                <p className="text-center text-[#DAF1DE]/50 text-sm mt-6">
                    {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                    <button
                        onClick={() => {
                            setMode(mode === 'login' ? 'register' : 'login');
                            setError('');
                        }}
                        className="text-[#DAF1DE]/80 hover:text-[#DAF1DE] underline transition-colors"
                    >
                        {mode === 'login' ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                </p>
            </motion.div>
        </div>
    );
}