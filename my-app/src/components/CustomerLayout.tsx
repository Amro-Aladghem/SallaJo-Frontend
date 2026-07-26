import { Outlet } from 'react-router-dom';
import { getCustomerStore } from '@/libs/customerStorage';
import BottomNav from './BottomNav';

export default function CustomerLayout() {
  const store = getCustomerStore();
  const primaryColor = store?.primaryColorCode || '#40E0D0';

  return (
    <div
      className="flex-1 w-full max-w-lg mx-auto bg-white md:border-x border-gray-200 min-h-screen relative pb-14"
      dir="rtl" lang="ar"
      style={{ '--color-primary': primaryColor } as React.CSSProperties}
    >
      <Outlet />
      <BottomNav />
    </div>
  );
}
