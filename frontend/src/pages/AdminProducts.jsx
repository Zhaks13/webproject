import { useState, useEffect } from 'react';
import { api } from '../api';
import { getImageUrl } from '../utils/image';
import AdminTabs from '../components/AdminTabs';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });
    const [addingProduct, setAddingProduct] = useState(false);

    const [isDragging, setIsDragging] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/products');
            setProducts(data);
        } catch (e) {
            console.error('Failed to load products', e);
            setError('Ошибка загрузки товаров. Проверьте подключение к серверу.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploadingImage(true);
        setUploadError(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const uploadResponse = await fetch('http://localhost:8080/api/products/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            const { imageUrl } = await uploadResponse.json();
            setNewProduct(prev => ({ ...prev, image: imageUrl }));
        } catch (err) {
            console.error('Ошибка загрузки файла:', err);
            setUploadError('Не удалось загрузить изображение.');
        } finally {
            setUploadingImage(false);
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();
        setAddingProduct(true);
        try {
            await api.post('/products', newProduct);
            setNewProduct({ name: '', description: '', price: '', image: '' });
            await loadData();
        } catch (e) {
            console.error(e);
            alert('Ошибка добавления товара');
        } finally {
            setAddingProduct(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Действительно удалить этот товар?')) return;
        setDeletingProductId(id);
        try {
            await api.delete(`/products/${id}`);
            await loadData();
        } catch (e) {
            console.error(e);
            alert('Ошибка удаления товара');
        } finally {
            setDeletingProductId(null);
        }
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

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
                {/* ФОРМА ДОБАВЛЕНИЯ ТОВАРА */}
                <div className="bg-white p-8 rounded-2xl shadow-sm">
                    <h2 className="text-2xl font-bold tracking-tight mb-8">Новый товар</h2>

                    <form onSubmit={addProduct} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Название</label>
                                <input
                                    required
                                    type="text"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className="w-full bg-[#f5f5f5] border border-transparent focus:border-zinc-300 rounded-xl px-5 py-3.5 text-sm font-medium outline-none transition-colors"
                                    placeholder="Стол из массива дуба"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Цена (₸)</label>
                                <input
                                    required
                                    type="number"
                                    value={newProduct.price}
                                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                                    className="w-full bg-[#f5f5f5] border border-transparent focus:border-zinc-300 rounded-xl px-5 py-3.5 text-sm font-medium outline-none transition-colors"
                                    placeholder="150000"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Описание</label>
                                <textarea
                                    rows="3"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className="w-full bg-[#f5f5f5] border border-transparent focus:border-zinc-300 rounded-xl px-5 py-3.5 text-sm font-medium outline-none transition-colors resize-none"
                                    placeholder="Детальное описание качеств и материалов..."
                                />
                            </div>
                        </div>

                        {/* Зона загрузки изображения */}
                        <div
                            className={`relative border border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300
                                ${isDragging ? 'border-zinc-400 bg-zinc-50' : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'}
                            `}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    handleFileUpload(e.dataTransfer.files[0]);
                                }
                            }}
                            onClick={() => document.getElementById('file-upload').click()}
                        >
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={(e) => { if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0]); }} />

                            {uploadingImage ? (
                                <div className="text-zinc-500 text-sm font-medium animate-pulse">Загрузка...</div>
                            ) : newProduct.image ? (
                                <div className="flex flex-col items-center">
                                    <img src={getImageUrl(newProduct.image)} alt="Preview" className="h-32 object-cover rounded-xl shadow-sm mb-3" />
                                    <p className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-md">Загружено</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center text-zinc-400">
                                    <svg className="w-8 h-8 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <p className="text-sm font-medium text-zinc-600">Перетащите картинку</p>
                                    <p className="text-xs mt-1">или нажмите для выбора</p>
                                </div>
                            )}
                        </div>

                        {uploadError && <p className="text-xs text-red-500 font-medium text-center">{uploadError}</p>}

                        <button
                            type="submit"
                            disabled={addingProduct || uploadingImage}
                            className="w-full bg-black text-white py-4 rounded-xl text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {addingProduct ? 'Добавление...' : 'Создать товар'}
                        </button>
                    </form>
                </div>

                {/* СПИСОК ТОВАРОВ */}
                <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-8">Каталог товаров <span className="text-zinc-400 font-medium text-lg ml-2">{products.length}</span></h2>

                    {loading ? (
                        <div className="text-zinc-400 text-sm font-medium">Загрузка товаров...</div>
                    ) : products.length === 0 ? (
                        <p className="text-zinc-400 text-sm italic">Каталог пока пуст.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {products.map(p => (
                                <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col justify-between group h-full">
                                    <div className="flex items-start gap-4 mb-4">
                                        {p.image ? (
                                            <div className="w-20 h-20 bg-[#f5f5f5] rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 bg-[#f5f5f5] rounded-xl flex items-center justify-center text-[10px] text-zinc-400 uppercase tracking-widest flex-shrink-0">Нет фото</div>
                                        )}
                                        <div className="flex-1 min-w-0 pr-2">
                                            <h4 className="font-bold text-sm text-[#111] leading-tight mb-1 truncate">{p.name}</h4>
                                            <p className="text-sm font-semibold text-zinc-500">{p.price} ₸</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-auto pt-4 border-t border-zinc-100">
                                        <button
                                            onClick={() => deleteProduct(p.id)}
                                            disabled={deletingProductId === p.id}
                                            className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors"
                                        >
                                            {deletingProductId === p.id ? 'Удаление...' : 'Удалить'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
