import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { toggleSidebar, user, isLoggedIn, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b h-16 flex items-center px-6 sticky top-0 z-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-4 text-xl font-semibold text-color-pastel-navy">My Planner</span>
        </div>

        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome, <span className="font-medium text-color-pastel-navy">{user?.name || 'User'}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-color-pastel-navy text-white rounded hover:bg-color-pastel-navy/80 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 