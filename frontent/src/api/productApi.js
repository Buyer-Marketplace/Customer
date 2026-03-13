import axiosInstance from './axios';

export const productApi = {
  getAllProducts: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/products${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/products?category=${categoryId}${queryString ? `&${queryString}` : ''}`);
    return response.data;
  },

  searchProducts: async (searchTerm, params = {}) => {
    const queryString = new URLSearchParams({ ...params, search: searchTerm }).toString();
    const response = await axiosInstance.get(`/products?${queryString}`);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await axiosInstance.get('/products?featured=true&limit=8');
    return response.data;
  },

  getNewProducts: async () => {
    const response = await axiosInstance.get('/products?sort=newest&limit=8');
    return response.data;
  },

  getProductsForHarvestCalendar: async (month, year) => {
    const response = await axiosInstance.get(`/products/harvest-calendar?month=${month}&year=${year}`);
    return response.data;
  },
};