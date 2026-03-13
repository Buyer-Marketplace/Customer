import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';
import { mockProducts, mockDataUtils } from '../data/mockData';

export const productApi = {
  getAllProducts: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.PRODUCTS.BASE}${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log('Using mock products data (backend not available)');
      
      const filtered = mockDataUtils.filterProducts(mockProducts, params);
      const paginated = mockDataUtils.paginateProducts(filtered, params.page, params.limit);
      
      return {
        success: true,
        ...paginated,
        message: 'Mock products retrieved'
      };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.DETAIL(id));
      return response.data;
    } catch (error) {
      console.log(`Using mock product data for id ${id}`);
      const product = mockProducts.find(p => p.id === parseInt(id));
      
      if (product) {
        return {
          success: true,
          product,
          message: 'Mock product retrieved'
        };
      }
      throw new Error('Product not found');
    }
  },

  getProductsByCategory: async (categoryId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.PRODUCTS.BY_CATEGORY(categoryId)}${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log(`Using mock products for category ${categoryId}`);
      
      const categoryProducts = mockProducts.filter(p => p.category.id === parseInt(categoryId));
      const filtered = mockDataUtils.filterProducts(categoryProducts, params);
      const paginated = mockDataUtils.paginateProducts(filtered, params.page, params.limit);
      
      return {
        success: true,
        ...paginated,
        message: 'Mock products retrieved'
      };
    }
  },

  getFeaturedProducts: async (limit = 8) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS.FEATURED}?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.log('Using mock featured products');
      const featured = mockProducts.filter(p => p.featured).slice(0, limit);
      
      return {
        success: true,
        products: featured,
        totalProducts: featured.length,
        message: 'Mock featured products retrieved'
      };
    }
  },

  getNewProducts: async (limit = 8) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS.SEARCH}?sort=newest&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.log('Using mock new products');
      const newProducts = [...mockProducts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, limit);
      
      return {
        success: true,
        products: newProducts,
        totalProducts: newProducts.length,
        message: 'Mock new products retrieved'
      };
    }
  },

  getProductsForHarvestCalendar: async (month, year) => {
    try {
      const response = await axiosInstance.get(`${API_ENDPOINTS.PRODUCTS.HARVEST_CALENDAR}?month=${month}&year=${year}`);
      return response.data;
    } catch (error) {
      console.log('Using mock harvest calendar data');
      return {};
    }
  },
};