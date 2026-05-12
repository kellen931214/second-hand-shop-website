import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner'; 

import { getProducts, getCategories } from '../api/productApi';

const SORTS = [
  { id: 'views', name: '最多瀏覽' },
  { id: 'rating', name: '最高評價' },
  { id: 'wishes', name: '最多收藏' },
];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0
  });

  const q = searchParams.get('q') || "";
  const categoryId = searchParams.get('category_id') || "";
  const sort = searchParams.get('sort') || "newest";
  const page = parseInt(searchParams.get('page')) || 1;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategoriesList(response.data);
      } catch (error) {
        console.error("獲取分類失敗", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                key_word: q,       
                category_id: categoryId, 
                sort: sort,
                page: page 
            };

            const response = await getProducts({ params });
            setProducts(response.data.data || []);
            
            setPagination({
                currentPage: response.data.current_page,
                lastPage: response.data.last_page,
                total: response.data.total
            });

        } catch (error) {
            console.error("獲取商品資料失敗", error);
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
  }, [q, categoryId, sort, page]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.lastPage) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col md:flex-row gap-8 items-start">
          
          <aside className="w-full md:w-56 shrink-0 sticky top-24">
             <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-700/60">
                <h2 className="text-slate-800 dark:text-gray-200 font-bold text-base tracking-wide">條件篩選</h2>
              </div>

              <div className="mb-8">
                <h3 className="text-xs font-black text-slate-400 dark:text-gray-500 tracking-widest mb-3 uppercase">分類</h3>
                <ul className="space-y-1">
                  <li>
                    <Link to={`/search?q=${q}&category_id=&sort=${sort}&page=1`} className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${!categoryId ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-500 dark:hover:text-indigo-400'}`}>全部</Link>
                  </li>
                  {categoriesList.map(cat => (
                    <li key={cat.id}>
                      <Link to={`/search?q=${q}&category_id=${cat.id}&sort=${sort}&page=1`} className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${categoryId === cat.id.toString() ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-500 dark:hover:text-indigo-400'}`}>{cat.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 dark:text-gray-500 tracking-widest mb-3 uppercase">商品排序</h3>
                <ul className="space-y-1">
                  {SORTS.map(s => (
                    <li key={s.id}>
                      <Link to={`/search?q=${q}&category_id=${categoryId}&sort=${s.id}&page=1`} className={`block px-3 py-2 rounded-lg text-sm font-bold transition-all ${sort === s.id ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-indigo-500 dark:hover:text-indigo-400'}`}>{s.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          <div className="flex-1 w-full">
            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                 {q && <span className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest mb-1 block">Search Results</span>}
                 <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                   {q ? `"${q}" 的搜尋結果` : (categoriesList.find(c => c.id.toString() === categoryId)?.name || '全部商品')}
                 </h1>
              </div>
              <div className="text-sm font-bold text-slate-500 dark:text-gray-400">
                共找到 {pagination.total} 件商品
              </div>
            </header>

            {loading ? (
              <LoadingSpinner message="載入商品中..." />
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.length > 0 ? (
                    products.map((item) => (
                      <ProductCard key={item.id} product={item} />
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center text-slate-500 font-bold">
                      找不到符合條件的商品 😢
                    </div>
                  )}
                </div>

                {pagination.lastPage > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-12 mb-8">
                    <button 
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      上一頁
                    </button>
                    
                    <span className="text-sm font-bold text-slate-500">
                      第 <span className="text-indigo-600">{pagination.currentPage}</span> 頁 / 共 {pagination.lastPage} 頁
                    </span>

                    <button 
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.lastPage}
                      className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                      下一頁
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

export default SearchPage;