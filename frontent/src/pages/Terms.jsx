import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-green-950 py-12 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-4xl mx-auto bg-green-900/20 p-8 rounded-3xl border border-green-800/50">
        <h1 className="text-3xl font-bold mb-8 text-green-400">Terms of Service</h1>
        <div className="space-y-6 text-green-100/70 text-sm leading-relaxed">
          <p>Welcome to Agritrace Market. By using our platform, you agree to the following terms.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">1. Marketplace Rules</h2>
          <p>Agritrace Market connects buyers and farmers. We are not responsible for the physical quality of produce, but we facilitate secure payments through our escrow system.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">2. Payments & Escrow</h2>
          <p>Payments are made via M-Pesa. Funds are held in escrow and released only when the buyer confirms delivery. Any disputes must be raised before the delivery confirmation.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">3. Delivery</h2>
          <p>Farmers are responsible for delivering the produce to the address provided by the buyer within the agreed timeframe.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">4. Prohibited Activities</h2>
          <p>Users may not engage in fraudulent transactions or attempt to bypass the platform's payment system.</p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
