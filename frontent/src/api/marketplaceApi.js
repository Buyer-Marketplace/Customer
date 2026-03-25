import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';

/**
 * Marketplace API Service
 * Handles all marketplace-related API calls
 * Base URL: http://localhost:3000/api
 */
const marketplaceApi = {
  /**
   * Get All Active Listings
   * GET /api/marketplace/active
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
  getAllActiveListings: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.MARKETPLACE.ACTIVE);
      return response.data;
    } catch (error) {
      console.error('Error fetching active listings:', error);
      throw error;
    }
  },

  /**
   * Get all active marketplace items for the crop associated with the given item ID
   * GET /api/marketplace/item/:id
   */
  getItemDetails: async (id) => {
    try {
      const response = await axiosInstance.get(`/marketplace/item/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching details for item ${id}:`, error);
      throw error;
    }
  },
};

export default marketplaceApi;