import React from 'react';


const QuantitySelector = ({ qty, setQty, stock }) => {
  return (
    <div className="flex items-center mb-8 text-sm">
      <span className="w-24 text-slate-400 shrink-0">數量</span>
      <div className="flex items-center border border-slate-200 rounded-sm">
        <button 
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 border-r border-slate-200"
        >-</button>
        
        <input 
          type="text" 
          value={qty} 
          readOnly 
          className="w-12 text-center text-sm focus:outline-none bg-white"
        />
        
        <button 
          onClick={() => setQty(Math.min(stock, qty + 1))}
          className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-600 border-l border-slate-200"
        >+</button>
      </div>
      <span className="ml-4 text-slate-500">還剩 {stock} 件</span>
    </div>
  );
};

export default QuantitySelector;