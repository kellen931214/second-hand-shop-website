// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from '../components/Navbar'; 
import ProductCard from '../components/ProductCard';
// 🌟 1. 引入我們剛做好的 Loading 元件
import LoadingSpinner from '../components/LoadingSpinner'; 
import { 
  getProducts, 
  getPopularProducts, 
  getMostViewedProducts, 
  getMostWishedProducts, 
  getCategories 
} from '../api/productApi';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [highlyRated, setHighlyRated] = useState([]);
  const [mostWished, setMostWished] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  
  // 🌟 2. 新增 loading 狀態，一開始預設為 true (因為還沒拿到資料)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      // 確保每次抓資料前都是 loading 狀態
      setLoading(true); 
      try {
        const [productsRes, popularRes, viewedRes, wishedRes, categoriesRes] = await Promise.all([
          getProducts({ params: {} }), 
          getPopularProducts(),        
          getMostViewedProducts(),     
          getMostWishedProducts(),     
          getCategories()              
        ]);

        setNewArrivals(productsRes.data.data || []);
        setHighlyRated(popularRes.data || []);
        setMostWished(wishedRes.data || []);
        setMostViewed(viewedRes.data || []);

        const defaultIcons = ['📚', '💻', '🪥', '👕', '🚲'];
        const defaultColors = [
          'bg-indigo-500/10 text-indigo-600', 
          'bg-slate-500/10 text-slate-600', 
          'bg-blue-500/10 text-blue-600', 
          'bg-slate-500/10 text-slate-500', 
          'bg-cyan-500/10 text-cyan-600'
        ];
        
        const formattedCategories = categoriesRes.data.map((cat, index) => ({
          ...cat,
          icon: defaultIcons[index % defaultIcons.length],
          color: defaultColors[index % defaultColors.length]
        }));
        setCategories(formattedCategories);

      } catch (error) {
        console.error("取得首頁資料失敗:", error);
      } finally {
        // 🌟 3. 不管成功或失敗，最後都要把 loading 關掉
        setLoading(false); 
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col relative overflow-hidden">
      {/* 🌌 背景特效保持不變 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[20%] right-[5%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[40%] bg-indigo-100/40 rounded-full blur-[130px]"></div>
        <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
      </div>

      <div className="relative z-10 flex flex-col">
        <Navbar />

        <div className="w-full h-64 md:h-80 overflow-hidden shadow-md">
            <img 
              src="https://picsum.photos/id/10/1200/400" 
              alt="Banner" 
              className="w-full h-full object-cover" 
            />
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          
          {/* 🌟 4. 判斷邏輯：如果還在 loading，就只顯示我們剛寫好的轉圈圈元件；否則就顯示原本的所有商品區塊 */}
          {loading ? (
            <LoadingSpinner message="準備商品中..." />
          ) : (
            <>
              {/* 分類區塊 */}
              <section className="mb-16 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                <div className="p-5 border-b border-white/40 bg-white/20">
                  <h2 className="text-slate-800 text-xs font-black tracking-[0.2em] uppercase opacity-60">Category Navigator</h2>
                </div>
                <div className="grid grid-rows-2 grid-flow-col overflow-x-auto no-scrollbar justify-start auto-cols-[130px]">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/search?category=${cat.name}`}
                      className="w-full h-35 flex flex-col items-center justify-center border-r border-b border-slate-100/50 hover:bg-white/40 transition-all group"
                    >
                      <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                         <span className="text-3xl">{cat.icon}</span>
                      </div>
                      <span className="text-[13px] text-slate-700 font-bold">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </section>

              {/* 全部商品區塊 */}
              <section className="mb-12 px-2">
                {/* ... (保持不變) ... */}
                <div className="flex items-end justify-between mb-10">
                  <div>
                  <span className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-2 block">New Goods</span>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900">全部商品</h2>
                  </div>
                  <Link 
                    to="/search?sort=newest"
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    VIEW ALL
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
                  {newArrivals.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </section>

              {/* 最高評分區塊 */}
              <section className="mb-20 px-2">
                 {/* ... (保持不變) ... */}
                 <div className="flex items-end justify-between mb-10">
                  <div>
                    <span className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-2 block">Top Rated</span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">嚴選高分好物</h2>
                  </div>
                  <Link 
                    to="/search?sort=rating"
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    VIEW ALL
                  </Link>
                </div>
                <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x">
                  {highlyRated.map((item) => (
                    <div key={item.id} className="min-w-55 md:min-w-70 snap-start shrink-0">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
              </section>

              {/* 最多收藏區塊 */}
              <section className="mb-20 px-2">
                 {/* ... (保持不變) ... */}
                 <div className="flex items-end justify-between mb-10">
                  <div>
                    <span className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-2 block">Top Wished</span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">最多收藏</h2>
                  </div>
                  <Link 
                    to="/search?sort=wishes"
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    VIEW ALL
                  </Link>
                </div>
                <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x">
                  {mostWished.map((item) => (
                    <div key={item.id} className="min-w-55 md:min-w-70 snap-start shrink-0">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
              </section>

              {/* 最多瀏覽區塊 */}
              <section className="mb-20 px-2">
                 {/* ... (保持不變) ... */}
                 <div className="flex items-end justify-between mb-10">
                  <div>
                    <span className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-2 block">Top Viewed</span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">最多瀏覽</h2>
                  </div>
                  <Link 
                    to="/search?sort=views"
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                  >
                    VIEW ALL
                  </Link>
                </div>
                <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x">
                  {mostViewed.map((item) => (
                    <div key={item.id} className="min-w-55 md:min-w-70 snap-start shrink-0">
                      <ProductCard product={item} />
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </main>

        <footer className="mt-auto py-12 bg-slate-900 text-slate-400 text-center">
            <p className="text-xs font-bold tracking-widest mb-2">CAMPUS MARKETPLACE</p>
            <p className="text-[10px] opacity-50">&copy; 2026. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;