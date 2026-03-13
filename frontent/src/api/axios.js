import axios from 'axios';
import toast from 'react-hot-toast';
import { setupMockInterceptor } from './mockInterceptor';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
  if (type === 'error') {
    toastId = toast.error(message);
  } else {
    toastId = toast.success(message);
  }
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
  (error) => {
    return Promise.reject(error);
  }
);

// Setup mock interceptor for development (MUST come first)
if (import.meta.env.DEV) {
  setupMockInterceptor(axiosInstance);
}

// Response interceptor for handling both real and mock responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Check if this is a mock response (from our interceptor)
    if (error && error.mockResponse) {
      // Create a successful response from the mock data
      const mockResponse = {
        data: error.mockResponse.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config
      };
      
      if (import.meta.env.DEV) {
        console.log(`✅ Mock API Success: ${error.config?.url}`);
      }
      
      // Return successful promise with mock data
      return Promise.resolve(mockResponse);
    }

    // Handle real network errors - SILENT in development
    if (error.code === 'ERR_NETWORK') {
      if (import.meta.env.DEV) {
        // In development, just log to console
        console.log('ℹ️ Development mode: Using mock data (backend not running)');
        // Don't reject - let the mock interceptor handle it
        return Promise.reject(error);
      }
      showToast('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;