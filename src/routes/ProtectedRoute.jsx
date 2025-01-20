import { Navigate } from 'react-router-dom';
import useStore from '../store/useStore';

const ProtectedRoute = ({ children }) => {
  const user = useStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 