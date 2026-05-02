import axiosInstance from './axios';

// TODO: Replace with actual API endpoints when backend is ready
const CALENDAR_ENDPOINTS = {
  GET_HARVEST_CALENDAR: '/harvest-calendar',
  GET_MONTHLY_CALENDAR: (month, year) => `/harvest-calendar/${year}/${month}`,
  GET_FARMER_CALENDAR: (farmerId) => `/farmers/${farmerId}/calendar`,
  GET_CROP_CALENDAR: (cropId) => `/crops/${cropId}/calendar`,
};

export const calendarApi = {
  /**
   * Get full harvest calendar
   * GET /api/harvest-calendar
   */
  getHarvestCalendar: async () => {
    try {
      const response = await axiosInstance.get(CALENDAR_ENDPOINTS.GET_HARVEST_CALENDAR);
      return response.data;
    } catch (error) {
      console.error('Error fetching harvest calendar:', error);
      throw error;
    }
  },

  /**
   * Get calendar for specific month and year
   * GET /api/harvest-calendar/:year/:month
   */
  getMonthlyCalendar: async (month, year) => {
    try {
      const response = await axiosInstance.get(CALENDAR_ENDPOINTS.GET_MONTHLY_CALENDAR(month, year));
      return response.data;
    } catch (error) {
      console.error(`Error fetching calendar for ${month}/${year}:`, error);
      throw error;
    }
  },

  /**
   * Get calendar for specific farmer
   * GET /api/farmers/:farmerId/calendar
   */
  getFarmerCalendar: async (farmerId) => {
    try {
      const response = await axiosInstance.get(CALENDAR_ENDPOINTS.GET_FARMER_CALENDAR(farmerId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching calendar for farmer ${farmerId}:`, error);
      throw error;
    }
  },

  /**
   * Get calendar for specific crop
   * GET /api/crops/:cropId/calendar
   */
  getCropCalendar: async (cropId) => {
    try {
      const response = await axiosInstance.get(CALENDAR_ENDPOINTS.GET_CROP_CALENDAR(cropId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching calendar for crop ${cropId}:`, error);
      throw error;
    }
  },
};

export default calendarApi;