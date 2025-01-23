import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import useStore from '../../store/useStore';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoggedIn, setToken, token } = useStore();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

/**
 * @description axios - login (jwt token)
 */
  const handleSubmit = async (e) => {
    console.log("request login data:", formData);
    e.preventDefault();
    // for test login logic data layer upper
    const userData = {
        name: formData.username, 
        // another user data
      };
    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      console.log("jwt login response:", response.data);
      if (response.data) {
        setToken(response.data);
        // user interface       
        setIsLoggedIn(true, userData);
        console.log("Login successful:", { token: response.data, isLoggedIn: true });
        console.log("Stored token:", useStore.getState().token);
        navigate(from, { replace: true });
      } else {
        // if non token
        setToken('ifnonToken');
        setIsLoggedIn(true, userData);
        setError('Warning: No token received');
        navigate(from, { replace: true }); // failed - force login
      }
    } catch (error) {
      // api request failed
      console.log('Login failed:', "Login failed but we allow to login");
      setToken('errorToken');
      setIsLoggedIn(true, userData);
      setError('Warning: Authentication failed');
      navigate(from, { replace: true }); // failed - force login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-color-pastel-navy mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
              placeholder="Enter your password"
              required
            />
          </div>
          {error && (
            <div className="text-yellow-600 text-sm text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-color-pastel-navy text-white py-2 rounded-lg hover:bg-color-pastel-navy/80 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 