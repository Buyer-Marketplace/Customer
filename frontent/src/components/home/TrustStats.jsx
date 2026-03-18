import React from 'react';
import Counter from './Counter';
import HeaderImage from './HeaderImage';
import { headerImages, trustStats } from '../../constants/homeConstants';

const TrustStats = () => {
  return (
    <section className="py-20">
      <HeaderImage 
        src={headerImages.trust} 
        alt="Farmers working in field" 
      />
      
      <div className="container-custom">
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20 shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16" data-aos="fade-down">
            TRUSTED BY FARMERS & CUSTOMERS
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {trustStats.map((stat, index) => (
              <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Counter 
                  end={stat.number} 
                  label={stat.label} 
                  suffix={stat.suffix}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustStats;