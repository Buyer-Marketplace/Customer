import axiosInstance from './axios';
import { mockCategories, mockDataUtils } from '../data/mockData';

export const categoryApi = {
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get('/categories');
      return response.data;
    } catch (error) {
      console.log('Using mock categories data (backend not available)');
      return {
        success: true,
        data: mockCategories,
        message: 'Mock data retrieved'
      };
    }
  },

  getCategoryById: async (id) => {
    try {
      const response = await axiosInstance.get(`/categories/${id}`);
      return response.data;
    } catch (error) {
      console.log(`Using mock category data for id ${id}`);
      const category = mockCategories.find(c => c.id === parseInt(id));
      return {
        success: true,
        data: category || {
          id: parseInt(id),
          name: `Category ${id}`,
          description: 'Browse our selection of fresh products',
          image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
          productCount: 0,
        },
        message: 'Mock data retrieved'
      };
    }
  },

  getCategoryWithProducts: async (id, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await axiosInstance.get(`/categories/${id}/products${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.log(`Using mock category products for id ${id}`);
      const category = mockCategories.find(c => c.id === parseInt(id));
      return {
        success: true,
        data: {
          category,
          products: [],
        },
        message: 'Mock data retrieved'
      };
    }
  },
};