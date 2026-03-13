// Centralized API endpoints configuration
const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
  },
  
  // Product endpoints
  PRODUCTS: {
    BASE: '/products',
    DETAIL: (id) => `/products/${id}`,
    FEATURED: '/products/featured',
    SEARCH: '/products/search',
    BY_CATEGORY: (categoryId) => `/products/category/${categoryId}`,
    HARVEST_CALENDAR: '/products/harvest-calendar',
  },
  
  // Category endpoints
  CATEGORIES: {
    BASE: '/categories',
    DETAIL: (id) => `/categories/${id}`,
    WITH_PRODUCTS: (id) => `/categories/${id}/products`,
  },
  
  // Farmer endpoints
  FARMERS: {
    BASE: '/farmers',
    DETAIL: (id) => `/farmers/${id}`,
    PRODUCTS: (id) => `/farmers/${id}/products`,
  },
  
  // Order endpoints
  ORDERS: {
    BASE: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CANCEL: (id) => `/orders/${id}/cancel`,
  },
  
  // Preorder endpoints
  PREORDERS: {
    BASE: '/preorders',
    DETAIL: (id) => `/preorders/${id}`,
    CANCEL: (id) => `/preorders/${id}/cancel`,
    AVAILABLE: '/preorders/available',
  },
  
  // User endpoints
  USERS: {
    BASE: '/users',
    DETAIL: (id) => `/users/${id}`,
    PREORDERS: (id) => `/users/${id}/preorders`,
    ORDERS: (id) => `/users/${id}/orders`,
  },
};

export default API_ENDPOINTS;