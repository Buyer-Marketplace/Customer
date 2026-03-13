import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';
import { mockFarmers, mockProducts, mockDataUtils } from '../data/mockData';

export const farmerApi = {
  getAllFarmers: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.FARMERS.BASE}${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log('Using mock farmers data');
      
      const paginated = mockDataUtils.paginateProducts(mockFarmers, params.page, params.limit);
      
      return {
        success: true,
        data: paginated.products,
        total: paginated.totalProducts,
        totalPages: paginated.totalPages,
        currentPage: paginated.currentPage,
        message: 'Mock farmers retrieved'
      };
    }
  },

  getFarmerById: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.FARMERS.DETAIL(id));
      return response.data;
    } catch (error) {
      console.log(`Using mock farmer data for id ${id}`);
      const farmer = mockFarmers.find(f => f.id === parseInt(id));
      
      return {
        success: true,
        data: farmer || {
          id: parseInt(id),
          name: `Farmer ${id}`,
          farmName: `Farm ${id}`,
          location: 'Unknown',
          rating: 4.0,
        },
        message: 'Mock farmer retrieved'
      };
    }
  },

  getFarmerProducts: async (farmerId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_ENDPOINTS.FARMERS.PRODUCTS(farmerId)}${queryString ? `?${queryString}` : ''}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.log(`Using mock products for farmer ${farmerId}`);
      
      const farmerProducts = mockProducts.filter(p => p.farmer.id === parseInt(farmerId));
      const filtered = mockDataUtils.filterProducts(farmerProducts, params);
      const paginated = mockDataUtils.paginateProducts(filtered, params.page, params.limit);
      
      return {
        success: true,
        ...paginated,
        message: 'Mock farmer products retrieved'
      };
    }
  },
};