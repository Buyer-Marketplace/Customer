import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-green-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-green-400"
        >
          About Agritrace Market
        </motion.h1>
        <div className="space-y-6 text-green-100/80 leading-relaxed">
          <p>
            Agritrace Market is a revolutionary platform developed at <strong>Egerton University</strong> to bridge the gap between small-scale farmers and urban consumers.
          </p>
          <p>
            Our mission is to ensure food traceability, fair pricing, and direct access to fresh produce. By utilizing modern technology, we empower farmers to secure their cash flow through pre-orders and provide buyers with guaranteed quality.
          </p>
          <p>
            Based in <strong>Nakuru, Kenya</strong>, we are committed to transforming the agricultural landscape of East Africa through transparency and innovation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
