import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';
import { mockOrders, mockDataUtils } from '../data/mockData';

export const orderApi = {
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.ORDERS.BASE, orderData);
      return response.data;
    } catch (error) {
      console.log('Using mock create order');
      const newOrder = {
        id: `ORD-${String(mockOrders.length + 1).padStart(3, '0')}`,
        ...orderData,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          { status: 'Order Placed', date: new Date().toISOString().split('T')[0], completed: true }
        ]
      };
      
      return {
        success: true,
        data: newOrder,
        message: 'Order created successfully (mock)'
      };
    }
  },

  getAllOrders: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.ORDERS.BASE}${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log('Using mock orders data');
      
      let filtered = [...mockOrders];
      if (params.status) {
        filtered = filtered.filter(o => o.status === params.status);
      }
      
      const paginated = mockDataUtils.paginateProducts(filtered, params.page, params.limit);
      
      return {
        success: true,
        data: paginated.products,
        total: paginated.totalProducts,
        totalPages: paginated.totalPages,
        currentPage: paginated.currentPage,
        message: 'Mock orders retrieved'
      };
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.ORDERS.DETAIL(id));
      return response.data;
    } catch (error) {
      console.log(`Using mock order data for id ${id}`);
      const order = mockOrders.find(o => o.id === id);
      
      return {
        success: true,
        data: order || {
          id: id,
          status: 'pending',
          message: 'Sample order'
        },
        message: 'Mock order retrieved'
      };
    }
  },

  cancelOrder: async (id) => {
    try {
      const response = await axiosInstance.put(API_ENDPOINTS.ORDERS.CANCEL(id));
      return response.data;
    } catch (error) {
      console.log(`Using mock cancel order for id ${id}`);
      return {
        success: true,
        data: {
          id: id,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
        },
        message: 'Order cancelled successfully (mock)'
      };
    }
  },
};