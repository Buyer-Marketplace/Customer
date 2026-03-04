import React from "react";

const App = () => {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md">
        
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Farmers Marketplace
        </h1>

        <p className="text-gray-600 mb-6">
          Connect farmers directly with customers in a transparent and trusted way.
        </p>

        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-300">
          Get Started
        </button>

      </div>
    </div>
  );
};

export default App;