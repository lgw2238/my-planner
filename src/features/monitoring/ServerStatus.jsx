import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';

const API_LIST = [
  { name: 'Auth Service', endpoint: 'api/auth/test' },
  { name: 'Calendar Service', endpoint: '/calendar/health' },
  { name: 'Evaluation Service', endpoint: '/evaluation/health' },
  { name: 'Upload Service', endpoint: '/upload/health' }
];

const StatusCard = ({ name, status, responseTime }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Loading':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getStatusColor(status)}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">{name}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'Healthy' ? 'bg-green-500' : status === 'Unhealthy' ? 'bg-red-500' : 'bg-yellow-500'}`} />
            <span>{status}</span>
          </div>
        </div>
        {responseTime && (
          <span className="text-sm text-gray-600">
            {responseTime}ms
          </span>
        )}
      </div>
    </div>
  );
};

const ServerStatus = () => {
  const [serviceStatus, setServiceStatus] = useState({});
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkHealth = async () => {
    setIsLoading(true);
    const newStatus = {};

    for (const api of API_LIST) {
      const startTime = performance.now();
      try {
        const response = await axiosInstance.get(api.endpoint);
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        newStatus[api.name] = {
          status: response.status === 200 ? 'Healthy' : 'Unhealthy',
          responseTime
        };
      } catch (error) {
        newStatus[api.name] = {
          status: 'Unhealthy',
          error: error.message
        };
      }
    }

    setServiceStatus(newStatus);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // status check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-color-pastel-navy">
              Server Status
            </h2>
            {lastUpdated && (
              <p className="text-sm text-gray-500">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={checkHealth}
            className="bg-color-pastel-navy text-white px-4 py-2 rounded hover:bg-color-pastel-navy/80"
            disabled={isLoading}
          >
            {isLoading ? 'Checking...' : 'Refresh'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {API_LIST.map((api) => (
            <StatusCard
              key={api.name}
              name={api.name}
              status={isLoading ? 'Loading' : serviceStatus[api.name]?.status || 'Unknown'}
              responseTime={serviceStatus[api.name]?.responseTime}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServerStatus; 