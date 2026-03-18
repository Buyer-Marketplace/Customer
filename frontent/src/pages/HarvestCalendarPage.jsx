import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useHarvestCalendar } from '../hooks/useHarvestCalendar';
import CalendarCard from '../components/calendar/CalendarCard';
import MonthGrid from '../components/calendar/MonthGrid';
import Button from '../components/ui/Button';
import Loader, { SkeletonLoader } from '../components/ui/Loader';
import { 
  IoArrowBack, 
  IoLeaf,
  IoChevronBack,
  IoChevronForward,
  IoCalendarOutline,
  IoSunnyOutline
} from 'react-icons/io5';
import { FiPlay, FiPause } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages, videoSources } from '../constants/homeConstants';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const HarvestCalendarPage = () => {
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'
  const [selectedHarvestDate, setSelectedHarvestDate] = useState(null);
  
  // Video states
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  
  const { 
    loading, 
    error, 
    selectedDate,
    monthlyData,
    getHarvestEventsForDate,
    getUpcomingHarvests,
    getHarvestSummary,
    changeMonth,
    setSelectedDate
  } = useHarvestCalendar();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
      offset: 20,
      easing: 'ease-out',
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

  const handleDateClick = (date) => {
    setSelectedHarvestDate(date);
    setView('list');
  };

  const handleMonthChange = (direction) => {
    changeMonth(direction);
    setSelectedHarvestDate(null);
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

  const summary = getHarvestSummary();
  const upcomingHarvests = getUpcomingHarvests(30);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" showLogo={true} text="Loading harvest calendar..." withSpinner={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Video Header Section - Optimized for fast loading */}
      <div ref={sectionRef} className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden">
        {!videoError ? (
          <div className="absolute inset-0">
            {/* Show poster immediately while video loads */}
            <img 
              src={headerImages.crops} 
              alt="Harvest Calendar" 
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              poster={headerImages.crops}
              onError={handleVideoError}
              preload="metadata"
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
            alt="Harvest Calendar" 
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        )}
        
        <div className={`absolute inset-0 ${headerGradient}`}></div>

        {/* Play/Pause Button - only show when video is loaded */}
        {!videoError && videoLoaded && (
          <button
            onClick={toggleVideoPlay}
            className="absolute z-20 p-2 sm:p-3 text-white transition-all border rounded-full bottom-3 sm:bottom-4 right-3 sm:right-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20"
            aria-label={videoPlaying ? 'Pause video' : 'Play video'}
          >
            {videoPlaying ? <FiPause className="w-3 h-3 sm:w-4 sm:h-4" /> : <FiPlay className="w-3 h-3 sm:w-4 sm:h-4" />}
          </button>
        )}
        
        {/* Header Content - Responsive text sizing */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center text-white z-10" data-aos="fade-down">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4">
              HARVEST CALENDAR
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-green-200 max-w-2xl px-4">
              Plan your purchases with our seasonal harvest guide
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-5 md:mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-xs sm:text-sm md:text-base text-green-300 hover:text-green-100">
            <IoArrowBack className="mr-1 sm:mr-2" size={14} />
            Back to Home
          </Link>
        </div>

        {/* Stats Cards - Responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-7 md:mb-8" data-aos="fade-up">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center border border-green-400/20">
            <IoSunnyOutline className="text-green-400 text-base sm:text-lg md:text-xl lg:text-2xl mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-300">{summary.totalHarvests}</div>
            <div className="text-[10px] sm:text-xs text-green-200/70">Total Harvests</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center border border-green-400/20">
            <IoCalendarOutline className="text-green-400 text-base sm:text-lg md:text-xl lg:text-2xl mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-300">{summary.upcomingHarvests}</div>
            <div className="text-[10px] sm:text-xs text-green-200/70">Upcoming (30d)</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center border border-green-400/20">
            <IoLeaf className="text-green-400 text-base sm:text-lg md:text-xl lg:text-2xl mx-auto mb-1 sm:mb-2" />
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-300">{summary.thisMonth}</div>
            <div className="text-[10px] sm:text-xs text-green-200/70">This Month</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center border border-green-400/20">
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-300">
              {selectedDate.toLocaleDateString('default', { month: 'short' })}
            </div>
            <div className="text-[10px] sm:text-xs text-green-200/70">Current Month</div>
          </div>
        </div>

        {/* View Toggle - Responsive */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-1 sm:p-1.5 border border-green-400/20 mb-6 sm:mb-7 md:mb-8 inline-flex" data-aos="fade-up">
          <button
            onClick={() => setView('calendar')}
            className={`px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap ${
              view === 'calendar'
                ? 'bg-green-600 text-white'
                : 'text-green-300 hover:text-white hover:bg-green-800/30'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all duration-300 whitespace-nowrap ${
              view === 'list'
                ? 'bg-green-600 text-white'
                : 'text-green-300 hover:text-white hover:bg-green-800/30'
            }`}
          >
            List View
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-red-400/20 text-center mb-6 sm:mb-7 md:mb-8">
            <p className="text-xs sm:text-sm md:text-base text-red-200 mb-3 sm:mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Main Content */}
        {view === 'calendar' ? (
          <>
            {/* Month Navigation - Responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6" data-aos="fade-up">
              <div className="flex w-full sm:w-auto gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleMonthChange(-1)}
                  className="flex-1 sm:flex-initial border-2 border-green-400 text-green-300 hover:bg-green-800/30 text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  <IoChevronBack className="mr-1 sm:mr-2" size={14} />
                  <span className="hidden xs:inline">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDate(new Date())}
                  className="flex-1 sm:flex-initial border-2 border-green-400 text-green-300 hover:bg-green-800/30 text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleMonthChange(1)}
                  className="flex-1 sm:flex-initial border-2 border-green-400 text-green-300 hover:bg-green-800/30 text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  <span className="hidden xs:inline">Next</span>
                  <IoChevronForward className="ml-1 sm:ml-2" size={14} />
                </Button>
              </div>
            </div>

            {/* Calendar Grid - Responsive */}
            <MonthGrid
              selectedDate={selectedDate}
              monthlyData={monthlyData}
              onDateClick={handleDateClick}
              getHarvestEventsForDate={getHarvestEventsForDate}
            />
          </>
        ) : (
          <>
            {/* List View Header - Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-5 md:mb-6" data-aos="fade-up">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {selectedHarvestDate 
                  ? `Harvests on ${selectedHarvestDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}`
                  : 'Upcoming Harvests (30 days)'
                }
              </h2>
              {selectedHarvestDate && (
                <Button
                  variant="outline"
                  onClick={() => setSelectedHarvestDate(null)}
                  className="border-2 border-green-400 text-green-300 hover:bg-green-800/30 text-xs sm:text-sm py-1.5 sm:py-2"
                >
                  View All
                </Button>
              )}
            </div>

            {/* Harvest List - Responsive */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                <SkeletonLoader type="card" count={6} />
              </div>
            ) : selectedHarvestDate ? (
              <div className="space-y-3 sm:space-y-4">
                {getHarvestEventsForDate(selectedHarvestDate).length > 0 ? (
                  getHarvestEventsForDate(selectedHarvestDate).map((harvest, index) => (
                    <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                      <CalendarCard 
                        harvest={[harvest]} 
                        date={selectedHarvestDate}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-10 md:py-12 bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-400/20">
                    <IoLeaf className="text-green-400 text-4xl sm:text-5xl md:text-6xl mx-auto mb-2 sm:mb-3" />
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">No Harvests Scheduled</h3>
                    <p className="text-xs sm:text-sm text-green-200">
                      There are no harvests scheduled for this date.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {upcomingHarvests.length > 0 ? (
                  upcomingHarvests.map((item, index) => (
                    <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                      <CalendarCard 
                        harvest={item.harvests} 
                        date={item.date}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 sm:py-10 md:py-12 bg-green-900/30 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-green-400/20">
                    <IoLeaf className="text-green-400 text-4xl sm:text-5xl md:text-6xl mx-auto mb-2 sm:mb-3" />
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1 sm:mb-2">No Upcoming Harvests</h3>
                    <p className="text-xs sm:text-sm text-green-200">
                      There are no harvests scheduled in the next 30 days.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HarvestCalendarPage;