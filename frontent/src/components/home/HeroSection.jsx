import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiSun, FiPlay, FiPause } from 'react-icons/fi';
import { IoLeaf } from 'react-icons/io5';
import Typewriter from 'typewriter-effect';
import Button from '../ui/Button';
import { headerImages, typingPhrases, videoSources } from '../../constants/homeConstants';

const HeroSection = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [useVideo, setUseVideo] = useState(true);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  // Check for data saver and mobile - disable video on slow connections
  useEffect(() => {
    const isDataSaver = navigator.connection?.saveData === true;
    const isSlowConnection = navigator.connection?.effectiveType === '2g';
    const isMobile = window.innerWidth < 768;
    
    // Don't use video on slow connections or data saver mode
    if (isDataSaver || isSlowConnection || (isMobile && navigator.connection?.effectiveType === '3g')) {
      setUseVideo(false);
    }
  }, []);

  // Optimized video loading with Intersection Observer
  useEffect(() => {
    if (!useVideo || !videoRef.current) return;

    const video = videoRef.current;
    
    // Preload just the first frame (poster is already set)
    video.preload = 'metadata'; // Only load metadata initially
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // When section is visible, load the video
            video.preload = 'auto';
            
            // Use the most reliable source first
            const heroVideoSources = videoSources.hero;
            
            // Try the first source that's most likely to work
            const primarySource = heroVideoSources.find(src => 
              src.includes('storage.googleapis.com') || src.includes('gtv-videos')
            ) || heroVideoSources[0];
            
            video.src = primarySource;
            video.load();
            
            observer.disconnect();
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '200px' // Start loading when 200px from viewport
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, [useVideo]);

  // Handle video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !useVideo) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      // Try to play automatically
      video.play()
        .then(() => {
          setVideoPlaying(true);
          setVideoError(false);
        })
        .catch(err => {
          console.log("AutoPlay prevented:", err);
          setVideoPlaying(false);
        });
    };

    const handleError = (e) => {
      console.log("Video error, falling back to image");
      setVideoError(true);
      setUseVideo(false);
    };

    const handleLoadedData = () => {
      setVideoLoaded(true);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [useVideo]);

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

  return (
    <div ref={sectionRef} className="relative h-screen min-h-[800px] overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        {useVideo && !videoError ? (
          <>
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              poster={headerImages.hero}
              preload="metadata" // Start with metadata only
            />
            {/* Show poster while video loads */}
            {!videoLoaded && (
              <img 
                src={headerImages.hero} 
                alt="Farm landscape" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </>
        ) : (
          <img 
            src={headerImages.hero} 
            alt="Farm landscape" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/80 to-transparent"></div>
      </div>

      {/* Play/Pause Button - only show when video is loaded and no error */}
      {useVideo && !videoError && videoLoaded && (
        <button
          onClick={toggleVideoPlay}
          className="absolute z-20 p-4 text-white transition-all border rounded-full top-6 right-6 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20"
          aria-label={videoPlaying ? 'Pause video' : 'Play video'}
        >
          {videoPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
        </button>
      )}

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="w-full px-6 mx-auto max-w-7xl">
          <div className="max-w-4xl" data-aos="fade-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-green-600/20 backdrop-blur-sm rounded-full border border-green-400/30">
              <IoLeaf className="text-green-400" size={20} />
              <span className="text-green-100 text-sm font-medium">Farm Direct • 100% Organic</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
              Fresh From Farm
              <span className="block text-4xl md:text-6xl text-green-300 mt-2">
                <Typewriter
                  options={{
                    strings: typingPhrases,
                    autoStart: true,
                    loop: true,
                    wrapperClassName: "font-extrabold",
                    cursorClassName: "text-green-400",
                    delay: 30, // Faster typing
                    deleteSpeed: 20 // Faster deleting
                  }}
                />
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-200 max-w-2xl leading-relaxed">
              We connect local farmers directly to your table, ensuring unmatched freshness 
              and fair pricing for everyone involved.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/marketplace">
                <Button variant="primary" size="lg" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30">
                  START EXPLORING
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>

            <div className="flex gap-6 mt-12">
              <div className="flex items-center gap-2">
                <FiShield className="text-green-400" />
                <span className="text-sm text-gray-300">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <FiTruck className="text-green-400" />
                <span className="text-sm text-gray-300">Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <FiSun className="text-green-400" />
                <span className="text-sm text-gray-300">Farm Fresh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute -translate-x-1/2 left-1/2 bottom-8 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-green-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;