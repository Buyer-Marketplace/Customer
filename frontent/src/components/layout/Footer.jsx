import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerSections = [
    {
      title: "Shop",
      links: ["Sareem Harvest", "CSA Base", "Pastry Staples", "Gift Cards"]
    },
    {
      title: "The Farm",
      links: ["Our Methods", "Visit Us", "Seed Health", "Careers"]
    },
    {
      title: "Support",
      links: ["Shipping Policy", "FAQ", "Contact Us", "Sustainability"]
    }
  ];

  return (
    <footer className="bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">
              <span className="text-gray-900 dark:text-white">Harvest</span>
              <span className="text-primary">Home</span>
            </h3>
            <p className="text-sm text-gray-500 dark:text-dark-muted">
              Authentic farm-to-table delivery, connecting you with the rhythms of the seasons.
            </p>
          </div>

          {/* Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-sm text-gray-500 dark:text-dark-muted hover:text-primary">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;