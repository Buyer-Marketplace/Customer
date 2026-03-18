import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import OrderCard from '../components/order/OrderCard';
import Button from '../components/ui/Button';
import Loader, { SkeletonLoader } from '../components/ui/Loader';
import { IoReceiptOutline, IoArrowBack } from 'react-icons/io5';
import { FiPlay, FiPause } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages, videoSources } from '../constants/homeConstants';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Orders = () => {
  const { orders, loading, error, fetchMyOrders } = useOrders();
  const [filter, setFilter] = useState('all');
  
  // Video states
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  // Video autoplay with intersection observer
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play()
              .then(() => {
                setVideoPlaying(true);
                setVideoLoaded(true);
              })
              .catch(() => {
                setVideoPlaying(false);
              });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (video) {
      observer.observe(video);
    }

    return () => {
      observer.disconnect();
      if (video) {
        video.pause();
      }
    };
  }, [videoError]);

  const toggleVideoPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play()
        .then(() => setVideoPlaying(true))
        .catch(err => console.log("Video play failed:", err));
    } else {
      video.pause();
      setVideoPlaying(false);
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
    setVideoPlaying(false);
  };

  // Filter orders by status
  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.escrow_status?.toLowerCase() === filter);

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.escrow_status?.toLowerCase() === 'pending').length,
    paid: orders.filter(o => o.escrow_status?.toLowerCase() === 'paid').length,
    delivered: orders.filter(o => o.escrow_status?.toLowerCase() === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" showLogo={true} text="Loading orders..." withSpinner={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Video Header Section */}
      <div className="relative w-full h-80 overflow-hidden">
        {!videoError ? (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              poster={headerImages.cart}
              onError={handleVideoError}
              onLoadedData={() => setVideoLoaded(true)}
            >
              {videoSources.cart.map((src, index) => (
                <source key={index} src={src} type="video/mp4" />
              ))}
            </video>
            
            {/* Show fallback image while video loads */}
            {!videoLoaded && (
              <img 
                src={headerImages.cart} 
                alt="My Orders" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <img 
            src={headerImages.cart} 
            alt="My Orders" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <div className={`absolute inset-0 ${headerGradient}`}></div>

        {/* Play/Pause Button */}
        {!videoError && videoLoaded && (
          <button
            onClick={toggleVideoPlay}
            className="absolute z-20 p-3 text-white transition-all border rounded-full bottom-6 right-6 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20"
            aria-label={videoPlaying ? 'Pause video' : 'Play video'}
          >
            {videoPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
          </button>
        )}
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">MY ORDERS</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Track and manage your orders
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Back Button */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-green-300 hover:text-green-100">
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
          <div 
            className={`bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border cursor-pointer transition-all ${
              filter === 'all' ? 'border-green-400 bg-green-900/50' : 'border-green-400/20 hover:border-green-400/40'
            }`}
            onClick={() => setFilter('all')}
          >
            <div className="text-2xl md:text-3xl font-bold text-green-300">{statusCounts.all}</div>
            <div className="text-xs text-green-200/70">Total Orders</div>
          </div>
          <div 
            className={`bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border cursor-pointer transition-all ${
              filter === 'pending' ? 'border-yellow-400 bg-yellow-900/30' : 'border-green-400/20 hover:border-yellow-400/40'
            }`}
            onClick={() => setFilter('pending')}
          >
            <div className="text-2xl md:text-3xl font-bold text-yellow-400">{statusCounts.pending}</div>
            <div className="text-xs text-green-200/70">Pending</div>
          </div>
          <div 
            className={`bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border cursor-pointer transition-all ${
              filter === 'paid' ? 'border-green-400 bg-green-900/50' : 'border-green-400/20 hover:border-green-400/40'
            }`}
            onClick={() => setFilter('paid')}
          >
            <div className="text-2xl md:text-3xl font-bold text-green-400">{statusCounts.paid}</div>
            <div className="text-xs text-green-200/70">Paid</div>
          </div>
          <div 
            className={`bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border cursor-pointer transition-all ${
              filter === 'delivered' ? 'border-blue-400 bg-blue-900/30' : 'border-green-400/20 hover:border-blue-400/40'
            }`}
            onClick={() => setFilter('delivered')}
          >
            <div className="text-2xl md:text-3xl font-bold text-blue-400">{statusCounts.delivered}</div>
            <div className="text-xs text-green-200/70">Delivered</div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm rounded-3xl p-8 border border-red-400/20 text-center mb-8">
            <p className="text-red-200 mb-4">{error}</p>
            <button 
              onClick={fetchMyOrders}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20" data-aos="fade-up">
            <IoReceiptOutline className="text-green-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Orders Yet</h2>
            <p className="text-green-200 mb-6">
              {filter !== 'all' 
                ? `You don't have any ${filter} orders.` 
                : "You haven't placed any orders yet."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                  Browse Marketplace
                </Button>
              </Link>
              {filter !== 'all' && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilter('all')}
                  className="border-2 border-green-400 text-green-300 hover:bg-green-800/30"
                >
                  View All Orders
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-green-300">
                Showing <span className="text-white font-semibold">{filteredOrders.length}</span> order{filteredOrders.length > 1 ? 's' : ''}
                {filter !== 'all' && <span> with status <span className="text-white">{filter}</span></span>}
              </p>
              {filter !== 'all' && (
                <button 
                  onClick={() => setFilter('all')}
                  className="text-sm text-green-400 hover:text-green-300"
                >
                  Clear Filter
                </button>
              )}
            </div>
            {filteredOrders.map((order, index) => (
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