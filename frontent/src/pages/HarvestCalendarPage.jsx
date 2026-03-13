import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { 
  IoCalendarOutline, 
  IoArrowForward,
  IoLeaf,
  IoTimeOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import { GiPlantWatering, GiHarvest, GiSunflower } from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image for harvest calendar
const headerImage = "https://images.unsplash.com/photo-1523741543316-32c162c9e05c?auto=format&fit=crop&q=80&w=1600";

// Gradient overlay for header images
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const HarvestCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
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

  const years = [2024, 2025];

  // Mock harvest data
  const harvestData = {
    2024: {
      0: { // January
        crops: [
          { name: 'Kale', status: 'in-season', farms: ['Green Valley', 'Highlands'] },
          { name: 'Spinach', status: 'in-season', farms: ['Berry Fields', 'Green Valley'] },
          { name: 'Carrots', status: 'in-season', farms: ['Highlands'] },
          { name: 'Cabbage', status: 'ending-soon', farms: ['Green Valley'] },
        ]
      },
      1: { // February
        crops: [
          { name: 'Tomatoes', status: 'coming-soon', farms: ['Green Valley', 'Highlands'] },
          { name: 'Peppers', status: 'coming-soon', farms: ['Berry Fields'] },
          { name: 'Kale', status: 'in-season', farms: ['Green Valley', 'Highlands'] },
          { name: 'Spinach', status: 'in-season', farms: ['Berry Fields'] },
        ]
      },
      2: { // March
        crops: [
          { name: 'Maize', status: 'coming-soon', farms: ['Highlands'] },
          { name: 'Beans', status: 'coming-soon', farms: ['Green Valley'] },
          { name: 'Tomatoes', status: 'in-season', farms: ['Green Valley', 'Berry Fields'] },
          { name: 'Peppers', status: 'in-season', farms: ['Berry Fields'] },
        ]
      },
      3: { // April
        crops: [
          { name: 'Strawberries', status: 'in-season', farms: ['Berry Fields'] },
          { name: 'Maize', status: 'in-season', farms: ['Highlands'] },
          { name: 'Beans', status: 'in-season', farms: ['Green Valley'] },
          { name: 'Peas', status: 'coming-soon', farms: ['Highlands'] },
        ]
      },
      4: { // May
        crops: [
          { name: 'Potatoes', status: 'in-season', farms: ['Highlands'] },
          { name: 'Strawberries', status: 'ending-soon', farms: ['Berry Fields'] },
          { name: 'Peas', status: 'in-season', farms: ['Highlands'] },
          { name: 'Onions', status: 'coming-soon', farms: ['Green Valley'] },
        ]
      },
      5: { // June
        crops: [
          { name: 'Avocados', status: 'coming-soon', farms: ['Green Valley'] },
          { name: 'Potatoes', status: 'in-season', farms: ['Highlands'] },
          { name: 'Onions', status: 'in-season', farms: ['Green Valley'] },
          { name: 'Garlic', status: 'coming-soon', farms: ['Highlands'] },
        ]
      },
      6: { // July
        crops: [
          { name: 'Avocados', status: 'in-season', farms: ['Green Valley'] },
          { name: 'Oranges', status: 'coming-soon', farms: ['Berry Fields'] },
          { name: 'Garlic', status: 'in-season', farms: ['Highlands'] },
          { name: 'Ginger', status: 'coming-soon', farms: ['Highlands'] },
        ]
      },
      7: { // August
        crops: [
          { name: 'Oranges', status: 'in-season', farms: ['Berry Fields'] },
          { name: 'Avocados', status: 'ending-soon', farms: ['Green Valley'] },
          { name: 'Apples', status: 'coming-soon', farms: ['Highlands'] },
          { name: 'Pears', status: 'coming-soon', farms: ['Highlands'] },
        ]
      },
      8: { // September
        crops: [
          { name: 'Apples', status: 'in-season', farms: ['Highlands'] },
          { name: 'Pears', status: 'in-season', farms: ['Highlands'] },
          { name: 'Oranges', status: 'ending-soon', farms: ['Berry Fields'] },
          { name: 'Grapes', status: 'coming-soon', farms: ['Green Valley'] },
        ]
      },
      9: { // October
        crops: [
          { name: 'Grapes', status: 'in-season', farms: ['Green Valley'] },
          { name: 'Pumpkins', status: 'in-season', farms: ['Highlands'] },
          { name: 'Apples', status: 'ending-soon', farms: ['Highlands'] },
          { name: 'Squash', status: 'coming-soon', farms: ['Green Valley'] },
        ]
      },
      10: { // November
        crops: [
          { name: 'Pumpkins', status: 'ending-soon', farms: ['Highlands'] },
          { name: 'Squash', status: 'in-season', farms: ['Green Valley'] },
          { name: 'Sweet Potatoes', status: 'in-season', farms: ['Highlands'] },
          { name: 'Citrus', status: 'coming-soon', farms: ['Berry Fields'] },
        ]
      },
      11: { // December
        crops: [
          { name: 'Citrus', status: 'in-season', farms: ['Berry Fields'] },
          { name: 'Sweet Potatoes', status: 'ending-soon', farms: ['Highlands'] },
          { name: 'Kale', status: 'in-season', farms: ['Green Valley'] },
          { name: 'Spinach', status: 'in-season', farms: ['Green Valley'] },
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
      {/* Header Image Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img 
          src={headerImage}
          alt="Harvest Calendar"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
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
        {/* Month/Year Selector */}
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

        {/* Month Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Current Month Highlight */}
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
            </div>
          </div>

          {/* Monthly Calendar */}
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
                  const hasHarvest = day % 7 === 0 || day % 5 === 0; // Mock harvest days
                  return (
                    <div 
                      key={i} 
                      className={`text-center p-2 rounded-lg ${
                        hasHarvest 
                          ? 'bg-green-600/30 text-green-300 border border-green-500/30' 
                          : 'text-green-200/50'
                      }`}
                    >
                      <span className="text-sm">{day}</span>
                      {hasHarvest && <div className="w-1 h-1 bg-green-400 rounded-full mx-auto mt-1"></div>}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-green-300/50 mt-4 text-center">
                * Green dots indicate harvest days
              </p>
            </div>
          </div>
        </div>

        {/* Crops List */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20 mb-12" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-white mb-6">Crops in {months[selectedMonth]}</h3>
          
          {currentData.crops.length === 0 ? (
            <p className="text-green-200 text-center py-8">No harvest data available for this month</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentData.crops.map((crop, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-green-400/20">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-white">{crop.name}</h4>
                    <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(crop.status)}`}>
                      {getStatusText(crop.status)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-green-200/70">
                    <GiHarvest className="text-green-400" />
                    <span>Available from: {crop.farms.join(', ')}</span>
                  </div>
                  {crop.status === 'in-season' && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                      <IoCheckmarkCircle />
                      <span>Ready for harvest now</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Yearly Overview */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-white mb-6">Year at a Glance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {months.map((month, index) => {
              const monthData = harvestData[selectedYear]?.[index]?.crops || [];
              const inSeasonCount = monthData.filter(c => c.status === 'in-season').length;
              
              return (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    selectedMonth === index
                      ? 'bg-green-600/30 border-green-400'
                      : 'bg-white/5 border-green-400/20 hover:bg-green-800/30'
                  }`}
                >
                  <div className="text-sm font-semibold text-white mb-1">{month.substring(0, 3)}</div>
                  <div className="text-xs text-green-300/70">{inSeasonCount} crops</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA Section */}
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