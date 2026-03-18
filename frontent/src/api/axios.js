import axios from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Toast debouncing - prevent multiple toasts
let toastId = null;
const showToast = (message, type = 'error') => {
  if (toastId) {
    toast.dismiss(toastId);
  }
  toastId = type === 'error' ? toast.error(message) : toast.success(message);
};

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      if (!window.location.pathname.includes('/signin')) {
        showToast('Session expired. Please sign in again.');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 1500);
      }
    }

    // Handle validation errors
    if (error.response?.status === 422) {
      showToast(error.response.data?.message || 'Validation failed');
    }

    // Handle server errors
    if (error.response?.status >= 500) {
      showToast('Server error. Please try again later.');
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      showToast('Network error. Cannot connect to server.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;