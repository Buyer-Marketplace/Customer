import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { 
  IoCalendarOutline, 
  IoArrowForward,
  IoTimeOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import { GiPlantWatering, GiFruitTree, GiSunflower } from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// USING THE SAME WORKING IMAGES FROM YOUR HOME PAGE
const headerImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600"; // Same as hero fallback

// EXACT SAME GRADIENT OVERLAY as Home page - this creates the smooth blend
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const HarvestCalendar = () => {
  // Get current date for default selection
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [imageError, setImageError] = useState(false);
  
  // Fallback images array
  const fallbackImages = [
    "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600",
    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1600"
  ];

  const [currentImage, setCurrentImage] = useState(headerImage);
  const [fallbackIndex, setFallbackIndex] = useState(0);

  const handleImageError = () => {
    if (fallbackIndex < fallbackImages.length - 1) {
      // Try next fallback image
      setFallbackIndex(prev => prev + 1);
      setCurrentImage(fallbackImages[fallbackIndex + 1]);
    } else {
      setImageError(true);
    }
  };
  
  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years from current year to current year + 2
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1, currentYear + 2];

  // Realistic harvest data for East African crops
  const harvestData = {
    [currentYear]: {
      0: { // January
        crops: [
          { name: 'Kale (Sukuma Wiki)', status: 'in-season', farms: ['Green Valley', 'Highlands Farm', 'Nakuru Growers'] },
          { name: 'Spinach', status: 'in-season', farms: ['Berry Fields', 'Green Valley', 'Kiambu Farmers'] },
          { name: 'Carrots', status: 'in-season', farms: ['Highlands Farm', 'Meru Cooperative'] },
          { name: 'Cabbage', status: 'ending-soon', farms: ['Green Valley', 'Narok Farms'] },
          { name: 'Tomatoes', status: 'coming-soon', farms: ['Juja Greens', 'Kirinyaga Growers'] }
        ]
      },
      1: { // February
        crops: [
          { name: 'Tomatoes', status: 'in-season', farms: ['Green Valley', 'Highlands Farm', 'Juja Greens'] },
          { name: 'Peppers', status: 'in-season', farms: ['Berry Fields', 'Kiambu Farmers'] },
          { name: 'Kale', status: 'in-season', farms: ['Green Valley', 'Highlands Farm', 'Nakuru Growers'] },
          { name: 'Spinach', status: 'in-season', farms: ['Berry Fields', 'Kiambu Farmers'] },
          { name: 'Onions', status: 'coming-soon', farms: ['Narok Farms', 'Meru Cooperative'] }
        ]
      },
      2: { // March
        crops: [
          { name: 'Maize', status: 'coming-soon', farms: ['Highlands Farm', 'Trans-Nzoia Growers'] },
          { name: 'Beans', status: 'coming-soon', farms: ['Green Valley', 'Machakos Farmers'] },
          { name: 'Tomatoes', status: 'in-season', farms: ['Green Valley', 'Berry Fields', 'Kirinyaga Growers'] },
          { name: 'Peppers', status: 'in-season', farms: ['Berry Fields', 'Kiambu Farmers'] },
          { name: 'French Beans', status: 'in-season', farms: ['Nakuru Growers', 'Meru Cooperative'] }
        ]
      },
      3: { // April
        crops: [
          { name: 'Strawberries', status: 'in-season', farms: ['Berry Fields', 'Kinangop Berries'] },
          { name: 'Maize', status: 'in-season', farms: ['Highlands Farm', 'Trans-Nzoia Growers'] },
          { name: 'Beans', status: 'in-season', farms: ['Green Valley', 'Machakos Farmers'] },
          { name: 'Peas', status: 'coming-soon', farms: ['Highlands Farm', 'Nakuru Growers'] },
          { name: 'Snow Peas', status: 'in-season', farms: ['Meru Cooperative', 'Timau Farms'] }
        ]
      },
      4: { // May
        crops: [
          { name: 'Potatoes', status: 'in-season', farms: ['Highlands Farm', 'Molo Growers', 'Timau Farms'] },
          { name: 'Strawberries', status: 'ending-soon', farms: ['Berry Fields', 'Kinangop Berries'] },
          { name: 'Peas', status: 'in-season', farms: ['Highlands Farm', 'Nakuru Growers'] },
          { name: 'Onions', status: 'in-season', farms: ['Green Valley', 'Narok Farms'] },
          { name: 'Garlic', status: 'coming-soon', farms: ['Meru Cooperative', 'Embu Farmers'] }
        ]
      },
      5: { // June
        crops: [
          { name: 'Avocados', status: 'coming-soon', farms: ['Green Valley', 'Muranga Farmers', 'Kisii Growers'] },
          { name: 'Potatoes', status: 'in-season', farms: ['Highlands Farm', 'Molo Growers'] },
          { name: 'Onions', status: 'in-season', farms: ['Green Valley', 'Narok Farms'] },
          { name: 'Garlic', status: 'coming-soon', farms: ['Highlands Farm', 'Meru Cooperative'] },
          { name: 'Ginger', status: 'coming-soon', farms: ['Embu Farmers', 'Kisii Growers'] }
        ]
      },
      6: { // July
        crops: [
          { name: 'Avocados', status: 'in-season', farms: ['Green Valley', 'Muranga Farmers', 'Kisii Growers'] },
          { name: 'Oranges', status: 'coming-soon', farms: ['Berry Fields', 'Makueni Farmers'] },
          { name: 'Garlic', status: 'in-season', farms: ['Highlands Farm', 'Meru Cooperative'] },
          { name: 'Ginger', status: 'in-season', farms: ['Embu Farmers', 'Kisii Growers'] },
          { name: 'Passion Fruit', status: 'in-season', farms: ['Kiambu Farmers', 'Kakamega Growers'] }
        ]
      },
      7: { // August
        crops: [
          { name: 'Oranges', status: 'in-season', farms: ['Berry Fields', 'Makueni Farmers', 'Voi Growers'] },
          { name: 'Avocados', status: 'ending-soon', farms: ['Green Valley', 'Muranga Farmers'] },
          { name: 'Apples', status: 'coming-soon', farms: ['Highlands Farm', 'Timau Farms'] },
          { name: 'Pears', status: 'coming-soon', farms: ['Highlands Farm', 'Timau Farms'] },
          { name: 'Mangoes', status: 'coming-soon', farms: ['Makueni Farmers', 'Voi Growers'] }
        ]
      },
      8: { // September
        crops: [
          { name: 'Apples', status: 'in-season', farms: ['Highlands Farm', 'Timau Farms'] },
          { name: 'Pears', status: 'in-season', farms: ['Highlands Farm', 'Timau Farms'] },
          { name: 'Oranges', status: 'ending-soon', farms: ['Berry Fields', 'Makueni Farmers'] },
          { name: 'Grapes', status: 'coming-soon', farms: ['Green Valley', 'Machakos Farmers'] },
          { name: 'Mangoes', status: 'in-season', farms: ['Makueni Farmers', 'Voi Growers'] }
        ]
      },
      9: { // October
        crops: [
          { name: 'Grapes', status: 'in-season', farms: ['Green Valley', 'Machakos Farmers'] },
          { name: 'Pumpkins', status: 'in-season', farms: ['Highlands Farm', 'Kitui Growers'] },
          { name: 'Apples', status: 'ending-soon', farms: ['Highlands Farm', 'Timau Farms'] },
          { name: 'Squash', status: 'coming-soon', farms: ['Green Valley', 'Kitui Growers'] },
          { name: 'Sweet Potatoes', status: 'coming-soon', farms: ['Kakamega Growers', 'Migori Farms'] }
        ]
      },
      10: { // November
        crops: [
          { name: 'Pumpkins', status: 'ending-soon', farms: ['Highlands Farm', 'Kitui Growers'] },
          { name: 'Squash', status: 'in-season', farms: ['Green Valley', 'Kitui Growers'] },
          { name: 'Sweet Potatoes', status: 'in-season', farms: ['Kakamega Growers', 'Migori Farms'] },
          { name: 'Citrus', status: 'coming-soon', farms: ['Berry Fields', 'Makueni Farmers'] },
          { name: 'Pineapples', status: 'in-season', farms: ['Kiambu Farmers', 'Thika Growers'] }
        ]
      },
      11: { // December
        crops: [
          { name: 'Citrus', status: 'in-season', farms: ['Berry Fields', 'Makueni Farmers', 'Voi Growers'] },
          { name: 'Sweet Potatoes', status: 'ending-soon', farms: ['Highlands Farm', 'Kakamega Growers'] },
          { name: 'Kale', status: 'in-season', farms: ['Green Valley', 'Nakuru Growers'] },
          { name: 'Spinach', status: 'in-season', farms: ['Green Valley', 'Kiambu Farmers'] },
          { name: 'Mangoes', status: 'in-season', farms: ['Makueni Farmers', 'Voi Growers'] }
        ]
      }
    }
  };

  const currentData = harvestData[selectedYear]?.[selectedMonth] || { crops: [] };

  const getStatusColor = (status) => {
    switch(status) {
      case 'in-season':
        return 'text-green-400 bg-green-800/30';
      case 'coming-soon':
        return 'text-yellow-400 bg-yellow-800/30';
      case 'ending-soon':
        return 'text-orange-400 bg-orange-800/30';
      default:
        return 'text-green-300 bg-green-800/20';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'in-season':
        return 'In Season';
      case 'coming-soon':
        return 'Coming Soon';
      case 'ending-soon':
        return 'Ending Soon';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-green-950">
      {/* HEADER IMAGE SECTION - EXACT SAME STYLE AS HOME PAGE */}
      <div className="relative w-full h-96 overflow-hidden">
        {!imageError ? (
          <img 
            src={currentImage}
            alt="Harvest Calendar Banner"
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-green-800 to-green-900 flex items-center justify-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white text-center px-4">HARVEST CALENDAR</h2>
          </div>
        )}
        {/* SAME GRADIENT OVERLAY as Home page sections - creates smooth blend */}
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content - centered like home page */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">HARVEST CALENDAR</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Plan your purchases with our seasonal harvest guide. Know what's in season and when.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Month/Year Selector - styled like home page cards */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8" data-aos="fade-up">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600/30 rounded-full flex items-center justify-center">
              <IoCalendarOutline className="text-green-400 text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Seasonal Harvest Guide</h2>
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 bg-green-900/50 border border-green-700/50 rounded-xl text-white focus:ring-2 focus:ring-green-400"
            >
              {months.map((month, index) => (
                <option key={month} value={index} className="bg-green-900">
                  {month}
                </option>
              ))}
            </select>
            
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 bg-green-900/50 border border-green-700/50 rounded-xl text-white focus:ring-2 focus:ring-green-400"
            >
              {years.map(year => (
                <option key={year} value={year} className="bg-green-900">
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Month Overview Cards - same style as home page feature cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Current Month Highlight - same bg as home page cards */}
          <div className="lg:col-span-1" data-aos="fade-right">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 h-full">
              <div className="flex items-center gap-3 mb-4">
                <GiSunflower className="text-green-400 text-3xl" />
                <h3 className="text-xl font-semibold text-white">{months[selectedMonth]} Highlights</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-800/20 rounded-lg">
                  <span className="text-green-200">Peak Season</span>
                  <span className="text-green-400 font-bold">
                    {currentData.crops.filter(c => c.status === 'in-season').length} crops
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-800/20 rounded-lg">
                  <span className="text-green-200">Coming Soon</span>
                  <span className="text-yellow-400 font-bold">
                    {currentData.crops.filter(c => c.status === 'coming-soon').length} crops
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-800/20 rounded-lg">
                  <span className="text-green-200">Ending Soon</span>
                  <span className="text-orange-400 font-bold">
                    {currentData.crops.filter(c => c.status === 'ending-soon').length} crops
                  </span>
                </div>
              </div>

              {/* Season Tip - styled like home page */}
              <div className="mt-6 p-3 bg-green-800/20 rounded-lg border border-green-500/30">
                <p className="text-sm text-green-300">
                  <span className="font-bold text-green-400">Tip:</span>{' '}
                  {selectedMonth === 2 || selectedMonth === 3 ? 'March-April is peak planting season for maize and beans.' :
                   selectedMonth === 5 || selectedMonth === 6 ? 'June-July is perfect for avocado pre-orders.' :
                   selectedMonth === 8 || selectedMonth === 9 ? 'September-October brings fresh apples and pears.' :
                   'Check individual crop listings for harvest details.'}
                </p>
              </div>
            </div>
          </div>

          {/* Monthly Calendar - same bg as home page cards */}
          <div className="lg:col-span-2" data-aos="fade-left">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20">
              <h3 className="text-xl font-semibold text-white mb-4">{months[selectedMonth]} {selectedYear}</h3>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <div key={day} className="text-center text-green-300 text-sm py-2">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  // More realistic harvest days - every 3-4 days
                  const hasHarvest = day % 3 === 0 || day % 4 === 0;
                  // Peak harvest days - middle of month
                  const isPeakHarvest = day >= 10 && day <= 20 && hasHarvest;
                  return (
                    <div 
                      key={i} 
                      className={`text-center p-2 rounded-lg ${
                        isPeakHarvest 
                          ? 'bg-green-500/40 text-green-200 border border-green-400/50' 
                          : hasHarvest 
                            ? 'bg-green-600/20 text-green-300 border border-green-500/20' 
                            : 'text-green-200/30'
                      }`}
                    >
                      <span className="text-sm">{day}</span>
                      {hasHarvest && (
                        <div className={`w-1.5 h-1.5 ${isPeakHarvest ? 'bg-green-300' : 'bg-green-500'} rounded-full mx-auto mt-1`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-6 mt-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500/40 border border-green-400/50 rounded"></div>
                  <span className="text-green-300">Peak Harvest</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600/20 border border-green-500/20 rounded"></div>
                  <span className="text-green-300">Regular Harvest</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Crops List - same bg as home page cards */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20 mb-12" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-white mb-6">Crops in {months[selectedMonth]} {selectedYear}</h3>
          
          {currentData.crops.length === 0 ? (
            <p className="text-green-200 text-center py-8">No harvest data available for this month</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentData.crops.map((crop, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-green-400/20 hover:bg-white/10 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-white">{crop.name}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(crop.status)}`}>
                      {getStatusText(crop.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-200/70">
                    <GiFruitTree className="text-green-400" />
                    <span>Available from: {crop.farms.join(', ')}</span>
                  </div>
                  {crop.status === 'in-season' && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                      <IoCheckmarkCircle />
                      <span>Ready for harvest now</span>
                    </div>
                  )}
                  {crop.status === 'coming-soon' && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-yellow-400">
                      <IoTimeOutline />
                      <span>Prepare to pre-order</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Yearly Overview - same bg as home page cards */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-white mb-6">Year at a Glance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {months.map((month, index) => {
              const monthData = harvestData[selectedYear]?.[index]?.crops || [];
              const inSeasonCount = monthData.filter(c => c.status === 'in-season').length;
              const comingSoonCount = monthData.filter(c => c.status === 'coming-soon').length;
              const totalCrops = monthData.length;
              
              return (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    selectedMonth === index
                      ? 'bg-green-600/30 border-green-400 shadow-lg shadow-green-900/30'
                      : 'bg-white/5 border-green-400/20 hover:bg-green-800/30 hover:border-green-400/40'
                  }`}
                >
                  <div className="text-sm font-semibold text-white mb-2">{month.substring(0, 3)}</div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-green-400">{inSeasonCount} in season</span>
                    {comingSoonCount > 0 && (
                      <span className="text-yellow-400/70">{comingSoonCount} soon</span>
                    )}
                  </div>
                  <div className="mt-2 w-full bg-green-800/30 rounded-full h-1">
                    <div 
                      className="bg-green-400 h-1 rounded-full" 
                      style={{ width: `${(inSeasonCount / (totalCrops || 1)) * 100}%` }}
                    ></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Button - same as home page */}
        <div className="mt-12 text-center" data-aos="fade-up">
          <p className="text-green-200 mb-4">Ready to start shopping based on the harvest calendar?</p>
          <Link to="/preorders">
            <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              BROWSE PRE-ORDERS
              <IoArrowForward className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HarvestCalendar;