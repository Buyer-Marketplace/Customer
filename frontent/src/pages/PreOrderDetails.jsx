import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePreOrders } from '../hooks/usePreOrders';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Input from '../components/ui/Input';
import { 
  IoArrowBack, 
  IoCalendarOutline, 
  IoTimeOutline, 
  IoLocationOutline,
  IoLeaf,
  IoCartOutline
} from 'react-icons/io5';
import { FiPlay, FiPause } from 'react-icons/fi';
import { GiFarmer } from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages, videoSources } from '../constants/homeConstants';

// Header gradient
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const PreOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { 
    getPreorderById, 
    createPreorder, 
    cancelPreorder, 
    loading, 
    getStatusColor,
    calculateDaysLeft 
  } = usePreOrders();
  
  const [preorder, setPreorder] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
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
    fetchPreorder();
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

  const fetchPreorder = async () => {
    const data = await getPreorderById(id);
    if (data) {
      setPreorder(data);
      setQuantity(data.minOrder || 1);
    } else {
      setError('Pre-order not found');
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (preorder && value >= preorder.minOrder && value <= preorder.maxOrder) {
      setQuantity(value);
    }
  };

  const handlePreOrder = async () => {
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: `/preorders/${id}` } });
      return;
    }

    setSubmitting(true);
    try {
      await createPreorder({
        preorderId: preorder.id,
        quantity: quantity,
        userId: user?.id,
      });
      navigate('/preorders?tab=my');
    } catch (err) {
      // Error handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this pre-order?')) {
      return;
    }

    setSubmitting(true);
    try {
      await cancelPreorder(preorder.id);
      navigate('/preorders?tab=my');
    } catch (err) {
      // Error handled in hook
    } finally {
      setSubmitting(false);
    }
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
        <Loader size="lg" showLogo={true} text="Loading pre-order details..." />
      </div>
    );
  }

  if (error || !preorder) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
          <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Pre-Order Not Found</h2>
          <p className="text-green-200 mb-6">The pre-order you're looking for doesn't exist.</p>
          <Link to="/preorders">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
              Back to Pre-Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = preorder.orderDeadline ? calculateDaysLeft(preorder.orderDeadline) : 0;
  const totalPrice = preorder.price * quantity;

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
              poster={headerImages.preorder}
              onError={handleVideoError}
              onLoadedData={() => setVideoLoaded(true)}
            >
              {videoSources.hero.map((src, index) => (
                <source key={index} src={src} type="video/mp4" />
              ))}
            </video>
            
            {/* Show fallback image while video loads */}
            {!videoLoaded && (
              <img 
                src={headerImages.preorder} 
                alt="Pre-Order Details" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <img 
            src={headerImages.preorder} 
            alt="Pre-Order Details" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Gradient overlay */}
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
          <Link to="/preorders" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Back to Pre-Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2" data-aos="fade-right">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20">
              {/* Image */}
              <div className="relative h-64 rounded-xl overflow-hidden mb-6">
                <img
                  src={preorder.cropImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800'}
                  alt={preorder.cropName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Status */}
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-white">{preorder.cropName}</h1>
                <Badge variant={getStatusColor(preorder.status)} size="lg">
                  {preorder.status}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-green-200 mb-6">{preorder.description || 'No description available.'}</p>

              {/* Farmer Info */}
              <div className="bg-green-950/50 rounded-xl p-4 mb-6">
                <h3 className="text-white font-semibold mb-3">Farmer Information</h3>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-700/30 rounded-full flex items-center justify-center">
                    <GiFarmer className="text-green-400" size={24} />
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {preorder.farmer?.farmName || preorder.farmer?.name || 'Unknown Farmer'}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-green-300 mt-1">
                      <IoLocationOutline size={14} />
                      <span>{preorder.farmer?.location || 'Location not specified'}</span>
                    </div>
                    {preorder.farmer?.rating && (
                      <p className="text-sm text-yellow-400 mt-1">
                        Rating: {preorder.farmer.rating} ⭐
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-950/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-300 mb-1">
                    <IoCalendarOutline size={16} />
                    <span className="text-sm">Harvest Date</span>
                  </div>
                  <p className="text-white font-medium">{formatDate(preorder.expectedHarvestDate)}</p>
                </div>
                <div className="bg-green-950/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-green-300 mb-1">
                    <IoTimeOutline size={16} />
                    <span className="text-sm">Order Deadline</span>
                  </div>
                  <p className="text-white font-medium">
                    {formatDate(preorder.orderDeadline)}
                    {daysLeft > 0 && (
                      <span className="block text-xs text-green-300 mt-1">
                        {daysLeft} days left
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Sidebar */}
          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Place Pre-Order</h2>

              {/* Price */}
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-green-400">
                  {formatCurrency(preorder.price)}
                </span>
                <span className="text-green-300 ml-2">per {preorder.unit || 'kg'}</span>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <Input
                  label="Quantity"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={preorder.minOrder || 1}
                  max={preorder.maxOrder || preorder.availableQuantity}
                  required
                  className="bg-green-950/60"
                  labelClassName="text-green-200"
                />
                <p className="text-xs text-green-300/50 mt-2">
                  Min: {preorder.minOrder || 1} {preorder.unit || 'kg'} | Max: {preorder.maxOrder || preorder.availableQuantity} {preorder.unit || 'kg'}
                </p>
              </div>

              {/* Total */}
              <div className="bg-green-950/50 rounded-xl p-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-green-300">Total Price:</span>
                  <span className="text-white font-bold">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-300">Available:</span>
                  <span className="text-white">{preorder.availableQuantity || 0} {preorder.unit || 'kg'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {preorder.status === 'open' ? (
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handlePreOrder}
                  loading={submitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <IoCartOutline className="mr-2" size={20} />
                  Confirm Pre-Order
                </Button>
              ) : preorder.status === 'pending' || preorder.status === 'confirmed' ? (
                <Button
                  variant="danger"
                  size="lg"
                  fullWidth
                  onClick={handleCancel}
                  loading={submitting}
                >
                  Cancel Pre-Order
                </Button>
              ) : null}

              {/* Info Text */}
              <p className="text-xs text-green-300/50 text-center mt-4">
                You won't be charged until the harvest is ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreOrderDetails;