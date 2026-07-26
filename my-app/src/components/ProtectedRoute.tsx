import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const personJson = sessionStorage.getItem('person');
  if (!personJson) {
    return <Navigate to="/seller/sign-in" replace />;
  }
  return <Outlet />;
}
