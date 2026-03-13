import React from 'react';
import { Link } from 'react-router-dom';
import {
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoLeaf
} from 'react-icons/io5';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-green-950 border-t border-green-800">
      <div className="container-custom py-8 md:py-12">
        {/* Main Footer Content - Centered on mobile, left-aligned on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand & Social */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2">
              <IoLeaf className="text-green-400 text-xl" />
              <span className="text-white font-semibold text-lg">Agritrace Market</span>
            </div>
            <p className="text-sm text-green-300/70 leading-relaxed max-w-xs mx-auto md:mx-0">
              Connecting farmers directly with buyers for fresh produce and fair prices.
            </p>
            <div className="flex space-x-3 pt-2 justify-center md:justify-start">
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center bg-green-800 rounded-lg text-green-300 hover:bg-green-700 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <IoLogoFacebook size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center bg-green-800 rounded-lg text-green-300 hover:bg-green-700 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <IoLogoTwitter size={16} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 flex items-center justify-center bg-green-800 rounded-lg text-green-300 hover:bg-green-700 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <IoLogoInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links - Centered on mobile */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'Products', path: '/products' },
                { name: 'Categories', path: '/categories' },
                { name: 'Pre-Orders', path: '/preorders' },
                { name: 'Harvest Calendar', path: '/harvest-calendar' },
              ].map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path} 
                    className="text-sm text-green-300/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Centered on mobile */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm text-green-300/70">
                <IoLocationOutline className="text-green-400 flex-shrink-0" size={14} />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-green-300/70">
                <IoCallOutline className="text-green-400" size={14} />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-green-300/70">
                <IoMailOutline className="text-green-400" size={14} />
                <span>support@agritrace.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Centered on all devices */}
        <div className="flex flex-col items-center justify-center pt-6 mt-6 border-t border-green-800 text-xs text-green-300/50 text-center">
          <p>© {currentYear} Agritrace Market. All rights reserved.</p>
          <div className="flex space-x-4 mt-2">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;