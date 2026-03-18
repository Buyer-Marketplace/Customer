import React, { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  lowResSrc, 
  className = '', 
  width, 
  height,
  lazyLoad = true,
  onLoad 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef();
  const observerRef = useRef();

  useEffect(() => {
    if (!lazyLoad) {
      loadImage();
      return;
    }

    // Use Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage();
          observerRef.current?.disconnect();
        }
      });
    }, {
      rootMargin: '50px', // Start loading when image is 50px from viewport
      threshold: 0.01
    });

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [lazyLoad]);

  const loadImage = () => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoaded(true);
      onLoad?.();
    };
    img.onerror = () => setError(true);
  };

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Low resolution placeholder */}
      {lowResSrc && !loaded && !error && (
        <img
          src={lowResSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-sm scale-105"
          style={{ filter: 'blur(10px)' }}
        />
      )}

      {/* Actual image */}
      {(loaded || !lazyLoad) && !error && (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={lazyLoad ? 'lazy' : 'eager'}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="w-full h-full bg-green-800/50 flex items-center justify-center">
          <span className="text-green-300 text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;