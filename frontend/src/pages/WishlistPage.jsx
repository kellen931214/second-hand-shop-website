import React, { useState, useEffect } from 'react';
import { useSearchParams , Link} from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { getWishlists } from '../api/productApi'; // 記得改為正確的路徑

const WishlistPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 接收網址列的分頁參數
  const page = parseInt(searchParams.get('page')) || 1;
  const [pagination, setPagination] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await getWishlists(page);
        setFavorites(response.data.data || []);
        setPagination({
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          total: response.data.total
        });
      } catch (error) {
        console.error("獲取收藏失敗", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.lastPage) return;
    setSearchParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 flex flex-col relative overflow-hidden">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <header className="mb-8 border-b border-slate-200 dark:border-slate-700 pb-4 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span className="text-red-500">❤️</span> 我的收藏清單
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2 font-medium">
              共收藏了 {pagination.total} 件商品
            </p>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
          </div>
        ) : favorites.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>

            {/* 分頁按鈕 */}
            {pagination.lastPage > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12 mb-8">
                <button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1} className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">
                  上一頁
                </button>
                <span className="text-sm font-bold text-slate-500">
                  第 <span className="text-red-500">{pagination.currentPage}</span> 頁 / 共 {pagination.lastPage} 頁
                </span>
                <button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.lastPage} className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm">
                  下一頁
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <span className="text-6xl mb-4 block">📭</span>
            <h3 className="text-lg font-bold text-slate-700 mb-2">你的收藏清單空空如也</h3>
            <p className="text-sm text-slate-500 mb-6">去逛逛有沒有喜歡的商品吧！</p>
            <Link to="/search" className="inline-block px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
              去逛逛商品
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default WishlistPage;