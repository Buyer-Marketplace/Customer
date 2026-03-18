import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 * Base URL: http://localhost:3000/api
 */
const authApi = {
  /**
   * Google OAuth Login
   * POST /api/auth/google-oauth
   * Public - No authentication required
   * 
   * Body: {
   *   "email": "user@gmail.com",
   *   "full_name": "John Doe",
   *   "phone_number": "2547XXXXXXXX" (optional)
   * }
   * 
   * Response: {
   *   "message": "Login successful",
   *   "user": {
   *     "id": 1,
   *     "full_name": "John Doe",
   *     "email": "user@gmail.com",
   *     "phone_number": "2547XXXXXXXX",
   *     "role_name": "Buyer"
   *   },
   *   "token": "eyJhbGciOiJIUzI1Ni..."
   * }
   */
  googleLogin: async (userData) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.AUTH.GOOGLE_OAUTH,
        {
          email: userData.email,
          full_name: userData.fullName,
          phone_number: userData.phoneNumber || '',
        }
      );
      
      // Store token and user data on successful login
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  /**
   * Logout - Client side only
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default authApi;