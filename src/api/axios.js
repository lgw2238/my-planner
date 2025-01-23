import axios from 'axios';
import useStore from '../store/useStore';

const baseURL = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// request interceptor (set up token)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // authentication error handling
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 