import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { mockOrders } from '../data/mockData';
import OrderCard from '../components/orders/OrderCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { IoReceipt, IoArrowBack } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let data;
      try {
        const response = await orderApi.getAllOrders();
        data = response.data || response;
      } catch (err) {
        console.log('Using mock orders data');
        data = mockOrders;
      }
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={headerImage}
          alt="My Orders"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">MY ORDERS</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Track and manage your orders
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Back Button */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>

        {error ? (
          <div className="text-center py-12 bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
            <p className="text-red-400">Error loading orders: {error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20" data-aos="fade-up">
            <IoReceipt className="text-green-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-green-200 mb-6">Start shopping to place your first order</p>
            <Link to="/products">
              <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div key={order.id} data-aos="fade-up" data-aos-delay={index * 100}>
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;