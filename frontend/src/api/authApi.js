import axiosInstance from "./axiosInstance";

export const csrf = () => axiosInstance.get('/sanctum/csrf-cookie');

export const register = (data) => axiosInstance.post('/register', data);

export const login = (data) => axiosInstance.post('/login', data);

export const logout = () => axiosInstance.post('/logout');

export const getMe = () => axiosInstance.get('/user');