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