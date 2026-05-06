import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
    if (!product) return null;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(price);
    };

    return (

        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-all duration-200 hover:-translate-y-1 flex flex-col border border-gray-100">
            <Link to={`/products/${product.id}`} className="flex flex-col h-full text-inherit no-underline">
                
                <div className="relative w-full  aspect-square bg-gray-50">
                    <img 
                        src={product.image_url || 'https://via.placeholder.com/300x300?text=No+Image'} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                    />
                    
                    {product.stock <= 0 && (
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 text-sm font-bold rounded-full tracking-wider">
                            已售完
                        </div>
                    )}
                </div>

                <div className="p-4 flex flex-col grow">
                    <h3 className="text-gray-800 text-base font-medium mb-3 leading-snug line-clamp-2 h-[2.8em]">
                        {product.name}
                    </h3>
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[#ee4d2d] font-bold text-lg">
                            {formatPrice(product.price)}
                        </span>
                        {product.reviews_avg_rating && (
                            <span className="text-yellow-500 font-semibold text-sm">
                                ⭐ {parseFloat(product.reviews_avg_rating).toFixed(1)}
                            </span>
                        )}
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100 text-gray-500 text-xs">
                        👁️ {product.view_count} 次瀏覽
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;