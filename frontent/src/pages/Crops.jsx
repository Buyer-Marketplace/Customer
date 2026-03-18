import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCrops } from '../context/CropContext';
import CropCard from '../components/crop/CropCard';
import Loader, { SkeletonLoader } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { 
  IoSearch, 
  IoLeaf,
  IoArrowBack
} from 'react-icons/io5';
import { FiPlay, FiPause } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages, videoSources } from '../constants/homeConstants';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Crops = () => {
  const { crops, loading } = useCrops();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCrops, setFilteredCrops] = useState([]);
  
  // Video states
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  // Video handling with multiple source fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      setVideoError(false);
      
      // Try to play
      video.play()
        .then(() => {
          setVideoPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay prevented:", err);
          setVideoPlaying(false);
        });
    };

    const handleError = () => {
      // Try next source if available
      if (currentSourceIndex < videoSources.crops.length - 1) {
        setCurrentSourceIndex(prev => prev + 1);
        setVideoLoaded(false);
      } else {
        setVideoError(true);
        setVideoPlaying(false);
        console.log("All video sources failed");
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Load the video
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.pause();
    };
  }, [currentSourceIndex, videoError]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading video when visible
            setCurrentSourceIndex(0);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [videoError]);

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      setFilteredCrops(
        crops.filter(crop => 
          crop.crop_name.toLowerCase().includes(term) ||
          crop.description?.toLowerCase().includes(term)
        )
      );
    } else {
      setFilteredCrops(crops);
    }
  }, [searchTerm, crops]);

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

  return (
    <div className="min-h-screen bg-green-950">
      {/* Video Header Section */}
      <div ref={sectionRef} className="relative w-full h-80 overflow-hidden">
        {!videoError ? (
          <div className="absolute inset-0">
            {/* Show poster while loading */}
            {!videoLoaded && (
              <img 
                src={headerImages.crops} 
                alt="All Crops" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              poster={headerImages.crops}
              onError={handleVideoError}
            >
              <source 
                src={videoSources.crops[currentSourceIndex]} 
                type="video/mp4" 
              />
            </video>
          </div>
        ) : (
          <img 
            src={headerImages.crops} 
            alt="All Crops" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <div className={`absolute inset-0 ${headerGradient}`}></div>

        {/* Play/Pause Button - only show when video is loaded */}
        {!videoError && videoLoaded && (
          <button
            onClick={toggleVideoPlay}
            className="absolute z-20 p-3 text-white transition-all border rounded-full bottom-6 right-6 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20"
            aria-label={videoPlaying ? 'Pause video' : 'Play video'}
          >
            {videoPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
          </button>
        )}
        
        {/* Header Content - always visible */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">ALL CROPS</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Browse all available crop types
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

        {/* Search */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 mb-8" data-aos="fade-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={18} />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonLoader type="card" count={8} />
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20">
            <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Crops Found</h3>
            <p className="text-green-200 mb-6">Try a different search term</p>
            <Button 
              variant="primary" 
              onClick={() => setSearchTerm('')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            <p className="text-green-200 mb-6">
              Showing <span className="text-white font-semibold">{filteredCrops.length}</span> crops
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCrops.map((crop, index) => (
                <Link 
                  key={crop.id}
                  to={`/crops/${crop.id}`}
                  className="block"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="bg-green-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all p-4">
                    <img 
                      src={crop.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400'} 
                      alt={crop.crop_name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <h3 className="text-lg font-semibold text-white">{crop.crop_name}</h3>
                    <p className="text-sm text-green-300 line-clamp-2 mt-1">{crop.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-green-400 font-bold">KES {crop.price_per_kg}/kg</span>
                      <span className="text-xs text-green-200/70">View Items →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Crops;