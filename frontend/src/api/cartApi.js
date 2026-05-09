import axiosInstance from './axiosInstance';

export const addToCart = (productId, quantity = 1) => {
    return axiosInstance.post('/carts', { 
        product_id: productId, 
        quantity: quantity 
    });
};

export const getCartItems = (page = 1) => axiosInstance.get(`/carts?page=${page}`);

// 2. 更新購物車數量 (對應 CartController@update)
// 注意：你的路由是 /carts/{id}，參數是 quantity
export const updateCartItem = (productId, quantity) => {
    return axiosInstance.patch(`/carts/${productId}`, { quantity });
};

// 3. 刪除購物車商品 (對應 CartController@destroy)
export const deleteCartItem = (productId) => {
    return axiosInstance.delete(`/carts/${productId}`);
};