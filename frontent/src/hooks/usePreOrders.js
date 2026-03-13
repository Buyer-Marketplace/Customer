import { useState, useEffect } from 'react';
import { preorderApi } from '../api/preorderApi';

export const usePreOrders = () => {
  const [preorders, setPreorders] = useState([]);
  const [availablePreorders, setAvailablePreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPreorders();
    fetchAvailablePreorders();
  }, []);

  const fetchPreorders = async () => {
    setLoading(true);
    try {
      const data = await preorderApi.getAllPreorders();
      setPreorders(data.preorders || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailablePreorders = async () => {
    try {
      const data = await preorderApi.getAvailablePreorders();
      setAvailablePreorders(data.preorders || data);
    } catch (err) {
      console.error('Error fetching available preorders:', err);
    }
  };

  const createPreorder = async (preorderData) => {
    try {
      const response = await preorderApi.createPreorder(preorderData);
      await fetchPreorders(); // Refresh preorders list
      await fetchAvailablePreorders(); // Refresh available preorders
      return response;
    } catch (err) {
      throw err;
    }
  };

  const cancelPreorder = async (id) => {
    try {
      const response = await preorderApi.cancelPreorder(id);
      await fetchPreorders(); // Refresh preorders list
      await fetchAvailablePreorders(); // Refresh available preorders
      return response;
    } catch (err) {
      throw err;
    }
  };

  const getPreorderById = async (id) => {
    try {
      return await preorderApi.getPreorderById(id);
    } catch (err) {
      throw err;
    }
  };

  return {
    preorders,
    availablePreorders,
    loading,
    error,
    createPreorder,
    cancelPreorder,
    getPreorderById,
    refetch: fetchPreorders,
    refetchAvailable: fetchAvailablePreorders,
  };
};