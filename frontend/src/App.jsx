import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage'; 
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WishlistPage from './pages/WishlistPage';
import HistoryPage from './pages/HistoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProductFormPage from './pages/ProductFormPage';
import AdminProductListPage from './pages/AdminProductListPage';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/wishlist" element={<WishlistPage />} /> 
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/admin/products" element={<AdminProductListPage />} />
        <Route path="/create-product" element={<ProductFormPage />} />
        <Route path="/admin/products/edit/:id" element={<ProductFormPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;