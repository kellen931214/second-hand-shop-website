import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getOrderDetail } from '../api/orderApi';
import { createReview } from '../api/productApi'; // 之前寫好的評價 API

const OrderDetailPage = () => {
  // --- 1. 宣告與狀態管理 ---
  const { id } = useParams(); // 指令用途：從網址 /orders/:id 中提取出的 id 參數。
  const navigate = useNavigate();

  const [order, setOrder] = useState(null); // 儲存訂單詳情
  const [loading, setLoading] = useState(true);
  
  // 評價彈窗狀態
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '', image: null });

  // --- 2. 抓取資料邏輯 ---
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await getOrderDetail(id);
        setOrder(response.data); // 參數說明：這裡的 response.data 包含你後端處理好的 is_reviewed 欄位。
      } catch (error) {
        alert("找不到此訂單");
        navigate('/orders');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  // --- 3. 評價功能處理 ---
  const handleOpenReview = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleSubmitReview = async () => {
    const formData = new FormData();
    formData.append('rating', reviewData.rating);
    formData.append('comment', reviewData.comment);
    if (reviewData.image) formData.append('image', reviewData.image);

    try {
      await createReview(selectedProduct.id, formData);
      alert("感謝您的評價！");
      setShowModal(false);
      // 評價成功後，重新抓取訂單資料，按鈕就會因為 is_reviewed 變成 true 而消失或變色
      const updated = await getOrderDetail(id);
      setOrder(updated.data);
    } catch (error) {
      alert("評價失敗");
    }
  };

  if (loading) return <div className="min-h-screen bg-[#f5f5f5]"><Navbar /><div className="text-center py-20">載入中...</div></div>;
  if (!order) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col pb-20">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {/* 訂單頭部資訊 */}
        <div className="bg-white p-6 rounded-sm shadow-sm mb-4 flex justify-between items-center">
          <div>
            <div className="text-sm text-slate-500 mb-1">訂單編號：#{order.id}</div>
            <div className="text-xl font-bold text-slate-800">感謝您的購買！</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500 uppercase">訂單狀態</div>
            <div className="text-[#ee4d2d] font-bold">{order.status === 'pending' ? '已完成' : order.status}</div>
          </div>
        </div>

        {/* 商品明細清單 */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden mb-4">
          <div className="p-4 border-b font-medium text-slate-700">商品明細</div>
          <div className="divide-y divide-slate-50">
            {order.order_items.map((item) => (
              <div key={item.id} className="p-4 flex gap-4 items-center">
                <img src={item.product.image_url} alt="" className="w-16 h-16 object-cover border" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">{item.product.name}</div>
                  <div className="text-xs text-slate-400 mt-1">數量：x{item.quantity}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-800">${item.price * item.quantity}</div>
                  
                  {/* 🌟 核心邏輯：根據後端給的 is_reviewed 判斷按鈕 */}
                  {item.is_reviewed ? (
                    <span className="text-xs text-slate-400 block mt-2 italic">已完成評價</span>
                  ) : (
                    <button 
                      onClick={() => handleOpenReview(item.product)}
                      className="mt-2 text-xs border border-[#ee4d2d] text-[#ee4d2d] px-3 py-1 rounded-sm hover:bg-[#ffeee8] transition-colors"
                    >
                      去評價
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 費用結算 */}
        <div className="bg-white p-6 rounded-sm shadow-sm text-right">
          <div className="space-y-2">
            <div className="text-sm text-slate-500">商品總計：${order.total_price}</div>
            <div className="text-sm text-slate-500">運費：$0</div>
            <div className="pt-4 border-t mt-4">
              <span className="text-slate-800 mr-4 font-bold">實付金額：</span>
              <span className="text-2xl font-bold text-[#ee4d2d]">${order.total_price}</span>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white w-full max-w-lg rounded-md p-6 shadow-xl">
            {/* 標題 */}
            <h3 className="font-bold text-lg mb-4 text-slate-800">
              評價商品：<span className="text-[#ee4d2d]">{selectedProduct?.name}</span>
            </h3>

            {/* 1. 五星評分區 */}
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-2">商品評分</p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className={`text-3xl transition-transform active:scale-125 ${
                      star <= reviewData.rating ? 'text-yellow-400' : 'text-slate-200'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-slate-400">
                  {reviewData.rating} 分
                </span>
              </div>
            </div>

            {/* 2. 文字評論區 */}
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-2">分享你的使用感受</p>
              <textarea
                className="w-full h-32 p-3 border border-slate-200 rounded-sm focus:outline-none focus:border-[#ee4d2d] text-sm resize-none"
                placeholder="商品好用嗎？跟大家分享一下吧！"
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              />
            </div>

            {/* 3. 圖片上傳區 */}
            <div className="mb-6">
              <p className="text-sm text-slate-500 mb-2">上傳商品照片 (選填)</p>
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

            {/* 按鈕操作區 */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-slate-500 hover:bg-slate-50 rounded-sm transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmitReview}
                className="px-6 py-2 bg-[#ee4d2d] text-white text-sm font-medium rounded-sm hover:bg-[#d73211] shadow-md transition-colors"
              >
                送出評價
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;