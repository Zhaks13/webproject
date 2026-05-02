import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import CustomOrder from './pages/CustomOrder';
import Contacts from './pages/Contacts';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import CartToast from './components/CartToast';

function AppRoutes() {
    return (
        <div className="min-h-screen bg-[#f5f5f5] text-[#111] font-sans flex flex-col selection:bg-zinc-200">
            <Navbar />
            <main className="flex-grow pt-24 overflow-hidden">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/custom-order" element={<CustomOrder />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/admin" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/products" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminProducts />
                        </ProtectedRoute>
                    } />
                    <Route path="/admin/orders" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminOrders />
                        </ProtectedRoute>
                    } />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
            <Footer />
            <CartToast />
        </div>
    );
}

function App() {
    return (
        <LanguageProvider>
            <CartProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </CartProvider>
        </LanguageProvider>
    );
}

export default App;