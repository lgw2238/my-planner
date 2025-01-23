import { Navigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, token } = useStore();
  const location = useLocation();

  if (!isLoggedIn || !token) {
    console.log("Access denied:", { isLoggedIn, hasToken: !!token });
    return <Navigate to="/login" state={{ from: location }} />;
  }

  console.log("Access granted:", { isLoggedIn, hasToken: !!token });
  return children;
};

export default ProtectedRoute; 