import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Navbar from '../components/Navbar';
import { getCartItems, updateCartItem, deleteCartItem } from '../api/cartApi';
import { createOrder } from '../api/orderApi'; 
import QuantitySelector from '../components/QuantitySelector'; 
import CartProductInfo from '../components/CartProductInfo';

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

  // 🌟 2. 修改：函式改為直接接收「新數量 (newQty)」
  const handleQtyChange = async (productId, newQty) => {
    // 移除原有的 delta 計算，因為 QuantitySelector 內部已經算好絕對值了
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

  if (loading) return <div className="min-h-screen bg-[#f5f5f5]"><Navbar /><div className="text-center py-20">載入中...</div></div>;

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-1">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">購物車 ({cartItems.length})</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            
            <div className="flex-1 space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="bg-white p-4 rounded-sm shadow-sm flex items-center gap-4">
                  <CartProductInfo item={item} />
                  
                  {/* 🌟 3. 替換：使用你的 QuantitySelector 元件 */}
                  <div className="shrink-0 -my-4 scale-90 origin-right"> 
                    <QuantitySelector 
                      qty={item.pivot.quantity} 
                      // 參數說明：當子元件呼叫 setQty 時，觸發我們更新好的 handleQtyChange
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

            <div className="w-full lg:w-80 h-fit sticky top-24">
              <div className="bg-white p-6 rounded-sm shadow-sm border-t-2 border-[#ee4d2d]">
                <h3 className="text-lg font-bold mb-4">訂單摘要</h3>
                <div className="flex justify-between text-sm mb-2 text-slate-600">
                  <span>商品小計</span>
                  <span>${calculateTotal()}</span>
                </div>
                <div className="flex justify-between text-sm mb-6 text-slate-600">
                  <span>運費</span>
                  <span className="text-green-600">免運</span>
                </div>
                <div className="border-t pt-4 flex justify-between items-end mb-6">
                  <span className="font-bold">總計金額</span>
                  <span className="text-2xl font-bold text-[#ee4d2d]">${calculateTotal()}</span>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#ee4d2d] text-white font-bold hover:bg-[#d73211] transition-colors rounded-sm shadow-md disabled:bg-slate-400"
                >
                  {isSubmitting ? "正在下單..." : "下單"}
                </button>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-20 bg-white shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-slate-500 mb-6">購物車還是空的喔！</p>
            <Link to="/" className="px-10 py-3 bg-[#ee4d2d] text-white font-bold rounded-sm hover:bg-[#d73211]">去逛逛商品</Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;