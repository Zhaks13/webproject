import { useState, useEffect } from 'react';
import { api } from '../api';
import { getImageUrl } from '../utils/image';

export default function Admin() {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form states
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });
    const [addingProduct, setAddingProduct] = useState(false);

    // Image Upload states
    const [isDragging, setIsDragging] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Status loading mapping
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [deletingProductId, setDeletingProductId] = useState(null);

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
            console.error('Failed to load admin data', e);
            setError('Ошибка загрузки данных. Проверьте подключение к серверу.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (file) => {
        if (!file) return;
        setUploadingImage(true);
        setUploadError(null);

        // Используем FormData для отправки на сервер
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Ипользуем fetch, чтобы избежать проблем Axios с перезаписью boundary в Content-Type
            const uploadResponse = await fetch('http://localhost:8080/api/products/upload', {
                method: 'POST',
                body: formData
            });

            if (!uploadResponse.ok) {
                throw new Error('Upload failed');
            }

            const { imageUrl } = await uploadResponse.json();

            // Сохраняем URL полученного изображения в state нового продукта
            setNewProduct(prev => ({ ...prev, image: imageUrl }));
        } catch (err) {
            console.error('Ошибка загрузки файла:', err);
            setUploadError('Не удалось загрузить изображение. Убедитесь, что сервер работает корректно.');
        } finally {
            setUploadingImage(false);
        }
    };

    // === ТОВАРЫ Логика ===
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

    // === ЗАКАЗЫ Логика ===
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

    if (loading && products.length === 0 && orders.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 px-2 md:px-0">Панель Администратора</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
                    <p>{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">

                {/* === БЛОК: ТОВАРЫ === */}
                <div className="bg-gray-50 p-6 xl:p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <svg className="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                        Управление товарами
                    </h2>

                    {/* Форма добавления */}
                    <form onSubmit={addProduct} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-5 hover:shadow-md transition">
                        <h3 className="font-semibold text-gray-700 mb-2 border-b pb-2">Добавить новый товар</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input required placeholder="Название товара" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                                value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
                            <input required type="number" placeholder="Цена (₸)" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition"
                                value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                        </div>

                        <textarea placeholder="Описание товара" className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition resize-none" rows="2"
                            value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />

                        {/* Drag and Drop Зона Загрузки Картинки */}
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200
                ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
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
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        handleFileUpload(e.target.files[0]);
                                    }
                                }}
                            />

                            {uploadingImage ? (
                                <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                    <p className="text-sm text-gray-500 font-medium">Загрузка изображения на сервер...</p>
                                </div>
                            ) : newProduct.image ? (
                                <div className="relative group w-full flex flex-col items-center">
                                    <img src={getImageUrl(newProduct.image)} alt="Preview" className="h-40 object-contain rounded-lg mb-2 shadow-sm border border-gray-100" />
                                    <p className="text-sm text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">Изображение загружено!</p>
                                    <p className="text-xs text-blue-500 mt-2 hover:underline">Нажмите или перетащите другое, чтобы заменить</p>
                                </div>
                            ) : (
                                <>
                                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                                        <svg className="h-8 w-8 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <p className="text-base text-gray-800 font-medium">Перетащите изображение сюда</p>
                                    <p className="text-sm text-gray-500 mt-1">или нажмите, чтобы выбрать файл</p>
                                </>
                            )}
                        </div>

                        {uploadError && (
                            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md font-medium text-center border border-red-100">
                                {uploadError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={addingProduct || uploadingImage}
                            className={`w-full text-white px-4 py-3.5 rounded-lg font-bold shadow-sm transition-all duration-200 flex justify-center items-center mt-2
                ${(addingProduct || uploadingImage) ? 'bg-gray-400 cursor-not-allowed opacity-80' : 'bg-blue-600 hover:bg-blue-700 active:transform active:translate-y-0.5 shadow-md'}
              `}
                        >
                            {addingProduct ? 'Добавление...' : '+ Сохранить товар'}
                        </button>
                    </form>

                    {/* Список товаров */}
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-4 px-2">Список готовых товаров ({products.length})</h3>
                        <div className="space-y-4">
                            {products.length === 0 ? (
                                <p className="text-gray-500 italic px-2">Товаров пока нет.</p>
                            ) : (
                                products.map(p => (
                                    <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center group hover:shadow-md transition">
                                        <div className="flex items-center space-x-4 w-full pr-4">
                                            {p.image ? (
                                                <img src={getImageUrl(p.image)} alt={p.name} className="w-14 h-14 rounded-lg object-cover border flex-shrink-0" />
                                            ) : (
                                                <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 border flex-shrink-0">Нет</div>
                                            )}
                                            <div className="overflow-hidden">
                                                <h4 className="font-bold text-gray-800 truncate">{p.name}</h4>
                                                <p className="text-sm text-blue-600 font-bold">{p.price} ₸</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteProduct(p.id)}
                                            disabled={deletingProductId === p.id}
                                            className={`p-2.5 rounded-lg transition-colors flex-shrink-0
                        ${deletingProductId === p.id ? 'bg-gray-100 text-gray-500' : 'text-red-500 hover:text-red-700 hover:bg-red-50 bg-white border border-red-100'}
                      `}
                                            title="Удалить товар"
                                        >
                                            {deletingProductId === p.id ? '...' : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            )}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* === БЛОК: ЗАКАЗЫ === */}
                <div className="bg-gray-50 p-6 xl:p-8 rounded-2xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                        <svg className="w-7 h-7 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                        Заказы клиентов
                    </h2>

                    <div>
                        <h3 className="font-semibold text-gray-700 mb-4 px-2">Поступившие заявки ({orders.length})</h3>
                        <div className="space-y-5">
                            {orders.length === 0 ? (
                                <p className="text-gray-500 italic px-2">Заказов пока нет.</p>
                            ) : (
                                orders.map(o => {
                                    const product = products.find(p => p.id === o.productId);

                                    // Color coding for status
                                    let statusColor = "bg-gray-100 text-gray-800 border items-border-gray-200";
                                    if (o.status === "new" || o.status === "NEW") statusColor = "bg-blue-50 text-blue-700 border border-blue-200";
                                    if (o.status === "in_progress" || o.status === "IN_PROGRESS") statusColor = "bg-yellow-50 text-yellow-800 border border-yellow-200";
                                    if (o.status === "done" || o.status === "READY" || o.status === "DONE") statusColor = "bg-green-50 text-green-700 border border-green-200";

                                    return (
                                        <div key={o.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition overflow-hidden">
                                            <div className={`px-5 py-3 border-b flex justify-between items-center ${statusColor.split(' ')[0]}`}>
                                                <h3 className="font-bold text-lg">Заказ #{o.id}</h3>
                                                <div className="flex flex-col items-end relative">
                                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${statusColor}`}>
                                                        {o.status}
                                                    </span>
                                                    {updatingStatusId === o.id && (
                                                        <span className="text-[10px] text-gray-500 animate-pulse absolute -bottom-4 right-0 font-medium">Обновление...</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-5 text-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm mt-1 mb-2">
                                                <div>
                                                    <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Клиент</p>
                                                    <p className="font-medium text-gray-900 text-base">{o.customerName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Телефон</p>
                                                    <p className="font-medium text-gray-900 text-base">{o.phone}</p>
                                                </div>
                                                <div className="col-span-1 sm:col-span-2 pt-1">
                                                    <p className="text-xs text-gray-400 font-semibold uppercase mb-0.5">Заказанный товар</p>
                                                    <p className="font-medium text-gray-900 text-base flex items-center">
                                                        {product ? product.name : `Удаленный товар (ID: ${o.productId})`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="px-5 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <label className="text-sm font-semibold text-gray-600 block sm:inline">Действие:</label>
                                                <select
                                                    value={o.status.toLowerCase()}
                                                    disabled={updatingStatusId === o.id}
                                                    onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                                                    className="w-full sm:w-auto border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm font-medium bg-white focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer transition disabled:opacity-50"
                                                >
                                                    <option value="new">Новый (New)</option>
                                                    <option value="in_progress">В работе (In progress)</option>
                                                    <option value="done">Выполнен (Done)</option>
                                                </select>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
