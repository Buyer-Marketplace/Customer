/**
 * API Services Index
 * Central export point for all API services
 */

// Export axios instance for direct use if needed
export { default as axiosInstance } from './axios';

// Authentication API
export { default as authApi } from './authApi';

// Crops API
export { default as cropsApi } from './cropsApi';

// Marketplace API
export { default as marketplaceApi } from './marketplaceApi';

// Categories API
export { default as categoryApi } from './categoryApi';

// Orders API
export { default as ordersApi } from './ordersApi';

// Pre-orders API
export { default as preorderApi } from './preorderApi';

// Calendar API
export { default as calendarApi } from './calendarApi';

// Verification API (Phone verification for M-Pesa)
export { default as verificationApi } from './verificationApi';

// Re-export all APIs as a single object for convenience
const api = {
  auth: authApi,
  crops: cropsApi,
  marketplace: marketplaceApi,
  categories: categoryApi,
  orders: ordersApi,
  preorders: preorderApi,
  calendar: calendarApi,
  verification: verificationApi,
};

export default api;