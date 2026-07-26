import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import DashboardNavbar from '@/views/seller/dashboardPage/Component/DashboardNavbar';

export default function SellerLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const personJson = sessionStorage.getItem('person');
    if (!personJson) {
      navigate('/seller/sign-in', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-18 md:pt-0 pb-20 md:pb-0">
      <DashboardNavbar store={user.store} person={user.person} />
      <Outlet />
    </div>
  );
}
