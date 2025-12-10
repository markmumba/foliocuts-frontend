import axios, { AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||'http://localhost:8081/api/v1';

// const clearAuthStorage = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//     localStorage.removeItem('refreshToken');
// }

export const apiClient:AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json', 
    },
})

// type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };


apiClient.interceptors.request.use(
    (config:InternalAxiosRequestConfig)=> {
        const token = localStorage.getItem('accessToken');
        if(token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error:AxiosError)=> {
        return Promise.reject(error);
    } 
);

apiClient.interceptors.response.use(
    (response:AxiosResponse)=> {
        return response
    }

    // async (error:AxiosError) => {
    //     const status = error.response?.status;
    //     const originalRequest = error.config as RetryableRequestConfig |undefined;
        
    //     if (status === 401 && originalRequest && !originalRequest._retry) {
    //         originalRequest._retry = true;
    //         try {

    //         }

    //     }
    // }

);