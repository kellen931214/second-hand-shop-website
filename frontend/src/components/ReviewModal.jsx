import React, { useState } from 'react';

const ReviewModal = ({ isOpen, onClose, product, onSubmit }) => {
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '', image: null });

  if (!isOpen) return null;

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('rating', reviewData.rating);
    formData.append('comment', reviewData.comment);
    if (reviewData.image) formData.append('image', reviewData.image);
    
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-md p-6 shadow-xl dark:bg-slate-800">
        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">
          評價商品：<span className="text-[#ee4d2d]">{product?.name}</span>
        </h3>

        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">商品評分</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewData({ ...reviewData, rating: star })}
                className={`text-3xl transition-transform active:scale-125 ${
                  star <= reviewData.rating ? 'text-yellow-400' : 'text-slate-200 dark:text-slate-600'
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-slate-400">{reviewData.rating} 分</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">分享你的使用感受</p>
          <textarea
            className="w-full h-32 p-3 border border-slate-200 dark:border-slate-600 rounded-sm focus:outline-none focus:border-[#ee4d2d] text-sm resize-none dark:bg-slate-700 dark:text-white"
            placeholder="商品好用嗎？跟大家分享一下吧！"
            value={reviewData.comment}
            onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">上傳商品照片 (選填)</p>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setReviewData({ ...reviewData, image: e.target.files[0] })}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:bg-[#ffeee8] file:text-[#ee4d2d] hover:file:bg-[#ffe3d8] cursor-pointer"
            />
            {reviewData.image && (
              <p className="text-xs text-green-600 italic">已選擇：{reviewData.image.name}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-sm transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-[#ee4d2d] text-white text-sm font-medium rounded-sm hover:bg-[#d73211] shadow-md transition-colors"
          >
            送出評價
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;