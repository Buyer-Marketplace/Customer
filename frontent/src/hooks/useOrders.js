import { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = async (params = {}) => {
    try {
      setLoading(true);
      const response = await orderApi.getAllOrders({
        page: currentPage,
        ...params
      });
      
      if (response && response.data) {
        setOrders(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalOrders(response.total || response.data.length || 0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await orderApi.createOrder(orderData);
      setError(null);
      
      // Refresh orders list
      await fetchOrders();
      
      return response;
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = async (id) => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderById(id);
      setError(null);
      return response.data || response;
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err.message || 'Failed to fetch order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    try {
      setLoading(true);
      const response = await orderApi.cancelOrder(id);
      
      // Update local state
      setOrders(prev => 
        prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o)
      );
      
      setError(null);
      return response;
    } catch (err) {
      console.error('Error cancelling order:', err);
      setError(err.message || 'Failed to cancel order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: totalOrders,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
    return stats;
  };

  return {
    orders,
    loading,
    error,
    totalPages,
    currentPage,
    totalOrders,
    setCurrentPage,
    fetchOrders,
    createOrder,
    getOrderById,
    cancelOrder,
    getOrderStats,
  };
};