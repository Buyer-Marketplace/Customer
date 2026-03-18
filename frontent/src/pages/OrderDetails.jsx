import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import { 
  IoArrowBack, 
  IoPrint, 
  IoReceiptOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoPersonOutline,
  IoLeaf,
  IoCheckmarkCircle,
  IoTimeOutline
} from 'react-icons/io5';
import { FiPlay, FiPause } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages, videoSources } from '../constants/homeConstants';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, getOrderStatusColor } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    fetchOrder();
  }, [id]);

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

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(id);
      if (data) {
        setOrder(data);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" showLogo={true} text="Loading order details..." withSpinner={true} />
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
      {/* Video Header */}
      <div className="relative w-full h-48 overflow-hidden">
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
                alt="Order Details"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <img 
            src={headerImages.cart} 
            alt="Order Details"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <div className={`absolute inset-0 ${headerGradient}`}></div>

        {/* Play/Pause Button */}
        {!videoError && videoLoaded && (
          <button
            onClick={toggleVideoPlay}
            className="absolute z-20 p-2 text-white transition-all border rounded-full bottom-4 right-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20"
            aria-label={videoPlaying ? 'Pause video' : 'Play video'}
          >
            {videoPlaying ? <FiPause className="w-3 h-3" /> : <FiPlay className="w-3 h-3" />}
          </button>
        )}
      </div>

      <div className="container-custom py-8 -mt-20 relative z-10 max-w-4xl">
        {/* Breadcrumb */}
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
                Placed on {formatDate(order.transaction_date, 'long')}
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
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20" data-aos="fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Order Status</h3>
                <Badge variant={getOrderStatusColor(order.escrow_status)} size="lg">
                  {order.escrow_status}
                </Badge>
              </div>
              <IoReceiptOutline className="text-green-400" size={32} />
            </div>

            {/* Payment Info */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              {order.mpesa_receipt_no && (
                <div>
                  <p className="text-xs text-green-300">M-Pesa Receipt</p>
                  <p className="text-sm font-mono text-green-400">{order.mpesa_receipt_no}</p>
                </div>
              )}
              {order.motorspeed_tracking_id && (
                <div>
                  <p className="text-xs text-green-300">Tracking ID</p>
                  <p className="text-sm text-white">{order.motorspeed_tracking_id}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20" data-aos="fade-up">
            <h3 className="text-lg font-semibold text-white mb-4">Order Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-green-800">
                <div>
                  <h4 className="font-semibold text-white">{order.crop_name}</h4>
                  <p className="text-sm text-green-300">
                    Quantity: {order.quantity_ordered_kg} kg
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-400">
                    {formatCurrency(order.total_price)}
                  </p>
                  <p className="text-xs text-green-300">
                    KES {order.total_price / order.quantity_ordered_kg}/kg
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20" data-aos="fade-up">
            <h3 className="text-lg font-semibold text-white mb-4">Delivery Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <IoLocationOutline className="text-green-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-green-300">Delivery Address</p>
                  <p className="text-white">{order.delivery_address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <IoCallOutline className="text-green-400 mt-1" size={20} />
                <div>
                  <p className="text-sm text-green-300">Phone Number</p>
                  <p className="text-white">{order.payment_phone_number}</p>
                </div>
              </div>

              {order.notes && (
                <div className="mt-4 p-3 bg-green-950/50 rounded-xl">
                  <p className="text-sm text-green-300 mb-1">Notes</p>
                  <p className="text-white text-sm">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20" data-aos="fade-up">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-green-300">Item Total</span>
                <span className="text-white">{formatCurrency(order.total_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-300">Delivery Fee</span>
                <span className="text-white">Free</span>
              </div>
              <div className="border-t border-green-700 pt-3 mt-3">
                <div className="flex justify-between font-bold">
                  <span className="text-white">Total Paid</span>
                  <span className="text-green-400 text-xl">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help? */}
          <div className="bg-green-800/30 backdrop-blur-sm rounded-3xl p-6 text-center border border-green-400/20" data-aos="fade-up">
            <h3 className="font-semibold text-xl text-white mb-2">Need Help With Your Order?</h3>
            <p className="text-green-200 mb-4">
              Contact our support team for assistance.
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