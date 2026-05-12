import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import Navbar from '../components/Navbar';

const ProductFormPage = () => {
  const { id } = useParams(); 
  const isEditMode = Boolean(id); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
    description: ''
  });

  const [categories, setCategories] = useState([]); 
  const [isLoading, setIsLoading] = useState(isEditMode); 
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axiosInstance.get('/categories');
        setCategories(catRes.data);

        if (isEditMode) {
          const prodRes = await axiosInstance.get(`/products/${id}`);
          const product = prodRes.data;
          
          setFormData({
            name: product.name || '',
            price: product.price || '',
            stock: product.stock || '',
            category_id: product.category_id || '',
            image_url: product.image_url || '',
            description: product.description || ''
          });
        }
      } catch (error) {
        console.error("載入資料失敗", error);
        setErrorMsg("無法載入資料，請確認網路狀態。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (isEditMode) {
        await axiosInstance.put(`/products/${id}`, formData);
        alert('商品更新成功！');
      } else {
        await axiosInstance.post('/products', formData);
        alert('商品發布成功！');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error("儲存失敗", error);
      setErrorMsg(error.response?.data?.message || '儲存失敗，請檢查欄位格式');
    }
  };

  if (isLoading) return <div className="text-center p-10 font-bold">載入商品資料中...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8">
          
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
            {isEditMode ? '編輯商品' : '發布新商品'}
          </h1>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">商品名稱 *</label>
                <input 
                  type="text" name="name" required
                  value={formData.name} onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="例如：九成新 微積分原文書"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">商品分類 *</label>
                <select 
                  name="category_id" required
                  value={formData.category_id} onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                >
                  <option value="" disabled>請選擇分類</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">價格 (NT$) *</label>
                <input 
                  type="number" name="price" min="0" required
                  value={formData.price} onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="請輸入數字"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">庫存數量 *</label>
                <input 
                  type="number" name="stock" min="0" required
                  value={formData.stock} onChange={handleChange}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  placeholder="請輸入數量"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">圖片網址 (URL)</label>
              <input 
                type="url" name="image_url"
                value={formData.image_url} onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image_url && (
                <div className="mt-3">
                  <p className="text-xs text-slate-500 mb-1">圖片預覽：</p>
                  <img src={formData.image_url} alt="預覽" className="h-32 w-32 object-cover rounded-lg border border-slate-200" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">商品詳細描述</label>
              <textarea 
                name="description" rows="5"
                value={formData.description} onChange={handleChange}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-slate-700 dark:border-slate-600 dark:text-white resize-none"
                placeholder="描述一下商品的狀況、使用痕跡或面交地點..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <button 
                type="button" 
                onClick={() => navigate('/admin/products')}
                className="px-6 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                {isEditMode ? '儲存修改' : '確認發布'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductFormPage;