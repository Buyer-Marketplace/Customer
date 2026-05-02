// Centralized API endpoints configuration based on Agritech Database Schema
const API_ENDPOINTS = {
  // 🔐 Authentication
  AUTH: {
    GOOGLE_OAUTH: '/auth/google-oauth',  // POST - Google OAuth login
  },
  
  // 🌱 Crops (Public)
  CROPS: {
    BASE: '/buyer/crops',                    // GET - All active crops
    ITEMS_BY_CROP: (cropId) => `/buyer/crops/${cropId}/items`, // GET - Items for specific crop
  },
  
  // 🛒 Marketplace (Public)
  MARKETPLACE: {
    ACTIVE: '/marketplace/active',  // GET - All active marketplace listings
  },
  
  // 💳 Orders (Protected)
  ORDERS: {
    PLACE: '/buyer/orders/place',    // POST - Place order with M-Pesa
    MY_ORDERS: '/buyer/orders',       // GET - User's order history
    CONFIRM_DELIVERY: (orderId) => `/buyer/orders/${orderId}/confirm-delivery`, // POST - Escrow release
  },
  
  // 📦 Pre-Orders (Future Implementation)
  PREORDERS: {
    BASE: '/preorders',
    AVAILABLE: '/preorders/available',
    MY_PREORDERS: '/user/preorders',
  },
  
  // 📅 Harvest Calendar (Future Implementation)
  CALENDAR: {
    BASE: '/harvest-calendar',
    MONTHLY: (month, year) => `/harvest-calendar/${year}/${month}`,
  },
  
  // 👤 User Profile (Protected)
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/profile',
    ADD_PHONE: '/user/phone',
  },
};

export default API_ENDPOINTS;