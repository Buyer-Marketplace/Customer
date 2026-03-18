import { useState, useCallback } from 'react';
import { preorderApi } from '../api/preorderApi';

export const usePreOrders = () => {
  const [availablePreorders, setAvailablePreorders] = useState([]);
  const [myPreorders, setMyPreorders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAvailablePreorders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await preorderApi.getAvailablePreorders();
      setAvailablePreorders(response.data || []);
    } catch (err) {
      console.error('Error fetching available preorders:', err);
      setError(err.response?.data?.message || 'Failed to fetch available preorders');
      setAvailablePreorders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyPreorders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await preorderApi.getMyPreorders();
      setMyPreorders(response.data || []);
    } catch (err) {
      console.error('Error fetching my preorders:', err);
      setError(err.response?.data?.message || 'Failed to fetch your preorders');
      setMyPreorders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPreorderById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await preorderApi.getPreorderById(id);
      return response.data;
    } catch (err) {
      console.error(`Error fetching preorder ${id}:`, err);
      setError(err.response?.data?.message || 'Failed to fetch preorder details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPreorder = useCallback(async (preorderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await preorderApi.createPreorder(preorderData);
      return response.data;
    } catch (err) {
      console.error('Error creating preorder:', err);
      setError(err.response?.data?.message || 'Failed to create preorder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelPreorder = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await preorderApi.cancelPreorder(id);
      return response.data;
    } catch (err) {
      console.error(`Error cancelling preorder ${id}:`, err);
      setError(err.response?.data?.message || 'Failed to cancel preorder');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'success';
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'fulfilled':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const calculateDaysLeft = (deadlineDate) => {
    const deadline = new Date(deadlineDate);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return {
    availablePreorders,
    myPreorders,
    loading,
    error,
    fetchAvailablePreorders,
    fetchMyPreorders,
    getPreorderById,
    createPreorder,
    cancelPreorder,
    getStatusColor,
    calculateDaysLeft,
  };
};