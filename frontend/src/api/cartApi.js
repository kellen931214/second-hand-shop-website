import axiosInstance from './axiosInstance';

export const addToCart = (productId, quantity = 1) => {
    return axiosInstance.post('/carts', { 
        product_id: productId, 
        quantity: quantity 
    });
};

export const getCartItems = (page = 1) => axiosInstance.get(`/carts?page=${page}`);


export const updateCartItem = (productId, quantity) => {
    return axiosInstance.patch(`/carts/${productId}`, { quantity });
};

export const deleteCartItem = (productId) => {
    return axiosInstance.delete(`/carts/${productId}`);
};