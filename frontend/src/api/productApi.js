import axiosInstance from "./axiosInstance";

export const getProducts = ({params}) =>{
    return axiosInstance.get('products/', {params});
}

export const getProduct = (id) => {
    return axiosInstance.get(`products/${id}/`);
}

export const createProduct = ({data}) => {
    return axiosInstance.post('products/', data);
}

export const updateProduct = ({data, id}) => {
    return axiosInstance.put(`products/${id}/`, data);
}

export const getPopularProducts = () => {
    return axiosInstance.get('products/popular/');
}

export const getMostViewedProducts = () => {
    return axiosInstance.get('products/most-viewed/');
}

export const getMostWishedProducts = () => {
    return axiosInstance.get('products/most-wished/');
}


export const deleteProduct = (id) => {
    return axiosInstance.delete(`products/${id}/`);
}

export const getCategories = () => {
    return axiosInstance.get('categories/');
}


export const getWishlists = (page = 1) => axiosInstance.get(`/wishlists?page=${page}`);
export const toggleWishlist = (productId) => axiosInstance.post(`/wishlists/toggle`, { product_id: productId });

export const getHistory = (page = 1) => axiosInstance.get(`/history?page=${page}`);
export const removeHistoryItem = (productId) => axiosInstance.delete(`/history/${productId}`);
export const clearAllHistory = () => axiosInstance.delete(`/history/clear`);

export const getProductReviews = (productId, page = 1) => {
    return axiosInstance.get(`products/${productId}/reviews?page=${page}`);
}

export const createReview = (productId, formData) => {
    return axiosInstance.post(`/products/${productId}/reviews`, formData, {
        headers: { 
            'Content-Type': 'multipart/form-data' 
        }
    });
};