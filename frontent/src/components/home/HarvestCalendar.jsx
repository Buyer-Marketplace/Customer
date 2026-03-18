import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowForward, IoCalendarOutline, IoTimeOutline } from 'react-icons/io5';
import Button from '../ui/Button';
import HeaderImage from './HeaderImage';
import SectionHeader from './SectionHeader';
import { useHarvestCalendar } from '../../hooks/useHarvestCalendar';

const HarvestCalendar = () => {
  const { 
    getUpcomingHarvests, 
    getHarvestSummary,
    loading 
  } = useHarvestCalendar();

  useEffect(() => {
    // The hook already fetches data automatically
  }, []);

  const upcomingHarvests = getUpcomingHarvests(30);
  const summary = getHarvestSummary();

  // Sample monthly data (you can replace with API data)
  const monthlyData = [
    { month: 'Jan', crops: 'Kale, Spinach' },
    { month: 'Feb', crops: 'Tomatoes, Peppers' },
    { month: 'Mar', crops: 'Maize, Beans' },
    { month: 'Apr', crops: 'Strawberries' },
    { month: 'May', crops: 'Potatoes' },
    { month: 'Jun', crops: 'Avocados' },
    { month: 'Jul', crops: 'Oranges' },
    { month: 'Aug', crops: 'Apples' },
  ];

  return (
    <section className="py-20">
      <HeaderImage 
        src="https://images.pexels.com/photos/22668493/pexels-photo-22668493.jpeg" 
        alt="Seasonal harvest calendar" 
      />
      
      <div className="container-custom">
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
          <SectionHeader 
            title="HARVEST CALENDAR" 
            subtitle="Plan your purchases with our seasonal harvest guide"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Current Season */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-green-400/30" data-aos="fade-right">
              <div className="flex items-center gap-3 mb-4">
                <IoCalendarOutline className="text-green-400 text-3xl" />
                <h3 className="text-xl font-semibold text-white">Current Season</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Maize</span>
                  <span className="text-green-400 text-sm bg-green-800/30 px-3 py-1 rounded-full">In Season</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Beans</span>
                  <span className="text-green-400 text-sm bg-green-800/30 px-3 py-1 rounded-full">In Season</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Tomatoes</span>
                  <span className="text-yellow-400 text-sm bg-yellow-800/30 px-3 py-1 rounded-full">Coming Soon</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-200">Strawberries</span>
                  <span className="text-green-400 text-sm bg-green-800/30 px-3 py-1 rounded-full">In Season</span>
                </div>
              </div>
            </div>

            {/* Upcoming Harvests */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-green-400/30" data-aos="fade-left">
              <div className="flex items-center gap-3 mb-4">
                <IoTimeOutline className="text-green-400 text-3xl" />
                <h3 className="text-xl font-semibold text-white">Upcoming Harvests</h3>
              </div>
              <div className="space-y-3">
                {upcomingHarvests.slice(0, 4).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-green-200">
                      {item.harvests?.[0]?.cropName || 'Various Crops'}
                    </span>
                    <span className="text-yellow-400 text-sm">
                      {Math.ceil((item.date - new Date()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                ))}
                {upcomingHarvests.length === 0 && (
                  <p className="text-green-200 text-sm">No upcoming harvests</p>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Calendar Preview */}
          <div className="mb-12" data-aos="fade-up">
            <h3 className="text-xl font-semibold text-white mb-6 text-center">Monthly Harvest Guide</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {monthlyData.map((item, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-green-400/20 text-center">
                  <div className="text-green-400 font-bold mb-1">{item.month}</div>
                  <div className="text-xs text-green-200/70">{item.crops}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center" data-aos="fade-up">
            <Link to="/harvest-calendar">
              <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-lg">
                VIEW FULL CALENDAR
                <IoArrowForward className="ml-2" />
              </Button>
            </Link>
            <p className="text-green-300/50 text-sm mt-4">
              {summary.totalHarvests} harvests planned this season
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HarvestCalendar;