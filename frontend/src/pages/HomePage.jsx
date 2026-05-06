import React from 'react';
import Navbar from '../components/Navbar'; // 引入導覽列組件
import ProductCard from '../components/ProductCard';

const HomePage = () => {
  // 模擬從後端資料庫撈出來的商品資料
  const mockProducts = [
    { id: 1, name: "極新二手 Macbook Pro", price: 35000, image_url: "https://picsum.photos/id/1/300/300", stock: 1, view_count: 120, reviews_avg_rating: "4.8" },
    { id: 2, name: "復古底片相機", price: 2500, image_url: "https://picsum.photos/id/2/300/300", stock: 1, view_count: 45, reviews_avg_rating: "5.0" },
    { id: 3, name: "二手教科書 (幾何學)", price: 300, image_url: "https://picsum.photos/id/3/300/300", stock: 5, view_count: 12, reviews_avg_rating: null },
    { id: 4, name: "已售出的機械鍵盤", price: 1500, image_url: "https://picsum.photos/id/4/300/300", stock: 0, view_count: 99, reviews_avg_rating: "4.2" },
    { id: 5, name: "九成新藍芽耳機", price: 800, image_url: "https://picsum.photos/id/5/300/300", stock: 2, view_count: 23, reviews_avg_rating: "4.5" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      <Navbar />
        <div className="">
            <img src="https://picsum.photos/id/10/1200/400" alt="Banner" className="w-full h-64 object-cover mb-8" />
        </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">

        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">最新上架商品</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          
        </div>

      </main>

      <footer className="mt-auto py-6 bg-white border-t border-gray-100 text-center text-gray-400 text-sm">
        &copy; 2026 校園二手交換平台. All rights reserved.
      </footer>

    </div>
  );
};

export default HomePage;