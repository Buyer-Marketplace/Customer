import axiosInstance from './axios';
import API_ENDPOINTS from '../config/apiEndpoints';

// Helper functions for colors
const getCategoryColor = (cropName) => {
  const colors = {
    'Maize': 'yellow',
    'Wheat': 'amber',
    'Beans': 'brown',
    'Tomatoes': 'red',
    'Potatoes': 'brown',
    'Carrots': 'orange',
    'Onions': 'purple',
    'Cabbage': 'green',
    'Kale': 'green',
    'Spinach': 'green',
    'Oranges': 'orange',
    'Bananas': 'yellow',
    'Mangoes': 'yellow',
    'Avocados': 'green',
    'Strawberries': 'red',
    'Pineapple': 'yellow',
    'Coffee': 'brown',
    'Tea': 'green',
    'Rice': 'white',
    'Millet': 'amber',
    'Sorghum': 'amber',
    'Sunflower': 'yellow',
    'Groundnuts': 'brown',
    'Soybeans': 'green',
  };
  
  for (const [key, color] of Object.entries(colors)) {
    if (cropName.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return 'green';
};

export const categoryApi = {
  /**
   * Get All Categories (from crops)
   * GET /api/buyer/crops
   */
  getAllCategories: async () => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CROPS.BASE);
      
      // Extract crops data
      const crops = response.data.data || [];
      
      // Transform each crop into a category
      const categories = crops.map(crop => ({
        id: crop.id,
        name: crop.crop_name,
        description: crop.description || `Fresh ${crop.crop_name} from local farms`,
        image: crop.image_url || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
        productCount: 0, // Will be updated when we fetch items
        slug: crop.crop_name.toLowerCase().replace(/ /g, '-'),
        color: getCategoryColor(crop.crop_name),
      }));
      
      return {
        success: true,
        data: categories,
        message: 'Categories retrieved successfully'
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  /**
   * Get Category by ID
   */
  getCategoryById: async (id) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.CROPS.BASE);
      const crops = response.data.data || [];
      const crop = crops.find(c => c.id === parseInt(id));
      
      if (!crop) {
        throw new Error('Category not found');
      }
      
      const category = {
        id: crop.id,
        name: crop.crop_name,
        description: crop.description || `Fresh ${crop.crop_name} from local farms`,
        image: crop.image_url || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600',
        productCount: 0,
        slug: crop.crop_name.toLowerCase().replace(/ /g, '-'),
        color: getCategoryColor(crop.crop_name),
      };
      
      return {
        success: true,
        data: category,
        message: 'Category retrieved successfully'
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  /**
   * Get Items by Category (Crop ID)
   * GET /api/buyer/crops/:id/items
   */
  getItemsByCategory: async (categoryId, params = {}) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.CROPS.ITEMS_BY_CROP(categoryId),
        { params }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching items for category ${categoryId}:`, error);
      throw error;
    }
  },
};

export default categoryApi;