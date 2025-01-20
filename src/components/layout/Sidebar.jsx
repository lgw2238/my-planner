import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';

const Sidebar = () => {
  const location = useLocation();
  const { isSidebarOpen, toggleSidebar } = useStore();

  const menuItems = [
    { path: '/', label: 'Schedule Calender', icon: '📅' },
    { path: '/event-upload', label: 'Upload Schedule', icon: '📤' },
    { path: '/evaluation', label: 'Evaluation Management', icon: '📝' },
  ];

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed left-4 top-20 z-50 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
      >
        {isSidebarOpen ? '◀' : '▶'}
      </button>
      <div 
        className={`w-64 bg-white h-[calc(100vh-64px)] shadow-lg fixed left-0 transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-2 p-3 rounded-lg hover:bg-color-pastel-blue/20 ${
                    location.pathname === item.path ? 'bg-color-pastel-blue/20' : ''
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar; 