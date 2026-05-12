import React, { useState } from 'react';

const ReviewItem = ({ review, onToggleLike, onDelete, onUpdate, currentUserId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment || "");

  const handleSave = async () => {
    const success = await onUpdate(review.id, editRating, editComment);
    if (success) {
      setIsEditing(false);
    }
  };

  const isMyReview = currentUserId === review.user?.id;

  return (
    <div className="flex gap-3 border-b border-slate-100 pb-6 last:border-0 last:pb-0">
      <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0 overflow-hidden">
        <img 
          src={`https://ui-avatars.com/api/?name=${review.user?.name || "User"}&background=random`} 
          alt="avatar" 
        />
      </div>
      <div className="flex-1">
        
        <div className="flex justify-between items-start mb-1">
          <div className="text-xs text-slate-800 font-medium">{review.user?.name || "匿名買家"}</div>
          
          {isMyReview && (
            <div className="flex gap-3 text-xs">
              <button 
                onClick={() => setIsEditing(!isEditing)} 
                className="text-slate-400 hover:text-indigo-500 transition-colors"
              >
                {isEditing ? "取消編輯" : "編輯"}
              </button>
              <button 
                onClick={() => onDelete(review.id)} 
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                刪除
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="mt-2 bg-slate-50 p-3 rounded-md border border-slate-200 mb-3">
            <div className="mb-3 flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium">評分：</label>
              <select 
                value={editRating} 
                onChange={(e) => setEditRating(Number(e.target.value))}
                className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:border-[#ee4d2d]"
              >
                {[5, 4, 3, 2, 1].map(num => (
                  <option key={num} value={num}>{num} 星</option>
                ))}
              </select>
            </div>
            
            <textarea 
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded p-2 bg-white focus:outline-none focus:border-[#ee4d2d] min-h-20"
              placeholder="修改您的評價..."
            />
            
            <div className="flex justify-end mt-2">
              <button 
                onClick={handleSave}
                className="text-xs bg-[#ee4d2d] hover:bg-[#d73211] text-white px-4 py-1.5 rounded-sm transition-colors"
              >
                儲存修改
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-xs text-[#ee4d2d] mb-2 tracking-widest">
              {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
            </div>
            <p className="text-sm text-slate-700 mb-2 whitespace-pre-wrap">
              {review.comment || "買家未留下文字評論"}
            </p>
          </>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <div className="text-xs text-slate-400">
            {new Date(review.created_at).toLocaleString()}
          </div>
          <button 
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