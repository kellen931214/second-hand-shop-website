import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance'; 
import { getMe } from '../api/authApi';
import { useTheme } from '../context/ThemeContext';

import SearchBar from './SearchBar';
import UserDrawer from './UserDrawer';

const Navbar = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const [user, setUser] = useState(null); 
  const [isLoadingUser, setIsLoadingUser] = useState(true); 
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
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            <div className="shrink-0">
              <Link to="/" className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight hover:opacity-80 transition-opacity">
                校園<span className="text-indigo-600 dark:text-indigo-400">二手</span>商鋪
              </Link>
            </div>

            <SearchBar />

            <div className="flex items-center gap-4 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {isDark ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-500">
                      <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-indigo-600">
                      <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
                    </svg>
                  )}
              </button>

              {isLoadingUser ? (
                <div className="h-8 w-8 animate-pulse bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              ) : user ? (
                <div className="flex items-center gap-4">
                  <Link to="/cart" className="hidden md:flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    購物車
                  </Link>

                  {user.role === 'admin' && (
                    <>
                      <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700"></div>
                      <Link to="/admin/products" className="hidden md:flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                        商品管理
                      </Link>
                      <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700"></div>
                      <Link to="/create-product" className="hidden md:flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                        發布商品
                      </Link>
                    </>
                  )}
                  
                  <div className="hidden md:block h-5 w-px bg-slate-200 dark:bg-slate-700"></div>
                  
                  <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 group ml-2 focus:outline-none">
                    <span className="text-sm font-bold text-slate-700 dark:text-gray-200 hidden lg:block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {user.name}
                    </span>
                    <img className="h-9 w-9 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 group-hover:border-indigo-400 shadow-sm transition-colors" src={user.avatar_url || "https://via.placeholder.com/150?text=User"} alt="Profile" />
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

      <UserDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        user={user} 
        onLogout={handleLogout} 
      />
    </>
  );
};

export default Navbar;