import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          
          {/* 1. 左側：Logo */}
          <div className="shrink-0">
            <Link to="/" className="text-xl md:text-2xl font-bold text-red-600 tracking-tight hover:opacity-80 transition-opacity">
              校園二手商鋪
            </Link>
          </div>

          {/* 2. 中間：搜尋框（會根據螢幕寬度縮放） */}
            <form 
            onSubmit={(e) => e.preventDefault()} 
            className="flex-1 flex flex-col items-center max-w-md px-2"
            >
                {/* 1. 搜尋框本體 */}
                <div className="relative group w-full">
                    <input
                    type="text"
                    placeholder="搜尋商品..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full 
                                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent 
                                transition-all bg-gray-50 focus:bg-white text-sm"
                    />
                    <button 
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 
                                bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 
                                transition-colors shadow-sm active:scale-95"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    </button>
                </div>

                {/* 2. 下方的熱門搜尋小字 */}
                <div className="w-full flex gap-3 mt-1.5 px-3">
                    <div className="flex gap-2 overflow-hidden whitespace-nowrap">
                    <Link to="/most-viewed" className="text-[10px] text-gray-500 hover:text-red-500">最多瀏覽</Link>
                    <Link to="/most-rated" className="text-[10px] text-gray-500 hover:text-red-500">最高評分</Link>
                    <Link to="/most-wished" className="text-[10px] text-gray-500 hover:text-red-500">最多願望</Link>
                    </div>
                </div>
            </form>

          {/* 3. 右側：導航連結 + 頭像 */}
          <div className="flex items-center gap-4 shrink-0">
            
            {/* 找回來的連結：在手機版會隱藏，平板以上顯示 */}
            <div className="hidden md:flex items-center gap-4">
              <Link to="/register" className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                註冊
              </Link>
                <Link to="/login" className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                登錄
              </Link>
              <Link to="/about" className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                關於我們
              </Link>
            </div>

            {/* 分割線 */}
            <div className="hidden md:block h-6 w-px bg-gray-200"></div>

            {/* 個人資料 */}
            <Link 
              to="/profile" 
              className="group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-full transition-all"
            >
              <img
                className="h-8 w-8 md:h-9 md:w-9 rounded-full object-cover border border-gray-200 group-hover:border-red-300"
                src="https://via.placeholder.com/150?text=User" 
                alt="Profile"
              />
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;