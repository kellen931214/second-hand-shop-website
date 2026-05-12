import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard'; 

const ProductSection = ({ 
  subtitle,
  title,          
  sortType,       
  products,       
  isGrid = false  
}) => {
  
  if (!products || products.length === 0) return null;

  return (
    <section className="mb-20 px-2">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-indigo-600 font-black text-sm uppercase tracking-widest mb-2 block">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight dark:text-white">
            {title}
          </h2>
        </div>
        <Link 
          to={`/search?sort=${sortType}`}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-full text-xs font-black hover:bg-indigo-600 transition-all shadow-lg active:scale-95 dark:bg-slate-700 dark:hover:bg-indigo-500"
        >
          VIEW ALL
        </Link>
      </div>

      {isGrid ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      ) : (
        <div className="flex overflow-x-auto gap-8 pb-10 no-scrollbar snap-x">
          {products.map((item) => (
            <div key={item.id} className="min-w-55 md:min-w-70 snap-start shrink-0">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductSection;