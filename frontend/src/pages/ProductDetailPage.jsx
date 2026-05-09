import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getProduct, toggleWishlist, getProductReviews } from '../api/productApi';
import { toggleReviewLike, deleteReview, updateReview } from '../api/reviewApi'; 
import { addToCart } from '../api/cartApi'; 
// 🌟 1. 引入獲取使用者資訊的 API (請確保你的 authApi.js 裡有定義這個向 GET /api/user 拿資料的函式)
import { getMe } from '../api/authApi'; 
import ReviewItem from '../components/ReviewItem';
import QuantitySelector from '../components/QuantitySelector';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [qty, setQty] = useState(1);

  // 🌟 2. 新增 state：用來儲存目前登入的使用者資訊
  const [currentUser, setCurrentUser] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewStats, setReviewStats] = useState({ average: 0, total: 0 });
  const [isLiked, setIsLiked] = useState(false); 
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    // 獲取商品資料
    const fetchProduct = async () => {
      try {
        const response = await getProduct(id);
        const data = response.data;
        setProduct(data);

        setIsLiked(data.is_wishlisted || false); 
        setLikeCount(data.wishlists_by_users_count || 0);
        
        if (data.reviews) {
          setReviews(data.reviews);
          setHasMoreReviews(data.reviews.length >= 5);
        }
      } catch (error) {
        console.error("獲取商品失敗", error);
        alert("找不到該商品");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    // 🌟 3. 新增邏輯：獲取目前登入的使用者
    const fetchCurrentUser = async () => {
      try {
        const response = await getMe();
        setCurrentUser(response.data); // 將取得的使用者資料存入 state
      } catch (error) {
        // 如果抓不到 (報 401)，代表是未登入的訪客，我們直接忽略，currentUser 會維持 null
      }
    };

    fetchProduct();
    fetchCurrentUser(); // 🌟 執行獲取使用者身分
  }, [id, navigate]);

  const handleToggleReviewLike = async (reviewId) => {
    const previousReviews = [...reviews];
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        const currentlyLiked = review.is_liked_by_user || false;
        return {
          ...review,
          is_liked_by_user: !currentlyLiked,
          likes_count: currentlyLiked ? (review.likes_count - 1) : (review.likes_count + 1)
        };
      }
      return review;
    }));

    try {
      await toggleReviewLike(reviewId); 
    } catch (error) {
      if (error.response?.status === 401) {
        alert("請先登入後才能點讚評價喔！");
        navigate('/login');
      }
      setReviews(previousReviews);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("確定要刪除這則評價嗎？")) return;

    try {
      await deleteReview(reviewId); 
      
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      setReviewStats(prev => ({ ...prev, total: prev.total - 1 }));
      alert("評價已刪除！");
    } catch (error) {
      if (error.response?.status === 401) {
        alert("請先登入！");
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert("您沒有權限刪除此評價！"); 
      } else {
        alert("刪除失敗，請稍後再試");
      }
    }
  };

  const handleUpdateReview = async (reviewId, newRating, newComment) => {
    try {
      const response = await updateReview(reviewId, { rating: newRating, comment: newComment });
      
      setReviews(prev => prev.map(review => 
        review.id === reviewId ? response.data.data : review
      ));
      alert("評價更新成功！");
      return true; 
    } catch (error) {
      if (error.response?.status === 401) {
        alert("請先登入！");
        navigate('/login');
      } else if (error.response?.status === 403) {
        alert("您沒有權限修改此評價！");
      } else {
        alert(error.response?.data?.message || "更新失敗");
      }
      return false;
    }
  };
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const response = await addToCart(product.id, qty);
      alert(response.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("請先登入後才能將商品加入購物車喔！");
        navigate('/login');
      } else {
        alert(error.response?.data?.message || "加入購物車失敗");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      const response = await toggleWishlist(product.id);
      if (isLiked) {
        setLikeCount(prev => prev - 1);
      } else {
        setLikeCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
      alert(response.data.message);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("請先登入後才能收藏商品喔！");
        navigate('/login');
      } else {
        alert("操作失敗，請稍後再試");
      }
    }
  };

  const handleLoadMoreReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const targetPage = reviews.length === 5 ? 1 : reviewPage;
      const response = await getProductReviews(product.id, targetPage);
      const newReviewsData = response.data.reviews;
      
      if (targetPage === 1) {
        setReviews(newReviewsData.data);
      } else {
        setReviews(prev => [...prev, ...newReviewsData.data]);
      }

      setReviewStats({
        average: response.data.average_rating,
        total: response.data.total_reviews
      });
      
      setReviewPage(targetPage + 1);
      setHasMoreReviews(newReviewsData.current_page < newReviewsData.last_page);
    } catch (error) {
      console.error("載入評價失敗", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee4d2d]"></div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col pb-20">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-0 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="bg-white sm:rounded-md shadow-sm flex flex-col md:flex-row mb-6">
          <div className="w-full md:w-112.5 shrink-0">
            <img 
              src={product.image_url || "https://picsum.photos/id/10/800/800"} 
              alt={product.name} 
              className="w-full aspect-square object-cover"
            />
            <div className="flex items-center justify-between p-4 border-t border-slate-50 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-xl">👁️</span> {product.view_count} 次瀏覽
              </div>
                <button 
                onClick={handleToggleWishlist} 
                className="flex items-center gap-2 group transition-all duration-300"
                >
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill={isLiked ? "#ee4d2d" : "none"} 
                        viewBox="0 0 24 24" 
                        strokeWidth="1.5" 
                        stroke={isLiked ? "#ee4d2d" : "currentColor"} 
                        className={`w-6 h-6 transition-transform duration-200 active:scale-125 ${
                        isLiked ? 'text-[#ee4d2d]' : 'text-slate-500 group-hover:text-[#ee4d2d]'
                        }`}
                    >
                        <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" 
                        />
                    </svg>
                    <span className={`text-sm font-medium transition-colors ${
                        isLiked ? 'text-[#ee4d2d]' : 'text-slate-500'
                    }`}>
                        喜歡 ({likeCount})
                    </span>
                </button>
            </div>
          </div>

          <div className="flex-1 p-5 md:p-8 flex flex-col">
            <h1 className="text-xl md:text-2xl font-medium text-slate-800 leading-snug mb-3">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500 mb-4 divide-x divide-slate-300">
              <div className="flex items-center gap-1 text-[#ee4d2d]">
                <span className="border-b border-[#ee4d2d] font-bold">{product.reviews_avg_rating ? Number(product.reviews_avg_rating).toFixed(1) : "尚未有"}</span> 
                <span>評價</span>
              </div>
            </div>

            <div className="bg-[#fafafa] px-5 py-4 flex items-center mb-6">
              <div className="text-3xl font-medium text-[#ee4d2d]"><span className="text-lg mr-1">$</span>{product.price}</div>
            </div>

            <div className="flex mb-6 text-sm">
              <span className="w-24 text-slate-400 shrink-0">商品描述</span>
              <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{product.description || "賣家未提供商品描述。"}</p>
            </div>

            <QuantitySelector 
              qty={qty} 
              setQty={setQty} 
              stock={product.stock} 
            />

            <div className="flex gap-4 mt-auto pt-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock < 1 || isAdding}
                className="flex-1 max-w-62.5 bg-[#ffeee8] hover:bg-[#ffe3d8] border border-[#ee4d2d] text-[#ee4d2d] disabled:bg-slate-100 disabled:border-slate-300 disabled:text-slate-400 py-3 rounded-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-xl">🛒</span>
                {isAdding ? "處理中..." : (product.stock < 1 ? "已售完" : "加入購物車")}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white sm:rounded-md shadow-sm p-5 md:p-8">
          <h2 className="text-lg font-medium text-slate-800 mb-6 uppercase">商品評價 {reviewStats.total > 0 && <span className="text-sm text-slate-500 font-normal">({reviewStats.total})</span>}</h2>
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <ReviewItem 
                  key={review.id} 
                  review={review} 
                  onToggleLike={handleToggleReviewLike} 
                  onDelete={handleDeleteReview}       
                  onUpdate={handleUpdateReview} 
                  // 🌟 4. 將當前使用者的 ID 傳給子元件！
                  currentUserId={currentUser?.id} 
                />
              ))
            ) : (
              <div className="text-center py-10 text-slate-500 text-sm">目前還沒有評價。</div>
            )}
          </div>
          {hasMoreReviews && (
            <div className="mt-8 flex justify-center">
              <button onClick={handleLoadMoreReviews} disabled={isLoadingReviews} className="px-8 py-2 bg-white border border-slate-300 text-slate-600 text-sm hover:bg-slate-50 transition-colors disabled:opacity-50">
                {isLoadingReviews ? "載入中..." : "載入更多評價 ▼"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProductDetailPage;