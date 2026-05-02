import axiosInstance from './axios';

/**
 * Phone Verification API Service
 * Handles phone verification for M-Pesa payments
 * Base URL: http://localhost:3050/api
 * All endpoints are Protected - Require Authorization header
 */
export const verificationApi = {
  /**
   * Send Phone Verification Code
   * POST /api/auth/send-phone-verification
   * Protected - Requires Authentication
   * 
   * Body: {
   *   "phone_number": "254712345678"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "message": "Verification code sent successfully",
   *   "expires_in": 300
   * }
   */
  sendPhoneVerification: async (phoneNumber) => {
    try {
      const response = await axiosInstance.post('/api/auth/send-phone-verification', {
        phone_number: phoneNumber
      });
      return response.data;
    } catch (error) {
      console.error('Error sending phone verification:', error);
      throw error;
    }
  },

  /**
   * Verify Phone Code
   * POST /api/auth/verify-phone
   * Protected - Requires Authentication
   * 
   * Body: {
   *   "phone_number": "254712345678",
   *   "code": "123456"
   * }
   * 
   * Response: {
   *   "success": true,
   *   "message": "Phone verified successfully",
   *   "user": { ... }
   * }
   */
  verifyPhone: async (phoneNumber, code) => {
    try {
      const response = await axiosInstance.post('/api/auth/verify-phone', {
        phone_number: phoneNumber,
        code: code
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying phone:', error);
      throw error;
    }
  },

  /**
   * Check Phone Verification Status
   * GET /api/auth/phone-verification-status
   * Protected - Requires Authentication
   * 
   * Response: {
   *   "success": true,
   *   "data": {
   *     "phone_verified": true,
   *     "phone_number": "254712345678"
   *   }
   * }
   */
  getPhoneVerificationStatus: async () => {
    try {
      const response = await axiosInstance.get('/api/auth/phone-verification-status');
      return response.data;
    } catch (error) {
      console.error('Error getting phone verification status:', error);
      throw error;
    }
  }
};

export default verificationApi;