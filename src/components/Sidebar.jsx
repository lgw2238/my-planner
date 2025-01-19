import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '캘린더', icon: '📅' },
    { path: '/evaluations', label: '평가 관리', icon: '📊' },
  ];

  return (
    <div className="w-64 bg-white shadow-md h-[calc(100vh-64px)]">
      <div className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  ${location.pathname === item.path 
                    ? 'bg-naver-pastel-navy text-white' 
                    : 'text-gray-600 hover:bg-naver-pastel-gray'}
                `}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar; 