import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar'; // 記得引入你的 Navbar

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // 1. 取得所有商品資料
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get('/products'); 
        // Laravel paginate 回傳的實際陣列會包在 data 屬性裡面
        setProducts(response.data.data || response.data);
      } catch (error) {
        console.error("取得商品失敗", error);
        alert("無法載入商品列表");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 2. 刪除商品的邏輯
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("確定要刪除這個商品嗎？此操作無法復原。");
    if (!isConfirmed) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      // 刪除成功後，即時更新畫面
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      alert("商品已刪除！");
    } catch (error) {
      console.error("刪除失敗", error);
      alert("刪除失敗，請檢查權限或稍後再試。");
    }
  };

  if (isLoading) return <div className="text-center p-10 font-bold text-slate-500">資料載入中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">📦 商品管理後台</h1>
          <Link 
            to="/create-product" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + 發布新商品
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm border-b border-slate-200 dark:border-slate-600">
                <th className="p-4 font-medium">商品名稱</th>
                <th className="p-4 font-medium">價格</th>
                <th className="p-4 font-medium">庫存</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{product.name}</div>
                  </td>
                  <td className="p-4 text-indigo-600 dark:text-indigo-400 font-bold">${product.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {product.stock > 0 ? `${product.stock} 件` : '缺貨'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-600 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 rounded transition-colors"
                    >
                      編輯
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-600 hover:bg-red-100 dark:hover:bg-red-900 text-slate-600 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-slate-500 dark:text-slate-400">
                    目前還沒有任何商品。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductListPage;