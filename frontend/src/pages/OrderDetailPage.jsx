import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrderDetail } from '../api/orderApi';
import { createReview } from '../api/productApi'; 
import ReviewModal from '../components/ReviewModal';
import OrderSummaryDisplay from '../components/OrderSummaryDisplay';

const OrderDetailPage = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [order, setOrder] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getOrderDetail(id);
        setOrder(response.data); 
      } catch (error) {
        alert("找不到此訂單");
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSubmitReview = async (formData) => {
    try {
      await createReview(selectedProduct.id, formData);
      alert("感謝您的評價！");
      setShowModal(false);
      
      const updated = await getOrderDetail(id);
      setOrder(updated.data);
    } catch (error) {
      alert("評價失敗");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f5f5f5] dark:bg-slate-900"><Navbar /><div className="text-center py-20 text-slate-600 dark:text-gray-300">載入中...</div></div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-slate-900 flex flex-col pb-20">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-sm shadow-sm mb-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">訂單編號：#{order.id}</div>
            <div className="text-xl font-bold text-slate-800 dark:text-white">感謝您的購買！</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 dark:text-slate-400 uppercase">訂單狀態</div>
            <div className="text-[#ee4d2d] font-bold">{order.status === 'pending' ? '已完成' : order.status}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-sm shadow-sm overflow-hidden mb-4">
          <div className="p-4 border-b dark:border-slate-700 font-medium text-slate-700 dark:text-slate-200">商品明細</div>
          <div className="divide-y divide-slate-50 dark:divide-slate-700">
            {order.order_items.map((item) => (
              <div key={item.id} className="p-4 flex gap-4 items-center">
                <img src={item.product.image_url} alt="" className="w-16 h-16 object-cover border dark:border-slate-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800 dark:text-white">{item.product.name}</div>
                  <div className="text-xs text-slate-400 mt-1">數量：x{item.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800 dark:text-white">${item.price * item.quantity}</div>
                  
                  {item.is_reviewed ? (
                    <span className="text-xs text-slate-400 block mt-2 italic">已完成評價</span>
                  ) : (
                    <button 
                      onClick={() => handleOpenReview(item.product)}
                      className="mt-2 text-xs border border-[#ee4d2d] text-[#ee4d2d] px-3 py-1 rounded-sm hover:bg-[#ffeee8] dark:hover:bg-[#3f1911] transition-colors"
                    >
                      去評價
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <OrderSummaryDisplay totalPrice={order.total_price} />
      </main>

      <ReviewModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        product={selectedProduct} 
        onSubmit={handleSubmitReview} 
      />
    </div>
  );
};

export default OrderDetailPage;