import axiosInstance from './axiosInstance';
export const toggleReviewLike = (reviewId) => {
    return axiosInstance.post(`/reviews/${reviewId}/like`);
};