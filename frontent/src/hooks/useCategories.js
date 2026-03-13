import { useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAllCategories();
      
      // Handle different response structures
      if (response && response.data) {
        setCategories(response.data);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to fetch categories');
      setCategories([]); // Empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id) => {
    try {
      const response = await categoryApi.getCategoryById(id);
      
      if (response && response.data) {
        return response.data;
      } else if (response) {
        return response;
      }
      
      return null;
    } catch (err) {
      console.error(`Error fetching category ${id}:`, err);
      return null;
    }
  };

  const refreshCategories = () => {
    fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    getCategoryById,
    refreshCategories
  };
};