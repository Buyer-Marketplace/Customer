import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';
import { mockPreOrders, mockUserPreorders, mockDataUtils } from '../data/mockData';

export const preorderApi = {
  createPreorder: async (preorderData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.PREORDERS.BASE, preorderData);
      return response.data;
    } catch (error) {
      console.log('Using mock create preorder');
      const newPreorder = {
        id: `PRE-${String(mockPreOrders.length + 1).padStart(3, '0')}`,
        ...preorderData,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        orderDate: new Date().toISOString(),
      };
      
      return {
        success: true,
        data: newPreorder,
        message: 'Preorder created successfully (mock)'
      };
    }
  },

  getAllPreorders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.PREORDERS.BASE}${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log('Using mock preorders data');
      
      let filtered = [...mockPreOrders];
      if (params.status) {
        filtered = filtered.filter(p => p.status === params.status);
      }
      
      const paginated = mockDataUtils.paginateProducts(filtered, params.page, params.limit);
      
      return {
        success: true,
        data: paginated.products,
        total: paginated.totalProducts,
        totalPages: paginated.totalPages,
        currentPage: paginated.currentPage,
        message: 'Mock preorders retrieved'
      };
    }
  },

  getPreorderById: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PREORDERS.DETAIL(id));
      return response.data;
    } catch (error) {
      console.log(`Using mock preorder data for id ${id}`);
      const preorder = mockPreOrders.find(p => p.id === id) || mockUserPreorders.find(p => p.id === id);
      
      return {
        success: true,
        data: preorder || {
          id: id,
          status: 'open',
          message: 'Sample preorder'
        },
        message: 'Mock preorder retrieved'
      };
    }
  },

  cancelPreorder: async (id) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.PREORDERS.CANCEL(id));
      return response.data;
    } catch (error) {
      console.log(`Using mock cancel preorder for id ${id}`);
      return {
        success: true,
        data: {
          id: id,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
        },
        message: 'Preorder cancelled successfully (mock)'
      };
    }
  },

  getAvailablePreorders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.PREORDERS.AVAILABLE}${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log('Using mock available preorders');
      
      let available = mockPreOrders.filter(p => p.status === 'open');
      
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        available = available.filter(p => 
          p.product.name.toLowerCase().includes(searchTerm) ||
          p.farmer.farmName.toLowerCase().includes(searchTerm)
        );
      }
      
      const paginated = mockDataUtils.paginateProducts(available, params.page, params.limit);
      
      return {
        success: true,
        data: paginated.products,
        total: paginated.totalProducts,
        totalPages: paginated.totalPages,
        currentPage: paginated.currentPage,
        message: 'Mock available preorders retrieved'
      };
    }
  },

  getUserPreorders: async (userId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.USERS.PREORDERS(userId)}${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log(`Using mock user preorders for user ${userId}`);
      
      const paginated = mockDataUtils.paginateProducts(mockUserPreorders, params.page, params.limit);
      
      return {
        success: true,
        data: paginated.products,
        total: paginated.totalProducts,
        totalPages: paginated.totalPages,
        currentPage: paginated.currentPage,
        message: 'Mock user preorders retrieved'
      };
    }
  },
};