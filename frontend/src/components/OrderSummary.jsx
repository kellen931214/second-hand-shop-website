import React from 'react';

// 🌟 元件宣告指令：接收由父元件傳遞進來的三個參數 (Props)
const OrderSummary = ({ total, onCheckout, isSubmitting }) => {
  return (
    <div className="w-full lg:w-80 h-fit sticky top-24">
      <div className="bg-white p-6 rounded-sm shadow-sm border-t-2 border-[#ee4d2d]">
        <h3 className="text-lg font-bold mb-4">訂單摘要</h3>
        
        <div className="flex justify-between text-sm mb-2 text-slate-600">
          <span>商品小計</span>
          <span>${total}</span>
        </div>
        
        <div className="flex justify-between text-sm mb-6 text-slate-600">
          <span>運費</span>
          <span className="text-green-600">免運</span>
        </div>
        
        <div className="border-t pt-4 flex justify-between items-end mb-6">
          <span className="font-bold">總計金額</span>
          <span className="text-2xl font-bold text-[#ee4d2d]">${total}</span>
        </div>
        
        {/* 🌟 觸發下單指令：綁定傳入的函式與狀態 */}
        <button 
          onClick={onCheckout}
          disabled={isSubmitting}
          className="w-full py-3 bg-[#ee4d2d] text-white font-bold hover:bg-[#d73211] transition-colors rounded-sm shadow-md disabled:bg-slate-400"
        >
          {isSubmitting ? "正在下單..." : "下單"}
        </button>
      </div>
    </div>
  );
};

export default OrderSummary;