import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Navbar from '../components/Navbar'; 
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner'; 
import ProductSection from '../components/ProductSection';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
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

        const defaultIcons = ['📚', '💻', '🛋️', '👕', '⛹️', '🍽️'];
        const defaultColors = [
          'bg-indigo-500/10 text-indigo-600', 
          'bg-slate-500/10 text-slate-600', 
          'bg-blue-500/10 text-blue-600', 
          'bg-slate-500/10 text-slate-500', 
          'bg-cyan-500/10 text-cyan-600',
          'bg-orange-500/10 text-orange-600'
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
        setLoading(false); 
      }
    };

    fetchHomeData();
  }, []);

return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-900 flex flex-col relative overflow-hidden">
 

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
          
          {loading ? (
            <LoadingSpinner message="準備商品中..." />
          ) : (
            <>
              <section className="mb-16 bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/60 dark:border-slate-700/60 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                
                <div className="p-5 border-b border-white/40 dark:border-slate-700/40 bg-white/20 dark:bg-slate-700/20">
                  <h2 className="text-slate-800 dark:text-gray-300 text-xs font-black tracking-[0.2em] uppercase opacity-60">Category Navigator</h2>
                </div>
                
                <div className="grid grid-rows-2 grid-flow-col overflow-x-auto no-scrollbar justify-start auto-cols-[130px]">
                  {categories.map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/search?category=${cat.name}`}
                      className="w-full h-35 flex flex-col items-center justify-center border-r border-b border-slate-100/50 dark:border-slate-700/50 hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all group py-4"
                    >
                      <div className={`w-16 h-16 ${cat.color} rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        <span className="text-3xl">{cat.icon}</span>
                      </div>
                      <span className="text-[13px] text-slate-700 dark:text-gray-300 font-bold">{cat.name}</span>
                    </Link>
                  ))}
                </div>

              </section>

              <ProductSection 
                subtitle="New Goods" 
                title="全部商品" 
                sortType="newest" 
                products={newArrivals} 
                isGrid={true} 
              />

              <ProductSection 
                subtitle="Top Rated" 
                title="最高評分" 
                sortType="rating" 
                products={highlyRated} 
              />

              <ProductSection 
                subtitle="Top Wished" 
                title="最多收藏" 
                sortType="wishes" 
                products={mostWished} 
              />

              <ProductSection 
                subtitle="Top Viewed" 
                title="最多瀏覽" 
                sortType="views" 
                products={mostViewed} 
              />
            </>
          )}
        </main>

        <footer className="mt-auto py-12 bg-slate-900 text-slate-400 text-center relative z-10">
            <p className="text-xs font-bold tracking-widest mb-2">CAMPUS MARKETPLACE</p>
            <p className="text-[10px] opacity-50">&copy; 2026. ALL RIGHTS RESERVED.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;