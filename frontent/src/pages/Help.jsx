import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Help = () => {
  const faqs = [
    {
      title: 'How it Works',
      content: 'AgriTrace connects you directly with farmers. You can buy produce that is currently available or pre-order upcoming harvests to lock in prices.',
      icon: '🚀'
    },
    {
      title: 'Pre-ordering vs Buying Now',
      content: 'If a crop is still growing, you can "Pre-order" it. This reserves your share before it hits the market. If it is already harvested, you can "Buy Now" for immediate delivery.',
      icon: '📅'
    },
    {
      title: 'Secure M-Pesa Payments',
      content: 'All payments are processed via M-Pesa. When you pay, the funds are held in a secure escrow. The farmer only gets paid once you confirm you have received the goods.',
      icon: '📱'
    },
    {
      title: 'Escrow Protection',
      content: 'Your money is safe. If a farmer fails to deliver, or the produce is not as described, you can raise a dispute, and the escrow funds will be refunded or held until the issue is resolved.',
      icon: '🛡️'
    }
  ];

  const steps = [
    { number: '01', title: 'Browse Crops', text: 'Explore our marketplace to find fresh produce from verified local farmers.' },
    { number: '02', title: 'Secure Booking', text: 'Select your quantity and pay via M-Pesa STK Push. Your money is held in escrow.' },
    { number: '03', title: 'Farm-to-Door', text: 'The farmer prepares your order and delivers it to your specified address.' },
    { number: '04', title: 'Confirm & Release', text: 'Inspect your produce and click "Confirm Delivery" to release funds to the farmer.' }
  ];

  return (
    <div className="min-h-screen bg-green-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl mb-4">
            How can we <span className="text-green-400">help you?</span>
          </h1>
          <p className="text-xl text-green-300/80">
            Everything you need to know about buying fresh on AgriTrace.
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-green-900/40 backdrop-blur-sm border border-green-800 p-6 rounded-2xl"
            >
              <div className="text-3xl mb-4">{faq.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{faq.title}</h3>
              <p className="text-green-200/70 leading-relaxed">{faq.content}</p>
            </motion.div>
          ))}
        </div>

        {/* Step-by-Step */}
        <div className="bg-green-900/20 rounded-3xl p-8 md:p-12 border border-green-800/50">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">4 Simple Steps to Your Table</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-5xl font-black text-green-800/30 absolute -top-4 -left-2 select-none">
                  {step.number}
                </div>
                <div className="relative z-10">
                  <h4 className="text-lg font-bold text-green-400 mb-2">{step.title}</h4>
                  <p className="text-sm text-green-100/60 leading-relaxed">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center bg-gradient-to-r from-green-800/40 to-green-900/40 p-8 rounded-2xl border border-green-700/30">
          <h3 className="text-2xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-green-300/80 mb-6">Our support team is available 24/7 to assist you with your orders.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:support@agritrace.com" className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-full font-bold transition-all">
              Email Support
            </a>
            <Link to="/marketplace" className="bg-transparent border border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-8 py-3 rounded-full font-bold transition-all">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
