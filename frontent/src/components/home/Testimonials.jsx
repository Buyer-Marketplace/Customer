import React, { useEffect, useState, useRef, Suspense } from 'react';
import { FiStar, FiMapPin, FiPlay, FiPause } from 'react-icons/fi';
import SectionHeader from './SectionHeader';
import { headerImages, testimonials, videoSources } from '../../constants/homeConstants';

// Lazy load the video background component
const VideoBackground = React.lazy(() => import('./VideoBackground'));

const Testimonials = () => {
  const [useVideo, setUseVideo] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  // Check for data saver and mobile
  useEffect(() => {
    const isDataSaver = navigator.connection?.saveData === true;
    const isSlowConnection = navigator.connection?.effectiveType === '2g';
    
    if (isDataSaver || isSlowConnection) {
      setUseVideo(false);
    }
  }, []);

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

  // Convert array of video strings to objects with src and type
  const testimonialVideoSources = videoSources.testimonial.map(src => ({
    src,
    type: 'video/mp4'
  }));

  return (
    <section className="py-20">
      {/* Header Video/Image Area */}
      <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
        {useVideo && !videoError ? (
          <Suspense fallback={
            <img 
              src={headerImages.testimonials} 
              alt="Happy customers at market" 
              className="w-full h-full object-cover"
            />
          }>
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                muted
                loop
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
                poster={headerImages.testimonials}
                onError={() => setVideoError(true)}
              >
                {testimonialVideoSources.map((source, index) => (
                  <source key={index} src={source.src} type={source.type} />
                ))}
              </video>
              
              {/* Play/Pause Button */}
              <button
                onClick={toggleVideoPlay}
                className="absolute z-20 p-3 text-white transition-all border rounded-full top-4 right-4 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20 opacity-70 hover:opacity-100"
                aria-label={videoPlaying ? 'Pause video' : 'Play video'}
              >
                {videoPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
              </button>
            </div>
          </Suspense>
        ) : (
          <img 
            src={headerImages.testimonials} 
            alt="Happy customers at market" 
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/30 to-green-950"></div>
      </div>
      
      {/* Testimonials Content */}
      <div className="container-custom">
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
          <SectionHeader title="WHAT OUR CUSTOMERS SAY" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id} 
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-green-400/30 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-green-400"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="flex items-center gap-1 text-sm text-green-300">
                      <FiMapPin className="w-3 h-3" />
                      {testimonial.location}
                    </div>
                  </div>
                </div>
                <p className="text-green-100 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;