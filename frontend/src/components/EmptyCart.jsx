import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <div className="text-center py-20 bg-white shadow-sm">
      <div className="text-6xl mb-4">🛒</div>
      <p className="text-slate-500 mb-6">購物車還是空的喔！</p>
      <Link to="/" className="px-10 py-3 bg-[#ee4d2d] text-white font-bold rounded-sm hover:bg-[#d73211]">
        去逛逛商品
      </Link>
    </div>
  );
};

export default EmptyCart;