import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth pages
import Login from '../pages/auth/login';

// Admin pages
import Dashboard from '../pages/admin/dashboard';
import Trucks from '../pages/admin/trucks';
import Trailers from '../pages/admin/trailers';
import Trips from '../pages/admin/trips';
import Maintenance from '../pages/admin/maintenance';
import Tires from '../pages/admin/tires';
import Fuel from '../pages/admin/fuel';

// Driver pages
import MyTrips from '../pages/driver/my_trips';
import MyTripDetail from '../pages/driver/my_trip_detail';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />

      {/* Admin routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/trucks" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Trucks />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/trailers" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Trailers />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/trips" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Trips />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/maintenance" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Maintenance />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/tires" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Tires />
        </ProtectedRoute>
      } />

      <Route path="/admin/fuel" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Fuel />
        </ProtectedRoute>
      } />

      {/* Driver routes */}
      <Route path="/driver/my-trips" element={
        <ProtectedRoute allowedRoles={['chauffeur']}>
          <MyTrips />
        </ProtectedRoute>
      } />
      
      <Route path="/driver/my-trip-detail/:id" element={
        <ProtectedRoute allowedRoles={['chauffeur']}>
          <MyTripDetail />
        </ProtectedRoute>
      } />

      {/* Redirects */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" />} />
      <Route path="/my-trips" element={<Navigate to="/driver/my-trips" />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
