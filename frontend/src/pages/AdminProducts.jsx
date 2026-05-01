import { useState, useEffect } from 'react';
import { api } from '../api';
import { getImageUrl } from '../utils/image';
import AdminTabs from '../components/AdminTabs';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', images: [] });
    const [addingProduct, setAddingProduct] = useState(false);

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
            console.error(e);
            setError('Ошибка загрузки товаров');
        } finally {
            setLoading(false);
        }
    };

    // 🔥 ГЛАВНОЕ ИСПРАВЛЕНИЕ ЗДЕСЬ
    const handleFileUpload = async (files) => {
        if (!files || files.length === 0) return;

        const remaining = 5 - newProduct.images.length;
        if (remaining <= 0) {
            setUploadError('Максимум 5 изображений');
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remaining);

        setUploadingImage(true);
        setUploadError(null);

        const formData = new FormData();
        filesToUpload.forEach(f => formData.append('images', f));

        try {
            const { data } = await api.post(
                '/products/upload-multiple',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setNewProduct(prev => ({
                ...prev,
                images: [...prev.images, ...data.imageUrls].slice(0, 5)
            }));

        } catch (err) {
            console.error(err);
            setUploadError('Ошибка загрузки');
        } finally {
            setUploadingImage(false);
        }
    };

    const addProduct = async (e) => {
        e.preventDefault();
        setAddingProduct(true);

        try {
            await api.post('/products', newProduct);
            setNewProduct({ name: '', description: '', price: '', images: [] });
            await loadData();
        } catch (e) {
            console.error(e);
            alert('Ошибка добавления');
        } finally {
            setAddingProduct(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm('Удалить товар?')) return;

        setDeletingProductId(id);

        try {
            await api.delete(`/products/${id}`);
            await loadData();
        } catch (e) {
            console.error(e);
            alert('Ошибка удаления');
        } finally {
            setDeletingProductId(null);
        }
    };

    return (
        <div className="max-w-[1200px] mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">Админка</h1>

            <AdminTabs />

            {/* ФОРМА */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 mb-10">
                <h2 className="text-xl font-semibold mb-6">Добавить товар</h2>

                <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <input
                            placeholder="Название"
                            value={newProduct.name}
                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="number"
                            placeholder="Цена"
                            value={newProduct.price}
                            onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                            required
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                        <textarea
                            placeholder="Описание"
                            value={newProduct.description}
                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 min-h-[120px]"
                        />
                    </div>

                    {/* UPLOAD */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <label className="block w-full border-dashed border-2 border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors">
                            <span className="text-gray-500 font-medium">Загрузить изображение</span>
                            <input
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFileUpload(e.target.files)}
                            />
                        </label>

                        {uploadingImage && <p className="text-sm text-gray-500">Загрузка...</p>}
                        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

                        {/* PREVIEW */}
                        {newProduct.images.length > 0 && (
                            <div className="flex gap-3 flex-wrap mt-2">
                                {newProduct.images.map((img, i) => (
                                    <img
                                        key={i}
                                        src={getImageUrl(img)}
                                        alt={`Preview ${i}`}
                                        className="w-24 h-24 object-cover rounded-xl shadow-sm border border-gray-100"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="col-span-1 md:col-span-2 mt-2">
                        <button
                            type="submit"
                            disabled={addingProduct || uploadingImage}
                            className="w-fit bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-colors disabled:opacity-50"
                        >
                            {addingProduct ? 'Добавление...' : 'Добавить'}
                        </button>
                    </div>
                </form>
            </div>

            {/* СПИСОК */}
            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(p => (
                        <div key={p.id} className="bg-white w-full max-w-[320px] mx-auto rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">

                            {(p.images?.[0] || p.image) ? (
                                <img
                                    src={getImageUrl(p.images?.[0] || p.image)}
                                    className="h-40 w-full object-cover"
                                    alt={p.name}
                                />
                            ) : (
                                <div className="h-40 w-full bg-gray-50 flex items-center justify-center text-xs text-gray-400">Нет фото</div>
                            )}

                            <div className="p-3 flex flex-col gap-1">
                                <h3 className="text-base font-medium text-gray-900 truncate" title={p.name}>
                                    {p.name}
                                </h3>
                                <p className="text-sm text-gray-500 font-medium">
                                    {Number(p.price).toLocaleString('ru-RU')} ₸
                                </p>

                                <button
                                    onClick={() => deleteProduct(p.id)}
                                    className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline mt-1 text-left w-fit transition-colors"
                                >
                                    Удалить
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 