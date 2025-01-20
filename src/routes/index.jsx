import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Calendar from '../features/calendar/Calendar';
import EvaluationList from '../features/evaluation/EvaluationList';
import Login from '../features/auth/Login';
import ProtectedRoute from './ProtectedRoute';
import EventUpload from '../features/upload/EventUpload';

// 에러 페이지 컴포넌트
const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-4">Sorry, an unexpected error has occurred.</p>
        <a
          href="/"
          className="text-color-pastel-navy hover:underline"
        >
          Go back home
        </a>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Calendar />
      },
      {
        path: '/evaluation',
        element: <EvaluationList />
      },
      {
        path: '/event-upload',
        element: (
              <EventUpload />
        )
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  }
]);

export default router; 