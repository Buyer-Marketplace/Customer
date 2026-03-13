import axiosInstance from './axios';

export const categoryApi = {
  getAllCategories: async () => {
    const response = await axiosInstance.get('/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  },

  getCategoryWithProducts: async (id, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/categories/${id}/products${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },
};