import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // 建議加上 /api
    withCredentials: true, 
    withXSRFToken: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
    }
});



export default axiosInstance;