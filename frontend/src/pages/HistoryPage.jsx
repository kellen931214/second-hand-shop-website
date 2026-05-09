import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getHistory, removeHistoryItem, clearAllHistory } from '../api/productApi';

const HistoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const page = parseInt(searchParams.get('page')) || 1;
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await getHistory(page);
      setHistory(response.data.data || []);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total
      });
    } catch (error) {
      console.error("獲取歷史紀錄失敗", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  // 🗑️ 呼叫 API 單筆刪除
  const handleDeleteItem = async (productId) => {
    try {
      await removeHistoryItem(productId);
      // 刪除成功後，重新抓取目前的畫面更新列表
      fetchHistory();
    } catch (error) {
      console.error("移除歷史紀錄失敗", error);
      alert("移除失敗，請稍後再試");
    }
  };

  // 🧹 呼叫 API 一鍵清空
  const handleClearAll = async () => {
    if (!window.confirm("確定要清空所有瀏覽紀錄嗎？這個動作無法復原喔！")) return;
    
    try {
      await clearAllHistory();
      setHistory([]);
      setPagination({ currentPage: 1, lastPage: 1, total: 0 });
    } catch (error) {
      console.error("清空紀錄失敗", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.lastPage) return;
    setSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <header className="mb-8 border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span className="text-indigo-500">🕒</span> 最近瀏覽過
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              共 {pagination.total} 筆紀錄
            </p>
          </div>
          
          {/* 一鍵清空按鈕 */}
          {history.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-50 text-red-500 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              清空紀錄
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
          </div>
        ) : history.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {history.map((item) => (
                <div key={item.id} className="relative group">
                  {/* 疊加在 ProductCard 右上角的移除按鈕 */}
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="absolute top-2 right-2 z-20 p-2 bg-white/80 backdrop-blur-md text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                    title="從紀錄中移除"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  {/* 你的商品卡片組件 */}
                  <ProductCard product={item} />
                </div>
              ))}
            </div>

            {/* 分頁按鈕 */}
            {pagination.lastPage > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 mb-8">
                <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">
                  上一頁
                </button>
                <span className="text-sm font-bold text-slate-500">
                  第 <span className="text-indigo-600">{pagination.currentPage}</span> 頁 / 共 {pagination.lastPage} 頁
                </span>
                <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage} className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">
                  下一頁
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <span className="text-6xl mb-4 block">👀</span>
            <h3 className="text-lg font-bold text-slate-700 mb-2">還沒有瀏覽紀錄</h3>
            <p className="text-sm text-slate-500 mb-6">看到喜歡的商品點進去，就會出現在這裡囉！</p>
            <Link to="/search" className="inline-block px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
              去逛逛商品
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;