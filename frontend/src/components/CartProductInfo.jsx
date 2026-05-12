import React from 'react';
import { Link } from 'react-router-dom';

const CartProductInfo = ({ item }) => {
  return (
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <img 
        src={item.image_url} 
        alt={item.name} 
        className="w-20 h-20 object-cover border shrink-0" 
      />
      
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