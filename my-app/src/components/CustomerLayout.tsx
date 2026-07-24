import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function CustomerLayout() {
  return (
    <div className="flex-1 w-full max-w-lg mx-auto bg-white md:border-x border-gray-200 min-h-screen relative pb-14" dir="rtl" lang="ar">
      <Outlet />
      <BottomNav />
    </div>
  );
}
