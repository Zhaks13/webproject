import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import CustomOrder from './pages/CustomOrder';
import Contacts from './pages/Contacts';
import Admin from './pages/Admin';

function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#F5F5F7] text-gray-900 font-sans flex flex-col selection:bg-blue-200">
                <Navbar />
                <main className="flex-grow pt-24 pb-16 overflow-hidden">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalog" element={<Products />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/custom-order" element={<CustomOrder />} />
                        <Route path="/contacts" element={<Contacts />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
