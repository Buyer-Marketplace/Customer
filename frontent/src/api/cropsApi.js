import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';

/**
 * Crops API Service
 * Handles all crop-related API calls
 * Base URL: http://localhost:3000/api
 */
const cropsApi = {
  /**
   * Get All Active Crops
   * GET /api/buyer/crops
   * Public - No authentication required
   * 
   * Response: {
   *   "data": [
   *     {
   *       "id": 1,
   *       "crop_name": "Maize",
   *       "image_url": "https://...",
   *       "description": "High yield yellow maize",
   *       "price_per_kg": 45.50
   *     }
   *   ]
   * }
   */
  getAllCrops: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CROPS.BASE);
      return response.data;
    } catch (error) {
      console.error('Error fetching crops:', error);
      throw error;
    }
  },

  /**
   * Get Items by Crop ID
   * GET /api/buyer/crops/:id/items
   * Public - No authentication required
   * 
   * Response: {
   *   "data": [
   *     {
   *       "id": 10,
   *       "crop_name": "Maize",
   *       "farmer_name": "Jane Smith",
   *       "available_quantity_kg": 1500.00,
   *       "price_per_kg": 48.00,
   *       "expected_harvest_date": "2026-06-30",
   *       "region_name": "Nakuru",
   *       "image_url": "https://...",
   *       "listing_status": "Active"
   *     }
   *   ]
   * }
   */
  getItemsByCrop: async (cropId, params = {}) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.CROPS.ITEMS_BY_CROP(cropId),
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for crop ${cropId}:`, error);
      throw error;
    }
  },
};

export default cropsApi;