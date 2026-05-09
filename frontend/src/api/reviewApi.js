import axiosInstance from './axiosInstance';
export const toggleReviewLike = (reviewId) => {
    return axiosInstance.post(`/reviews/${reviewId}/like`);
};

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