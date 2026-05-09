// src/components/QuantitySelector.jsx
import React from 'react';

// 指令：解構賦值 (Destructuring Assignment)
// 用途：接收父層傳遞進來的 3 個核心參數
const QuantitySelector = ({ qty, setQty, stock }) => {
  return (
    <div className="flex items-center mb-8 text-sm">
      <span className="w-24 text-slate-400 shrink-0">數量</span>
      <div className="flex items-center border border-slate-200 rounded-sm">
        <button 
          // 參數說明：當點擊時，將目前數量減 1。Math.max 確保數量最低不會小於 1
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 border-r border-slate-200"
        >-</button>
        
        <input 
          type="text" 
          // 參數說明：綁定目前的數量狀態
          value={qty} 
          readOnly 
          className="w-12 text-center text-sm focus:outline-none bg-white"
        />
        
        <button 
          // 參數說明：當點擊時，將目前數量加 1。Math.min 確保數量最高不會超過商品庫存 (stock)
          onClick={() => setQty(Math.min(stock, qty + 1))}
          className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 border-l border-slate-200"
        >+</button>
      </div>
      {/* 參數說明：動態顯示剩餘庫存 */}
      <span className="ml-4 text-slate-500">還剩 {stock} 件</span>
    </div>
  );
};

export default QuantitySelector;