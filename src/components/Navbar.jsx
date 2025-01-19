import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn, username, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-[1920px] mx-auto px-8 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-naver-pastel-navy font-bold text-xl hover:opacity-80">
            My Planner
          </Link>
          <div className="ml-auto">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600">{username}님</span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 bg-naver-pastel-navy text-white rounded hover:bg-naver-pastel-navy/80"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-naver-pastel-navy text-white rounded hover:bg-naver-pastel-navy/80"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 