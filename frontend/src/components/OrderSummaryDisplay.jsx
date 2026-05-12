import React from 'react';

const OrderSummaryDisplay = ({ totalPrice, shippingFee = 0 }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-sm shadow-sm text-right">
      <div className="space-y-2">
        <div className="text-sm text-slate-500 dark:text-slate-400">商品總計：${totalPrice}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">運費：${shippingFee}</div>
        <div className="pt-4 border-t dark:border-slate-700 mt-4">
          <span className="text-slate-800 dark:text-white mr-4 font-bold">實付金額：</span>
          <span className="text-2xl font-bold text-[#ee4d2d]">${totalPrice + shippingFee}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryDisplay;