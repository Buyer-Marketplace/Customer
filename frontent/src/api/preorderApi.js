import axiosInstance from './axios';

// TODO: Replace with actual API endpoints when backend is ready
const PREORDER_ENDPOINTS = {
  GET_ALL: '/preorders',
  GET_BY_ID: (id) => `/preorders/${id}`,
  CREATE: '/preorders',
  UPDATE: (id) => `/preorders/${id}`,
  CANCEL: (id) => `/preorders/${id}/cancel`,
  AVAILABLE: '/preorders/available',
  MY_PREORDERS: '/user/preorders',
};

export const preorderApi = {
  /**
   * Get all preorders
   * GET /api/preorders
   */
  getAllPreorders: async () => {
    try {
      const response = await axiosInstance.get(PREORDER_ENDPOINTS.GET_ALL);
      return response.data;
    } catch (error) {
      console.error('Error fetching preorders:', error);
      throw error;
    }
  },

  /**
   * Get available preorders (for marketplace)
   * GET /api/preorders/available
   */
  getAvailablePreorders: async () => {
    try {
      const response = await axiosInstance.get(PREORDER_ENDPOINTS.AVAILABLE);
      return response.data;
    } catch (error) {
      console.error('Error fetching available preorders:', error);
      throw error;
    }
  },

  /**
   * Get my preorders (for authenticated user)
   * GET /api/user/preorders
   */
  getMyPreorders: async () => {
    try {
      const response = await axiosInstance.get(PREORDER_ENDPOINTS.MY_PREORDERS);
      return response.data;
    } catch (error) {
      console.error('Error fetching my preorders:', error);
      throw error;
    }
  },

  /**
   * Get preorder by ID
   * GET /api/preorders/:id
   */
  getPreorderById: async (id) => {
    try {
      const response = await axiosInstance.get(PREORDER_ENDPOINTS.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      console.error(`Error fetching preorder ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new preorder
   * POST /api/preorders
   */
  createPreorder: async (preorderData) => {
    try {
      const response = await axiosInstance.post(PREORDER_ENDPOINTS.CREATE, preorderData);
      return response.data;
    } catch (error) {
      console.error('Error creating preorder:', error);
      throw error;
    }
  },

  /**
   * Update a preorder
   * PUT /api/preorders/:id
   */
  updatePreorder: async (id, preorderData) => {
    try {
      const response = await axiosInstance.put(PREORDER_ENDPOINTS.UPDATE(id), preorderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating preorder ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cancel a preorder
   * PUT /api/preorders/:id/cancel
   */
  cancelPreorder: async (id) => {
    try {
      const response = await axiosInstance.put(PREORDER_ENDPOINTS.CANCEL(id));
      return response.data;
    } catch (error) {
      console.error(`Error cancelling preorder ${id}:`, error);
      throw error;
    }
  },
};

export default preorderApi;