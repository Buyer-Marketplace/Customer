import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  IoArrowBack, 
  IoLocationOutline, 
  IoNavigateOutline, 
  IoTimeOutline,
  IoCarOutline,
  IoLeaf,
  IoWarningOutline,
  IoClose
} from 'react-icons/io5';
import { FiMapPin } from 'react-icons/fi'; // Remove FiRoute - doesn't exist
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Egerton University coordinates
const EGERTON_COORDS = {
  lat: -0.3695,
  lng: 35.9380
};

const Location = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchAddress, setSearchAddress] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [travelMode, setTravelMode] = useState('DRIVING');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return distance;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  // Calculate estimated duration based on travel mode
  const calculateDuration = (distance, mode) => {
    const speeds = {
      DRIVING: 50, // km/h average
      WALKING: 5,  // km/h average
      BICYCLING: 15 // km/h average
    };
    
    const hours = distance / speeds[mode];
    const minutes = Math.round(hours * 60);
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hrs} hr ${mins} min`;
    }
  };

  // Get user's current location
  const getUserLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          
          // Calculate distance
          const dist = calculateDistance(
            userPos.lat, userPos.lng,
            EGERTON_COORDS.lat, EGERTON_COORDS.lng
          );
          setDistance(dist.toFixed(2));
          
          // Calculate duration
          const dur = calculateDuration(dist, travelMode);
          setDuration(dur);
          
          setLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Please enable location services or enter an address.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  // Handle travel mode change
  const handleModeChange = (mode) => {
    setTravelMode(mode);
    if (userLocation) {
      const dist = calculateDistance(
        userLocation.lat, userLocation.lng,
        EGERTON_COORDS.lat, EGERTON_COORDS.lng
      );
      const dur = calculateDuration(dist, mode);
      setDuration(dur);
    }
  };

  // Handle address search (simplified - in production use Google Geocoding API)
  const handleAddressSearch = () => {
    if (!searchAddress.trim()) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate geocoding - in production, use actual geocoding API
    setTimeout(() => {
      // Mock coordinates for demo (Nairobi area)
      const mockCoords = {
        lat: -1.2921,
        lng: 36.8219
      };
      
      setUserLocation(mockCoords);
      
      const dist = calculateDistance(
        mockCoords.lat, mockCoords.lng,
        EGERTON_COORDS.lat, EGERTON_COORDS.lng
      );
      setDistance(dist.toFixed(2));
      
      const dur = calculateDuration(dist, travelMode);
      setDuration(dur);
      
      setLoading(false);
    }, 1500);
  };

  // Format coordinates for display
  const formatCoordinates = (coords) => {
    if (!coords) return '';
    return `${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E`;
  };

  // Get Google Maps URL for directions
  const getDirectionsUrl = () => {
    if (!userLocation) return '#';
    return `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${EGERTON_COORDS.lat},${EGERTON_COORDS.lng}`;
  };

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1577086664693-894d8405334a?auto=format&fit=crop&q=80&w=1600"
          alt="Map location"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-950/30 to-green-950"></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">OUR LOCATION</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Find your way to Egerton University
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 pb-16">
        {/* Back Button */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20 transition-all duration-300">
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Location Info & Controls */}
          <div className="space-y-6" data-aos="fade-right">
            {/* Destination Card */}
            <div className="bg-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center">
                  <IoLocationOutline className="text-green-400 text-xl" />
                </div>
                <h2 className="text-xl font-bold text-white">Destination</h2>
              </div>
              
              <div className="bg-green-950/50 rounded-xl p-4 mb-4">
                <p className="text-white font-semibold">Egerton University</p>
                <p className="text-sm text-green-300 mt-1">Nakuru, Kenya</p>
                <p className="text-xs text-green-400/70 mt-2 font-mono">
                  {formatCoordinates(EGERTON_COORDS)}
                </p>
              </div>

              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                {showInfo ? 'Hide details' : 'Show details'}
              </button>

              {showInfo && (
                <div className="mt-4 p-4 bg-green-950/50 rounded-xl border border-green-800/50">
                  <h3 className="text-white font-semibold mb-2">About Egerton University</h3>
                  <p className="text-sm text-green-200 leading-relaxed">
                    Egerton University is one of Kenya's oldest institutions of higher learning, 
                    located in Njoro, Nakuru County. It's renowned for its agricultural research 
                    and training programs, established in 1939.
                  </p>
                </div>
              )}
            </div>

            {/* Your Location Card */}
            <div className="bg-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center">
                  <FiMapPin className="text-green-400 text-xl" />
                </div>
                <h2 className="text-xl font-bold text-white">Your Location</h2>
              </div>

              {!userLocation ? (
                <div className="text-center py-4">
                  <p className="text-green-200 mb-4">
                    Click the button below to get your current location or enter an address.
                  </p>
                  <Button
                    onClick={getUserLocation}
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700 text-white w-full mb-3"
                    loading={loading}
                  >
                    <IoNavigateOutline className="mr-2" />
                    Get My Location
                  </Button>

                  <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-green-800"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-green-950 text-green-300">OR</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter address..."
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      className="flex-1 bg-green-950/60 text-sm"
                    />
                    <Button
                      onClick={handleAddressSearch}
                      variant="secondary"
                      className="bg-green-700 hover:bg-green-600"
                      loading={loading}
                    >
                      Go
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="bg-green-950/50 rounded-xl p-4 mb-4">
                    <p className="text-sm text-green-300">Your position:</p>
                    <p className="text-xs text-green-400/70 font-mono mt-1">
                      {formatCoordinates(userLocation)}
                    </p>
                  </div>

                  {/* Travel Mode Selector */}
                  <div className="mb-4">
                    <label className="block text-sm text-green-200 mb-2">Travel Mode:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { mode: 'DRIVING', icon: '🚗', label: 'Driving' },
                        { mode: 'WALKING', icon: '🚶', label: 'Walking' },
                        { mode: 'BICYCLING', icon: '🚲', label: 'Bicycling' }
                      ].map(({ mode, icon, label }) => (
                        <button
                          key={mode}
                          onClick={() => handleModeChange(mode)}
                          className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors flex flex-col items-center ${
                            travelMode === mode
                              ? 'bg-green-600 text-white'
                              : 'bg-green-800/50 text-green-300 hover:bg-green-700/50'
                          }`}
                        >
                          <span className="text-lg mb-1">{icon}</span>
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={getUserLocation}
                      variant="outline"
                      className="flex-1 border-green-400 text-green-300 hover:bg-green-800/30"
                    >
                      Update
                    </Button>
                    <a
                      href={getDirectionsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="primary"
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        Get Directions
                      </Button>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Distance & Duration Cards - using IoTimeOutline for both */}
            {distance && duration && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 border border-green-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <IoCarOutline className="text-green-400 text-lg" />
                    <p className="text-xs text-green-300">Distance</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{distance} km</p>
                </div>

                <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 border border-green-400/20">
                  <div className="flex items-center gap-2 mb-2">
                    <IoTimeOutline className="text-green-400 text-lg" />
                    <p className="text-xs text-green-300">Duration</p>
                  </div>
                  <p className="text-2xl font-bold text-white">{duration}</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-4 border border-red-400/20">
                <div className="flex items-start gap-2">
                  <IoWarningOutline className="text-red-400 text-xl flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Map Preview */}
          <div className="lg:col-span-1" data-aos="fade-left">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-2xl p-6 border border-green-400/20 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center">
                  <IoCarOutline className="text-green-400 text-xl" />
                </div>
                <h2 className="text-xl font-bold text-white">Route Preview</h2>
              </div>

              {/* Static Map Image (using Google Maps Static API) */}
              {userLocation ? (
                <div className="relative">
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?size=600x400&scale=2&maptype=roadmap&markers=color:green%7Clabel:D%7C${EGERTON_COORDS.lat},${EGERTON_COORDS.lng}&markers=color:red%7Clabel:A%7C${userLocation.lat},${userLocation.lng}&path=color:0x10b981%7Cweight:5%7C${userLocation.lat},${userLocation.lng}%7C${EGERTON_COORDS.lat},${EGERTON_COORDS.lng}&key=YOUR_GOOGLE_MAPS_API_KEY`}
                    alt="Route map"
                    className="w-full h-64 object-cover rounded-xl mb-4"
                  />
                  
                  {/* Map Legend */}
                  <div className="flex items-center justify-center gap-6 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-green-300">Your Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-green-300">Destination</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-0.5 bg-green-400"></div>
                      <span className="text-green-300">Route</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 bg-green-950/50 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <IoLocationOutline className="text-green-400 text-4xl mx-auto mb-2 opacity-50" />
                    <p className="text-green-300 text-sm">Enter your location to see the route</p>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="mt-4 p-4 bg-green-950/50 rounded-xl">
                <h3 className="text-white font-semibold mb-2">Travel Information</h3>
                <ul className="space-y-2 text-sm text-green-200">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Egerton University is approximately 180 km from Nairobi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>The main campus is in Njoro, about 20 km from Nakuru town</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    <span>Public transport: Matatus from Nakuru to Njoro available</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;