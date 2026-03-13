import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { IoArrowBack, IoPrint, IoReceipt } from 'react-icons/io5';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      await orderApi.cancelOrder(id);
      toast.success('Order cancelled successfully');
      fetchOrder(); // Refresh order data
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'processing':
        return 'primary';
      case 'shipped':
        return 'secondary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist.</p>
          <Link to="/orders" className="text-primary-600 hover:text-primary-700">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center text-gray-600 hover:text-primary-600 mb-4">
            <IoArrowBack className="mr-2" />
            Back to Orders
          </Link>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-600 mt-1">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
              >
                <IoPrint className="mr-2" />
                Print
              </Button>
              {order.status === 'pending' && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleCancelOrder}
                  loading={cancelling}
                >
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Order Status</h2>
                <Badge variant={getStatusColor(order.status)} size="lg">
                  {order.status}
                </Badge>
              </div>
              <IoReceipt className="text-gray-400" size={32} />
            </div>

            {/* Status Timeline */}
            {order.timeline && (
              <div className="mt-6">
                <div className="relative">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start mb-4 last:mb-0">
                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${
                          event.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                        {index < order.timeline.length - 1 && (
                          <div className={`absolute top-4 left-1.5 w-0.5 h-12 -translate-x-1/2 ${
                            event.completed ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-gray-600">{event.date}</p>
                        {event.note && (
                          <p className="text-sm text-gray-500 mt-1">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-2 border-b last:border-b-0">
                  <img
                    src={item.product.images?.[0] || 'https://via.placeholder.com/80x80'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <Link to={`/products/${item.product.id}`} className="hover:text-primary-600">
                      <h3 className="font-semibold">{item.product.name}</h3>
                    </Link>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                    {item.product.farmer && (
                      <p className="text-sm text-gray-500">
                        Farmer: {item.product.farmer.farmName || item.product.farmer.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary-600">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Delivery Address</h3>
                <p className="text-gray-600">{order.deliveryAddress}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Contact Information</h3>
                <p className="text-gray-600">{order.contactInfo?.name}</p>
                <p className="text-gray-600">{order.contactInfo?.email}</p>
                <p className="text-gray-600">{order.contactInfo?.phone}</p>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-4">
                <h3 className="font-medium text-gray-700 mb-2">Tracking Number</h3>
                <p className="text-primary-600">{order.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span>Total Paid</span>
                  <span className="text-primary-600 text-xl">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-earth-50 rounded-lg p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">Need Help With Your Order?</h3>
            <p className="text-gray-600 mb-4">
              Contact our support team for assistance with your order.
            </p>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;