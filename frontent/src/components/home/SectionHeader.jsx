import React from 'react';

const SectionHeader = ({ title, subtitle, align = "center" }) => {
  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <div className={`mb-12 ${alignmentClasses[align]}`} data-aos="fade-down">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{title}</h2>
      {subtitle && <p className="text-green-200 text-lg">{subtitle}</p>}
    </div>
  );
};

export default SectionHeader;