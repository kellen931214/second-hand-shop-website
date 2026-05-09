// --- 評價相關 API ---

// 1. 取得評價 (你剛剛已經加了)
export const getProductReviews = (productId, page = 1) => {
    return axiosInstance.get(`products/${productId}/reviews?page=${page}`);
}

// 🌟 2. 新增評價 (對應 ReviewController@store)
// 注意：因為你的後端有支援上傳圖片 ('image' => 'nullable|image')，
// 所以前端傳送資料時必須使用 FormData，並且設定 Content-Type！
export const createReview = (productId, formData) => {
    return axiosInstance.post(`products/${productId}/reviews`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

// 🌟 3. 修改評價 (對應 ReviewController@update)
export const updateReview = (reviewId, data) => {
    return axiosInstance.put(`reviews/${reviewId}`, data);
}

// 🌟 4. 刪除評價 (對應 ReviewController@destroy)
export const deleteReview = (reviewId) => {
    return axiosInstance.delete(`reviews/${reviewId}`);
}