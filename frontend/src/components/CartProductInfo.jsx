// src/components/CartProductInfo.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// 指令：解構賦值 (Destructuring Assignment)
// 用途：接收父層傳遞進來的單個商品物件 (item)
const CartProductInfo = ({ item }) => {
  return (
    // 使用 React.Fragment (<>...</>) 或 div 包裹，這裡維持原本的 flex 結構
    <div className="flex items-center gap-4 flex-1 min-w-0">
      {/* 商品圖片 */}
      <img 
        src={item.image_url} 
        alt={item.name} 
        className="w-20 h-20 object-cover border shrink-0" 
      />
      
      {/* 商品名稱與價格 */}
      <div className="flex-1 min-w-0">
        <Link 
          to={`/products/${item.id}`} 
          className="text-sm font-medium text-slate-800 line-clamp-2 hover:text-[#ee4d2d] transition-colors"
        >
          {item.name}
        </Link>
        <div className="text-[#ee4d2d] mt-1 font-medium">
          ${item.price}
        </div>
      </div>
    </div>
  );
};

export default CartProductInfo;