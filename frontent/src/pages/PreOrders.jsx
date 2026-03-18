import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { usePreOrders } from '../hooks/usePreOrders';
import PreOrderCard from '../components/preorder/PreOrderCard';
import Button from '../components/ui/Button';
import { SkeletonLoader } from '../components/ui/Loader';
import { IoArrowBack, IoLeaf } from 'react-icons/io5';
import { FiPlay, FiPause } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages, videoSources } from '../constants/homeConstants';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const PreOrders = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef(null);
  
  const { 
    availablePreorders, 
    myPreorders, 
    loading, 
    error, 
    fetchAvailablePreorders, 
    fetchMyPreorders 
  } = usePreOrders();

  // Initialize AOS with normal settings
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease',
      once: true,
      offset: 30,
    });
    
    // Refresh AOS after a short delay to ensure DOM is ready
    setTimeout(() => {
      AOS.refresh();
    }, 100);
  }, []);

  // Refresh AOS when data loads
  useEffect(() => {
    if (!loading) {
      AOS.refresh();
    }
  }, [loading, activeTab]);

  useEffect(() => {
    if (activeTab === 'available') {
      fetchAvailablePreorders();
    } else {
      fetchMyPreorders();
    }
  }, [activeTab, fetchAvailablePreorders, fetchMyPreorders]);

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

  const displayPreorders = activeTab === 'available' ? availablePreorders : myPreorders;

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
                alt="Pre-Orders" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <img 
            src={headerImages.preorder} 
            alt="Pre-Orders" 
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
            <h1 className="text-5xl md:text-6xl font-bold mb-4">PRE-ORDERS</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Secure your harvest before it's ready
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-green-300 hover:text-green-100">
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Tabs */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-2 border border-green-400/20 mb-8 inline-flex" data-aos="fade-up">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'available'
                ? 'bg-green-600 text-white'
                : 'text-green-300 hover:text-white hover:bg-green-800/30'
            }`}
          >
            Available Pre-Orders
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'my'
                ? 'bg-green-600 text-white'
                : 'text-green-300 hover:text-white hover:bg-green-800/30'
            }`}
          >
            My Pre-Orders
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm rounded-3xl p-8 border border-red-400/20 text-center mb-8">
            <p className="text-red-200 mb-4">{error}</p>
            <button 
              onClick={() => activeTab === 'available' ? fetchAvailablePreorders() : fetchMyPreorders()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonLoader type="card" count={8} />
          </div>
        ) : displayPreorders.length === 0 ? (
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20" data-aos="fade-up">
            <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {activeTab === 'available' ? 'No Pre-Orders Available' : 'No Pre-Orders Yet'}
            </h2>
            <p className="text-green-200 mb-6">
              {activeTab === 'available' 
                ? 'Check back later for new pre-order opportunities.' 
                : 'Start pre-ordering to secure your harvest.'}
            </p>
            {activeTab === 'my' && (
              <Link to="/preorders">
                <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                  Browse Available Pre-Orders
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-green-200 mb-6">
              Showing <span className="text-white font-semibold">{displayPreorders.length}</span> pre-order{displayPreorders.length > 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayPreorders.map((preorder, index) => (
                <div key={preorder.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <PreOrderCard 
                    preorder={preorder} 
                    type={activeTab === 'available' ? 'available' : 'my'}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreOrders;