import axiosInstance from './axiosInstance';

export const getOrders = () => axiosInstance.get('/orders');

export const createReview = (productId, formData) => {

    return axiosInstance.post(`/products/${productId}/reviews`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const createOrder = (data = {}) => {
    return axiosInstance.post('/orders', data);
};

export const getOrderDetail = (orderId) => {
    return axiosInstance.get(`/orders/${orderId}`);
};