import React from 'react';
import { motion } from 'framer-motion';
import { IoMailOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';

const Contact = () => {
  return (
    <div className="min-h-screen bg-green-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8 text-green-400 text-center"
        >
          Contact Us
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-green-900/40 p-6 rounded-2xl border border-green-800 text-center">
            <IoLocationOutline className="text-3xl text-green-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Our Office</h3>
            <p className="text-sm text-green-100/60">Nakuru, Kenya<br/>Egerton University</p>
          </div>
          <div className="bg-green-900/40 p-6 rounded-2xl border border-green-800 text-center">
            <IoCallOutline className="text-3xl text-green-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Phone</h3>
            <p className="text-sm text-green-100/60">+254 700 000 000</p>
          </div>
          <div className="bg-green-900/40 p-6 rounded-2xl border border-green-800 text-center">
            <IoMailOutline className="text-3xl text-green-400 mx-auto mb-4" />
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-sm text-green-100/60">support@agritrace.com</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
