import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 
import { getMe } from '../api/authApi';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [user, setUser] = useState(null); 
  const [isLoadingUser, setIsLoadingUser] = useState(true); 
  
  // 控制側邊抽屜開關的狀態
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe(); 
        setUser(response.data); 
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoadingUser(false); 
      }
    };
    fetchUser();
  }, []); 

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout'); 
      setUser(null);
      setIsDrawerOpen(false); 
      navigate('/');
    } catch (error) {
      console.error("登出失敗", error);
    }
  };

  return (
    <>
      {/* 頂部導覽列 */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            <div className="shrink-0">
              <Link to="/" className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight hover:opacity-80 transition-opacity">
                校園<span className="text-indigo-600 dark:text-indigo-400">二手</span>商鋪
              </Link>
            </div>

            <form onSubmit={handleSearch} className="flex-1 flex flex-col items-center max-w-md px-2">
              <div className="relative group w-full">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="搜尋商品..."
                  className="w-full px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 text-sm text-slate-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-1.5 transition-colors shadow-sm active:scale-95">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 shrink-0">
              {/* 夜間模式切換按鈕 */}
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-label="切換夜間模式"
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v1m0 16v1m9-9h-1m-16 0H1m15.657 5.657l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 1 1 .12-11.48 1 1 0 0 0 1.07-.22 1 1 0 0 0-.12-1.53A10 10 0 0 0 12 2c-5.47 0-10 4.48-10 10s4.53 10 10 10a9.88 9.88 0 0 0 5.64-1.75 1 1 0 0 0 .3-1.24z" />
                  </svg>
                )}
              </button>

              {isLoadingUser ? (
                <div className="h-8 w-8 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  
                  <Link to="/cart" className="hidden md:flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    購物車
                  </Link>

                  {user.role === 'admin' && (
                    <>
                      <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700"></div>
                      
                      {/* 🌟 1. 管理員的商品列表入口 */}
                      <Link to="/admin/products" className="hidden md:flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        商品管理
                      </Link>

                      <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700"></div>

                      {/* 🌟 2. 發布商品入口 (維持不變，指向新增模式) */}
                      <Link to="/create-product" className="hidden md:flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        發布商品
                      </Link>
                    </>
                  )}
                  
                  <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700"></div>
                  
                  {/* 點擊大頭貼打開抽屜 */}
                  <button 
                    onClick={() => setIsDrawerOpen(true)} 
                    className="flex items-center gap-2 group ml-2 focus:outline-none"
                  >
                    <span className="text-sm font-bold text-slate-700 dark:text-gray-200 hidden lg:block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user.name}
                    </span>
                    <img
                      className="h-9 w-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-400 dark:group-hover:border-indigo-400 shadow-sm transition-colors"
                      src={user.avatar_url || "https://via.placeholder.com/150?text=User"} 
                      alt="Profile"
                    />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/about" className="hidden md:block text-sm text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">關於我們</Link>
                  <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <Link to="/register" className="text-sm text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold">註冊</Link>
                  <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700"></div>
                  <Link to="/login" className="text-sm text-slate-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold">登錄</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🌟 修正：使用 z-[60] 確保覆蓋 */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-60 transition-opacity"
          onClick={() => setIsDrawerOpen(false)} 
        />
      )}

      {/* 🌟 修正：使用 z-[70] 確保抽屜在最上層 */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-800 shadow-2xl z-70 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        
        {/* 關閉按鈕 */}
        <div className="flex justify-end p-4">
          <button onClick={() => setIsDrawerOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {user && (
          <div className="flex-1 flex flex-col">
            <div className="px-6 pb-6 border-b border-gray-100 dark:border-gray-700 flex flex-col items-center">
              <div className="relative mb-4">
                <img 
                  className="h-24 w-24 rounded-full object-cover border-4 border-indigo-50 dark:border-slate-700 shadow-md" 
                  src={user.avatar_url || "https://via.placeholder.com/150?text=User"} 
                  alt="Profile" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{user.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>

            <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              <Link to="/wishlist" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                收藏清單
              </Link>

              <Link to="/orders" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                訂單清單
              </Link>

              <Link to="/history" onClick={() => setIsDrawerOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                歷史紀錄
              </Link>
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 text-red-500 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-950 rounded-xl transition-all active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                安全登出
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;