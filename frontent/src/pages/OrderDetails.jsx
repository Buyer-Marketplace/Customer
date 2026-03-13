import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { mockOrders, mockDataUtils } from '../data/mockData';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';
import { 
  IoArrowBack, 
  IoPrint, 
  IoReceipt,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoLeaf
} from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      let data;
      try {
        const response = await orderApi.getOrderById(id);
        data = response.data || response;
      } catch (err) {
        console.log('Using mock order data');
        data = mockOrders.find(o => o.id === id) || {
          id: id,
          status: 'pending',
          createdAt: new Date().toISOString(),
          items: [],
          total: 0,
        };
      }
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
      fetchOrder();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'confirmed':
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
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
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
          <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
          <p className="text-green-200 mb-6">The order you're looking for doesn't exist.</p>
          <Link to="/orders">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={headerImage}
          alt="Order Details"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">ORDER DETAILS</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Track and manage your order #{order.id}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/orders" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Back to Orders
          </Link>
        </div>

        {/* Order Header Card */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 mb-6" data-aos="fade-up">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Order #{order.id}</h2>
              <p className="text-green-300">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="border-2 border-green-400 text-green-300 hover:bg-green-800/30"
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
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20" data-aos="fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Order Status</h3>
                <Badge variant={getStatusColor(order.status)} size="lg">
                  {order.status}
                </Badge>
              </div>
              <IoReceipt className="text-green-400" size={32} />
            </div>

            {/* Status Timeline */}
            {order.timeline && order.timeline.length > 0 && (
              <div className="mt-6">
                <div className="relative">
                  {order.timeline.map((event, index) => (
                    <div key={index} className="flex items-start mb-4 last:mb-0">
                      <div className="relative">
                        <div className={`w-3 h-3 rounded-full mt-1.5 ${
                          event.completed ? 'bg-green-400' : 'bg-green-700'
                        }`} />
                        {index < order.timeline.length - 1 && (
                          <div className={`absolute top-4 left-1.5 w-0.5 h-12 -translate-x-1/2 ${
                            event.completed ? 'bg-green-400/50' : 'bg-green-700/50'
                          }`} />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-white">{event.status}</p>
                        <p className="text-sm text-green-300">{event.date}</p>
                        {event.note && (
                          <p className="text-sm text-green-200/70 mt-1">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20" data-aos="fade-up">
            <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
            
            <div className="space-y-4">
              {order.items && order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-2 border-b border-green-800 last:border-b-0">
                  <img
                    src={item.product?.images?.[0] || item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=80&h=80'}
                    alt={item.product?.name || item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <Link to={`/products/${item.product?.id || item.productId}`} className="hover:text-green-300">
                      <h4 className="font-semibold text-white">{item.product?.name || item.name}</h4>
                    </Link>
                    <p className="text-sm text-green-300">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                    {item.product?.farmer && (
                      <p className="text-sm text-green-200/70">
                        Farmer: {item.product.farmer.farmName || item.product.farmer.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-400">
                      {formatCurrency(item.subtotal || item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20" data-aos="fade-up">
            <h3 className="text-lg font-semibold text-white mb-4">Shipping Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-green-300 mb-2 flex items-center">
                  <IoLocationOutline className="mr-2" />
                  Delivery Address
                </h4>
                <p className="text-white">{order.deliveryAddress}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-green-300 mb-2">Contact Information</h4>
                <p className="text-white flex items-center">
                  <IoPersonOutline className="mr-2 text-green-400" />
                  {order.contactInfo?.name}
                </p>
                <p className="text-white flex items-center">
                  <IoMailOutline className="mr-2 text-green-400" />
                  {order.contactInfo?.email}
                </p>
                <p className="text-white flex items-center">
                  <IoCallOutline className="mr-2 text-green-400" />
                  {order.contactInfo?.phone}
                </p>
              </div>
            </div>

            {order.trackingNumber && (
              <div className="mt-4">
                <h4 className="font-medium text-green-300 mb-2">Tracking Number</h4>
                <p className="text-green-400 font-mono">{order.trackingNumber}</p>
              </div>
            )}
          </div>

          {/* Payment Information */}
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20" data-aos="fade-up">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-300">Payment Method</span>
                <span className="font-medium text-white">{order.paymentMethod || 'M-Pesa'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Payment Status</span>
                <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'warning'}>
                  {order.paymentStatus || 'pending'}
                </Badge>
              </div>
              <div className="border-t border-green-700 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total Paid</span>
                  <span className="text-green-400 text-xl">
                    {formatCurrency(order.total || order.grandTotal || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-green-800/30 backdrop-blur-sm rounded-3xl p-6 text-center border border-green-400/20" data-aos="fade-up">
            <h3 className="font-semibold text-xl text-white mb-2">Need Help With Your Order?</h3>
            <p className="text-green-200 mb-4">
              Contact our support team for assistance with your order.
            </p>
            <Button variant="outline" size="sm" className="border-2 border-green-400 text-green-300 hover:bg-green-800/30">
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;