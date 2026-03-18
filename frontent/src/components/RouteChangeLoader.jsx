import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from './ui/Loader';

const RouteChangeLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    
    // Small delay to show loader on route change
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[60] pointer-events-none">
      {/* Mini progress bar at top */}
      <div className="h-1 bg-green-900/30 w-full">
        <div className="h-full bg-gradient-to-r from-green-400 to-green-600 animate-loading-bar"></div>
      </div>
      
      {/* Optional: Floating mini loader for mobile */}
      <div className="fixed bottom-4 right-4 md:hidden">
        <div className="bg-green-900/90 backdrop-blur-md rounded-full p-3 shadow-lg border border-green-400/30">
          <Loader size="sm" showLogo={true} withSpinner={true} />
        </div>
      </div>
    </div>
  );
};

export default RouteChangeLoader;