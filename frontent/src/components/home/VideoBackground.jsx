import React, { useEffect, useRef, useState } from 'react';

const VideoBackground = ({ 
  videoSources = [],
  poster,
  children,
  autoPlay = true,
  muted = true,
  loop = true,
  playsInline = true,
  className = "",
  onError
}) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef(null);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSources.length) return;

    const handleError = () => {
      if (currentSourceIndex < videoSources.length - 1) {
        setCurrentSourceIndex(prev => prev + 1);
        setLoaded(false);
      } else {
        setError(true);
        if (onError) onError();
      }
    };

    const handleCanPlay = () => {
      setLoaded(true);
      if (autoPlay) {
        video.play().catch(() => {});
      }
    };

    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);
    video.load();

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [videoSources, autoPlay, currentSourceIndex, onError]);

  if (error || !videoSources.length) {
    return (
      <img
        src={poster}
        alt="Fallback"
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        poster={poster}
      >
        <source 
          src={videoSources[currentSourceIndex]?.src} 
          type={videoSources[currentSourceIndex]?.type || 'video/mp4'} 
        />
      </video>
      {children}
    </>
  );
};

export default VideoBackground;