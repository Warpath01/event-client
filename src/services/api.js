import axios from 'axios';

const api = axios.create({
    baseURL: 'https://eventregapp-server.onrender.com/api'
});

// add token to requests if exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = token;
    return config;
});

export default api;
