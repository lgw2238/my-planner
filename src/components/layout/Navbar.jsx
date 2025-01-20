import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../../store/useStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-[1920px] mx-auto px-8 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-naver-pastel-navy font-bold text-xl hover:opacity-80">
            My Planner
          </Link>
          <div className="ml-auto">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-naver-pastel-navy text-white rounded hover:bg-naver-pastel-navy/80"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-naver-pastel-navy text-white rounded hover:bg-naver-pastel-navy/80"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 