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
    setLoading(true);
    try {
      const data = await categoryApi.getAllCategories();
      setCategories(data.categories || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryById = async (id) => {
    try {
      return await categoryApi.getCategoryById(id);
    } catch (err) {
      throw err;
    }
  };

  const getCategoryWithProducts = async (id, params = {}) => {
    try {
      return await categoryApi.getCategoryWithProducts(id, params);
    } catch (err) {
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryWithProducts,
    refetch: fetchCategories,
  };
};