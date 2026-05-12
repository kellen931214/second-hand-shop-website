import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrders } from '../api/orderApi';
import OrderItem from '../components/OrderItem'; 

const OrdersPage = () => {
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(); 
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data.data || response.data);
    } catch (error) {
      console.error("抓取訂單失敗", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-slate-900">
      <Navbar />
      <div className="text-center py-20 italic text-slate-400 dark:text-gray-500">訂單載入中...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-slate-900 flex flex-col">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">我的購買</h1>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <OrderItem 
                key={order.id} 
                order={order} 
                onClick={() => navigate(`/orders/${order.id}`)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 shadow-sm rounded-sm">
            <p className="text-slate-500 dark:text-gray-400">目前沒有訂單紀錄。</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrdersPage;