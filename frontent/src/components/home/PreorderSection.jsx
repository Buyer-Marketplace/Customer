import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowForward, IoCalendarOutline } from 'react-icons/io5';
import { GiPlantWatering } from 'react-icons/gi';
import Button from '../ui/Button';
import HeaderImage from './HeaderImage';
import { headerImages } from '../../constants/homeConstants';
import { usePreOrders } from '../../hooks/usePreOrders';

const PreorderSection = () => {
  const { availablePreorders, fetchAvailablePreorders } = usePreOrders();

  useEffect(() => {
    fetchAvailablePreorders();
  }, [fetchAvailablePreorders]);

  const preorderCount = availablePreorders?.length || 0;

  return (
    <section className="py-20">
      <HeaderImage 
        src={headerImages.preorder} 
        alt="Farmers harvesting crops" 
      />
      
      <div className="container-custom">
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">PRE-ORDER FUTURE HARVESTS</h2>
              <p className="text-lg text-green-200 mb-8 leading-relaxed">
                Secure your share of upcoming harvests. {preorderCount > 0 ? `${preorderCount} items available for pre-order now!` : 'Be the first to know when new harvests are available.'}
              </p>
              <Link to="/preorders">
                <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  {preorderCount > 0 ? 'EXPLORE PRE-ORDERS' : 'VIEW PRE-ORDERS'}
                  <IoArrowForward className="ml-2" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
                <IoCalendarOutline className="text-green-400 text-3xl mb-2" />
                <h3 className="text-white font-semibold">Seasonal Planning</h3>
                <p className="text-green-200 text-sm">Plan your purchases</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
                <GiPlantWatering className="text-green-400 text-3xl mb-2" />
                <h3 className="text-white font-semibold">Fresh Harvest</h3>
                <p className="text-green-200 text-sm">Straight from farm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreorderSection;