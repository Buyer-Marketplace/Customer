import React from 'react';
import { Link } from 'react-router-dom';

const NavLinks = ({ links, location }) => {
  const isActiveLink = (linkPath) => {
    if (linkPath === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(linkPath);
  };

  return (
    <div className="flex items-center justify-center space-x-1 xl:space-x-2">
      {links.map((link) => {
        const isActive = isActiveLink(link.path);
        return (
          <Link
            key={link.path}
            to={link.path}
            className={`px-2 xl:px-3 2xl:px-4 py-1.5 xl:py-2 rounded-lg text-sm xl:text-base font-medium transition-all duration-300 whitespace-nowrap relative group ${
              isActive
                ? 'text-white bg-green-800/50'
                : 'text-green-300/80 hover:text-white hover:bg-green-800/30'
            }`}
          >
            {link.name}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-0.5 bg-green-400 rounded-full"></span>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default NavLinks;