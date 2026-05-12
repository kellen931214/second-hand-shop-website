import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import { getCartItems, updateCartItem, deleteCartItem } from '../api/cartApi';
import { createOrder } from '../api/orderApi'; 
import QuantitySelector from '../components/QuantitySelector'; 
import CartProductInfo from '../components/CartProductInfo';
import OrderSummary from '../components/OrderSummary';
import EmptyCart from '../components/EmptyCart';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const navigate = useNavigate(); 

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getCartItems();
      setCartItems(response.data.data || []);
    } catch (error) {
      console.error("獲取購物車失敗", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0 || isSubmitting) return;
    if (!window.confirm("確定要下單嗎？")) return;

    setIsSubmitting(true);
    try {
        const response = await createOrder(); 
        const orderId = response.data.id; 
        alert("下單成功！");
        navigate(`/orders/${orderId}`); 
    } catch (error) {
        alert(error.response?.data?.message || "下單失敗");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleQtyChange = async (productId, newQty) => {
    if (newQty < 1 || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateCartItem(productId, newQty);
      setCartItems(prev => prev.map(item => 
        item.id === productId ? { ...item, pivot: { ...item.pivot, quantity: newQty } } : item
      ));
    } catch (error) {
      alert(error.response?.data?.message || "更新失敗");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("確定要將此商品移出購物車嗎？")) return;
    try {
      await deleteCartItem(productId);
      setCartItems(prev => prev.filter(item => item.id !== productId));
    } catch (error) {
      alert("刪除失敗");
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.pivot.quantity);
    }, 0);
  };

if (loading) return <div className="min-h-screen bg-[#f5f5f5] dark:bg-slate-900"><Navbar /><div className="text-center py-20 text-slate-600 dark:text-gray-300">載入中...</div></div>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-slate-900 flex flex-col">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">購物車 ({cartItems.length})</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            
            <div className="flex-1 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white dark:bg-slate-800 p-4 rounded-sm shadow-sm flex items-center gap-4">
                  <CartProductInfo item={item} />
                  
                  <div className="shrink-0 -my-4 scale-90 origin-right"> 
                    <QuantitySelector 
                      qty={item.pivot.quantity} 
                      setQty={(newQty) => handleQtyChange(item.id, newQty)} 
                      stock={item.stock} 
                    />
                  </div>

                  <button onClick={() => handleDelete(item.id)} className="text-slate-400 hover:text-[#ee4d2d] ml-2 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <OrderSummary 
              total={calculateTotal()} 
              onCheckout={handleCheckout} 
              isSubmitting={isSubmitting} 
            />

          </div>
        ) : (
          <EmptyCart />
        )}
      </main>
    </div>
  );
};

export default CartPage;