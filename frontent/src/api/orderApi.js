import axiosInstance from './axios';

export const orderApi = {
  createOrder: async (orderData) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },

  getAllOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/orders${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id) => {
    const response = await axiosInstance.put(`/orders/${id}/cancel`);
    return response.data;
  },
};