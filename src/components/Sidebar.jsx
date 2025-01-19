import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-md">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `block px-4 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-naver-pastel-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              Calendar
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/evaluations"
              className={({ isActive }) =>
                `block px-4 py-2 rounded transition-colors ${
                  isActive
                    ? 'bg-naver-pastel-navy text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              Evaluations
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 