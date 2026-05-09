// src/components/OrderItem.jsx
import React from 'react';

// 指令：解構賦值 (Destructuring Assignment)
// 用途：接收父層 (OrdersPage) 傳遞進來的 order 資料與 onClick 點擊事件
const OrderItem = ({ order, onClick }) => {
  // 邏輯整理：把原本寫在 JSX 裡的判斷式提早處理，讓畫面程式碼更乾淨
  const items = order.products || order.order_items || [];
  const previewItems = items.slice(0, 2);
  const remainingCount = items.length - 2;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-sm shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* 訂單標頭 */}
      <div className="px-4 py-3 border-b border-slate-50 flex justify-between bg-[#fafafa]">
        <span className="text-sm font-bold text-slate-600">訂單編號：#{order.id}</span>
        <span className="text-sm text-[#ee4d2d] font-medium">查看詳情 ❯</span>
      </div>

      {/* 商品預覽區 */}
      <div className="divide-y divide-slate-50">
        {previewItems.map(item => {
          const product = item.product || item; // 處理不同的資料格式
          return (
            <div key={item.id} className="p-4 flex gap-4 items-center">
              <img src={product.image_url} alt="" className="w-16 h-16 object-cover border" />
              <div className="flex-1 text-sm font-medium text-slate-800 line-clamp-1">
                {product.name}
              </div>
              <div className="text-xs text-slate-400">
                {item.quantity ? `x${item.quantity}` : '1件'}
              </div>
            </div>
          );
        })}
        
        {/* 如果商品超過兩個，顯示更多提示 */}
        {remainingCount > 0 && (
          <div className="px-4 py-2 text-center text-xs text-slate-400 bg-slate-50">
            還有其他 {remainingCount} 件商品...
          </div>
        )}
      </div>

      {/* 訂單底部：顯示總金額 */}
      <div className="px-4 py-3 border-t border-slate-50 text-right">
        <span className="text-sm text-slate-600 mr-2">訂單總金額:</span>
        <span className="text-lg font-bold text-[#ee4d2d]">${order.total_price}</span>
      </div>
    </div>
  );
};

export default OrderItem;