import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCrops } from '../context/CropContext';
import { useCart } from '../context/CartContext';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { IoArrowBack, IoLeaf, IoCartOutline, IoTimeOutline } from 'react-icons/io5';
import { FiPlay, FiPause } from 'react-icons/fi';
import { GiFarmer } from 'react-icons/gi';
import { FiMapPin } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages, videoSources } from '../constants/homeConstants';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const CropDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { 
    selectedCrop, 
    cropItems, 
    loading, 
    error, 
    fetchCropById,
    getPriceRange,
    getUpcomingHarvests 
  } = useCrops();

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
    if (id) {
      fetchCropById(id);
    }
  }, [id, fetchCropById]);

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

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.crop_name,
      price: item.price_per_kg,
      unit: 'kg',
      availableQuantity: item.available_quantity_kg,
      images: [item.image_url],
      farmer: { name: item.farmer_name },
    }, 1);
  };

  const handleBuyNow = (item) => {
    // Store selected item in localStorage for checkout
    localStorage.setItem('selectedListing', JSON.stringify(item));
    navigate('/checkout', { state: { listing: item } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" showLogo={true} text="Loading crop details..." withSpinner={true} />
      </div>
    );
  }

  if (error || !selectedCrop) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
          <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Crop Not Found</h2>
          <p className="text-green-200 mb-6">The crop you're looking for doesn't exist.</p>
          <Link to="/crops">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
              Back to Crops
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const priceRange = getPriceRange();
  const upcomingHarvests = getUpcomingHarvests(30);

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
              poster={selectedCrop.image_url || headerImages.crops}
              onError={handleVideoError}
              onLoadedData={() => setVideoLoaded(true)}
            >
              {videoSources.crops.map((src, index) => (
                <source key={index} src={src} type="video/mp4" />
              ))}
            </video>
            
            {/* Show fallback image while video loads */}
            {!videoLoaded && (
              <img 
                src={selectedCrop.image_url || headerImages.crops} 
                alt={selectedCrop.crop_name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <img 
            src={selectedCrop.image_url || headerImages.crops} 
            alt={selectedCrop.crop_name}
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

      <div className="container-custom py-8 -mt-20 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/crops" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Back to Crops
          </Link>
        </div>

        {/* Crop Info */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-green-400/20 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image */}
            <div className="md:w-1/3">
              <img 
                src={selectedCrop.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600'} 
                alt={selectedCrop.crop_name}
                className="w-full h-64 object-cover rounded-2xl"
              />
            </div>

            {/* Details */}
            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedCrop.crop_name}</h1>
              <p className="text-green-200 text-lg mb-4">{selectedCrop.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-950/50 rounded-xl p-3">
                  <p className="text-xs text-green-300">Price Range</p>
                  <p className="text-xl font-bold text-green-400">
                    KES {priceRange.min} - {priceRange.max}/kg
                  </p>
                </div>
                <div className="bg-green-950/50 rounded-xl p-3">
                  <p className="text-xs text-green-300">Available Items</p>
                  <p className="text-xl font-bold text-white">{cropItems.length}</p>
                </div>
                <div className="bg-green-950/50 rounded-xl p-3">
                  <p className="text-xs text-green-300">Maturity</p>
                  <p className="text-xl font-bold text-white">{selectedCrop.total_maturity_days || 90} days</p>
                </div>
                <div className="bg-green-950/50 rounded-xl p-3">
                  <p className="text-xs text-green-300">Yield/Acre</p>
                  <p className="text-xl font-bold text-white">{selectedCrop.baseline_yield_per_acre || 1000} kg</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Items */}
        <h2 className="text-2xl font-bold text-white mb-6" data-aos="fade-up">
          Available {selectedCrop.crop_name} from Farmers
        </h2>

        {cropItems.length === 0 ? (
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 text-center border border-green-400/20">
            <p className="text-green-200 text-lg">No active listings for this crop at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropItems.map((item, index) => (
              <div 
                key={item.id}
                className="bg-green-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="p-5">
                  {/* Farmer Info */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-green-700/30 rounded-full flex items-center justify-center">
                      <GiFarmer className="text-green-400" size={18} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.farmer_name}</p>
                      <div className="flex items-center gap-1 text-xs text-green-300">
                        <FiMapPin size={10} />
                        <span>{item.region_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-green-300">Price:</span>
                      <span className="text-white font-bold">KES {item.price_per_kg}/kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-300">Available:</span>
                      <span className="text-white">{item.available_quantity_kg} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-300">Harvest:</span>
                      <span className="text-white">
                        {new Date(item.expected_harvest_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <Badge variant={item.listing_status === 'Active' ? 'success' : 'default'}>
                      {item.listing_status}
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 border-2 border-green-400 text-green-300 hover:bg-green-800/30"
                      disabled={item.listing_status !== 'Active'}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleBuyNow(item)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      disabled={item.listing_status !== 'Active'}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Harvests */}
        {upcomingHarvests.length > 0 && (
          <>
            <h2 className="text-2xl font-bold text-white mt-12 mb-6" data-aos="fade-up">
              Upcoming Harvests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingHarvests.map((item, index) => (
                <div 
                  key={item.id}
                  className="bg-yellow-900/30 backdrop-blur-sm rounded-xl p-5 border border-yellow-400/20"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <IoTimeOutline className="text-yellow-400" size={20} />
                    <span className="text-yellow-300 text-sm">
                      Harvest: {new Date(item.expected_harvest_date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-white font-medium">{item.farmer_name}</p>
                  <p className="text-yellow-400 mt-2">KES {item.price_per_kg}/kg</p>
                  <p className="text-yellow-300 text-sm mt-1">{item.region_name}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CropDetailsPage;