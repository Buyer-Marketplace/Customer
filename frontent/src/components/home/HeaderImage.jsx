import React from 'react';

const HeaderImage = ({ src, alt, gradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950" }) => {
  const [imageError, setImageError] = React.useState(false);
  
  // Fallback image if the provided one fails
  const fallbackSrc = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600";

  return (
    <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
      <img 
        src={imageError ? fallbackSrc : src}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={() => setImageError(true)}
      />
      <div className={`absolute inset-0 ${gradient}`}></div>
    </div>
  );
};

export default HeaderImage;