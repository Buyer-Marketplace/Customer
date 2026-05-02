import { useState, useEffect, useCallback } from 'react';
import ordersApi from '../api/ordersApi';
import toast from 'react-hot-toast';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ordersApi.getMyOrders();
      setOrders(response.data || []);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch orders';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  const getOrderById = useCallback(async (id) => {
    setLoading(true);
    try {
      const order = await ordersApi.getOrderById(id);
      return order;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch order';
      toast.error(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const placeOrder = useCallback(async (orderData) => {
    setPlacingOrder(true);
    setError(null);
    try {
      const response = await ordersApi.placeOrder(orderData);
      toast.success('Order placed! Check your phone for M-Pesa prompt.');
      
      // Refresh orders after placing new order
      await fetchMyOrders();
      
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to place order';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setPlacingOrder(false);
    }
  }, [fetchMyOrders]);

  const confirmDelivery = useCallback(async (id) => {
    setLoading(true);
    try {
      await ordersApi.confirmDelivery(id);
      toast.success('Delivery confirmed! Funds released to farmer.');
      await fetchMyOrders();
      return true;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to confirm delivery';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchMyOrders]);

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'delivered':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getOrderStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Payment Pending';
      case 'paid':
        return 'Payment Received';
      case 'delivered':
        return 'Delivered';
      default:
        return status || 'Unknown';
    }
  };

  return {
    orders,
    loading,
    placingOrder,
    error,
    fetchMyOrders,
    getOrderById,
    placeOrder,
    confirmDelivery,
    getOrderStatusColor,
    getOrderStatusText,
  };
};