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

export const updateReview = (reviewId, data) => {
    return axiosInstance.put(`reviews/${reviewId}`, data);
}

export const deleteReview = (reviewId) => {
    return axiosInstance.delete(`reviews/${reviewId}`);
}