// src/components/ReviewItem.jsx
import React from 'react';

// 指令：解構賦值 (Destructuring Assignment)
// 用途：接收父層 (ProductDetailPage) 傳遞進來的參數
const ReviewItem = ({ review, onToggleLike }) => {
  return (
    <div className="flex gap-3 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
      <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
        <img 
          src={`https://ui-avatars.com/api/?name=${review.user?.name || "User"}&background=random`} 
          alt="avatar" 
        />
      </div>
      <div className="flex-1">
        <div className="text-xs text-slate-800 mb-1">{review.user?.name || "匿名買家"}</div>
        <div className="text-xs text-[#ee4d2d] mb-2 tracking-widest">
          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
        </div>
        <p className="text-sm text-slate-700 mb-2 whitespace-pre-wrap">
          {review.comment || "買家未留下文字評論"}
        </p>
        
        {/* 時間與點讚按鈕 */}
        <div className="flex justify-between items-center mt-3">
          <div className="text-xs text-slate-400">
            {new Date(review.created_at).toLocaleString()}
          </div>

          <button 
            // 🌟 觸發父層傳遞進來的函式，並帶入當前評價的 ID
            onClick={() => onToggleLike(review.id)}
            className={`flex items-center gap-1.5 transition-colors text-xs ${
              review.is_liked_by_user ? 'text-[#ee4d2d]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill={review.is_liked_by_user ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              strokeWidth="1.5" 
              stroke="currentColor" 
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span>這則評價很有幫助 ({review.likes_count || 0})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;