import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-green-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto bg-green-900/20 p-8 rounded-3xl border border-green-800/50">
        <h1 className="text-3xl font-bold mb-8 text-green-400">Privacy Policy</h1>
        <div className="space-y-6 text-green-100/70 text-sm leading-relaxed">
          <p>Last Updated: May 2026</p>
          <h2 className="text-xl font-bold text-white mt-8">1. Information We Collect</h2>
          <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email, phone number, and delivery address.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">2. How We Use Your Information</h2>
          <p>We use your information to process transactions, facilitate deliveries between farmers and buyers, and provide customer support.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">3. Data Security</h2>
          <p>We use industry-standard security measures, including SSL encryption and secure password hashing, to protect your personal data.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at support@agritrace.com.</p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
