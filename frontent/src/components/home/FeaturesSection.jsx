import React from 'react';
import { GiFarmer } from 'react-icons/gi';
import { IoCalendarOutline } from 'react-icons/io5';
import { BsTruck } from 'react-icons/bs';
import HeaderImage from './HeaderImage';
import SectionHeader from './SectionHeader';
import { headerImages, features } from '../../constants/homeConstants';

// Map icon strings to actual components
const iconMap = {
  GiFarmer: GiFarmer,
  IoCalendarOutline: IoCalendarOutline,
  BsTruck: BsTruck
};

const FeaturesSection = () => {
  return (
    <section className="py-20">
      <HeaderImage 
        src={headerImages.hero} 
        alt="Organic farming landscape" 
      />
      
      <div className="container-custom">
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
          <SectionHeader title="WHY CHOOSE AGRITRACE MARKET" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              return (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-green-400/30 text-center hover:bg-white/20 transition-all duration-500 hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className="w-20 h-20 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-green-400 text-4xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-green-200">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;