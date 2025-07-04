import axios from 'axios';

const api = axios.create({
    baseURL: 'https://myevent-server.vercel.app/api'
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;
