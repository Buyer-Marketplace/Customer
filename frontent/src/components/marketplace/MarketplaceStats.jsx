import React from 'react';
import { FiPackage, FiUsers, FiMapPin, FiTrendingUp } from 'react-icons/fi';

const StatCard = ({ icon: Icon, value, label, color = 'green' }) => (
  <div className={`bg-${color}-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-${color}-400/20 hover:border-${color}-400/40 transition-all`}>
    <Icon className={`text-${color}-400 text-2xl mx-auto mb-2`} />
    <div className={`text-2xl md:text-3xl font-bold text-${color}-300`}>{value}</div>
    <div className="text-xs text-green-200/70">{label}</div>
  </div>
);

const MarketplaceStats = ({ listings, crops }) => {
  const totalFarmers = new Set(listings?.map(l => l.farmer_name)).size;
  const totalRegions = new Set(listings?.map(l => l.region_name)).size;
  const totalQuantity = listings?.reduce((sum, l) => sum + (l.available_quantity_kg || 0), 0) || 0;
  const avgPrice = listings?.length > 0 
    ? (listings.reduce((sum, l) => sum + l.price_per_kg, 0) / listings.length).toFixed(2)
    : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
      <StatCard 
        icon={FiPackage} 
        value={listings?.length || 0} 
        label="Active Listings" 
        color="green"
      />
      <StatCard 
        icon={FiTrendingUp} 
        value={crops?.length || 0} 
        label="Crop Types" 
        color="blue"
      />
      <StatCard 
        icon={FiUsers} 
        value={totalFarmers} 
        label="Farmers" 
        color="purple"
      />
      <StatCard 
        icon={FiMapPin} 
        value={totalRegions} 
        label="Regions" 
        color="amber"
      />
    </div>
  );
};

export default MarketplaceStats;