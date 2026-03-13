import axiosInstance from './axios';

export const preorderApi = {
  createPreorder: async (preorderData) => {
    const response = await axiosInstance.post('/preorders', preorderData);
    return response.data;
  },

  getAllPreorders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/preorders${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getPreorderById: async (id) => {
    const response = await axiosInstance.get(`/preorders/${id}`);
    return response.data;
  },

  cancelPreorder: async (id) => {
    const response = await axiosInstance.put(`/preorders/${id}/cancel`);
    return response.data;
  },

  getAvailablePreorders: async () => {
    const response = await axiosInstance.get('/preorders/available');
    return response.data;
  },
};