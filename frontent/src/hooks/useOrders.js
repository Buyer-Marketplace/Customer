import { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';
// Remove toast import

export const useOrders = (initialParams = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAllOrders({ page: currentPage, ...initialParams });
      setOrders(response.orders || response);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id) => {
    try {
      return await orderApi.getOrderById(id);
    } catch (err) {
      throw err;
    }
  };

  const createOrder = async (orderData) => {
    try {
      const response = await orderApi.createOrder(orderData);
      await fetchOrders();
      return response;
    } catch (err) {
      throw err;
    }
  };

  const cancelOrder = async (id) => {
    try {
      const response = await orderApi.cancelOrder(id);
      await fetchOrders();
      return response;
    } catch (err) {
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    totalPages,
    currentPage,
    setCurrentPage,
    getOrderById,
    createOrder,
    cancelOrder,
    refetch: fetchOrders,
  };
};