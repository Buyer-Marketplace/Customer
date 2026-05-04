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
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand & Social */}
          <div className="space-y-3 flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-2 group">
              <IoLeaf className="text-green-400 text-xl group-hover:text-green-300 transition-colors" />
              <span className="text-white font-semibold text-lg group-hover:text-green-300 transition-colors">Agritrace Market</span>
            </Link>
            <p className="text-sm text-green-300/70 leading-relaxed max-w-xs mx-auto md:mx-0">
              Connecting farmers directly with buyers for fresh produce and fair prices.
            </p>
            <div className="flex space-x-3 pt-2 justify-center md:justify-start">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-green-800 rounded-lg text-green-300 hover:bg-green-700 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <IoLogoFacebook size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-green-800 rounded-lg text-green-300 hover:bg-green-700 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <IoLogoTwitter size={16} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center bg-green-800 rounded-lg text-green-300 hover:bg-green-700 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <IoLogoInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/marketplace" 
                  className="text-sm text-green-300/70 hover:text-white transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link 
                  to="/crops" 
                  className="text-sm text-green-300/70 hover:text-white transition-colors"
                >
                  Crops
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-green-300/70 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-green-300/70 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Get In Touch</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/location"
                  className="flex items-center space-x-3 text-sm text-green-300/70 hover:text-white transition-colors group"
                >
                  <IoLocationOutline className="text-green-400 group-hover:text-green-300 transition-colors" size={14} />
                  <span>Nakuru, Kenya (Egerton University)</span>
                </Link>
              </li>
              <li className="flex items-center space-x-3 text-sm text-green-300/70">
                <IoCallOutline className="text-green-400" size={14} />
                <a href="tel:+254700000000" className="hover:text-white transition-colors">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-green-300/70">
                <IoMailOutline className="text-green-400" size={14} />
                <a href="mailto:support@agritrace.com" className="hover:text-white transition-colors">
                  support@agritrace.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-center pt-6 mt-6 border-t border-green-800 text-xs text-green-300/50 text-center">
          <p>© 2026 Agritrace Market. All rights reserved.</p>
          <div className="flex space-x-4 mt-2">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;