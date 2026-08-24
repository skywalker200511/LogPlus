import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-[#12121a] border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🛡️</span>
          <div>
            <h1 className="text-white font-bold text-xl leading-none">LogPlus</h1>
            <p className="text-gray-400 text-xs">Anomaly Detection</p>
          </div>
        </div>
        <div className="flex space-x-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-blue-500 border-b-2 border-blue-500 pb-1' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-blue-500 border-b-2 border-blue-500 pb-1' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            Logs
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
