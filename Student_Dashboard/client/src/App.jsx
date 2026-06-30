import { Navigate, Route, Routes } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import StudentsPage from './pages/StudentsPage';
import TasksPage from './pages/TasksPage';
import Unauthorized from './pages/Unauthorized';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner label="Checking session..." />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/unauthorized" replace />;

  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboard /> : <AdminDashboard />;
};

const App = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner label="Starting dashboard..." />;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardRedirect />} />
        <Route
          path="students"
          element={
            <ProtectedRoute roles={['admin']}>
              <StudentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="tasks"
          element={
            <ProtectedRoute roles={['admin']}>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-tasks"
          element={
            <ProtectedRoute roles={['student']}>
              <TasksPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
