import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Calendar from './components/Calendar';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import EvaluationList from './components/EvaluationList';
import Login from './components/Login';
import './App.css';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          username={username} 
          onLogout={handleLogout}
        />
        <div className="flex">
          {isLoggedIn && <Sidebar />}
          <div className="flex-1">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <Calendar />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/evaluations" 
                element={
                  <ProtectedRoute isLoggedIn={isLoggedIn}>
                    <EvaluationList />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
