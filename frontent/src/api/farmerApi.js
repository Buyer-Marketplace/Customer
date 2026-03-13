import axiosInstance from './axios';

export const farmerApi = {
  getAllFarmers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/farmers${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getFarmerById: async (id) => {
    const response = await axiosInstance.get(`/farmers/${id}`);
    return response.data;
  },

  getFarmerProducts: async (farmerId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/farmers/${farmerId}/products${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },
};