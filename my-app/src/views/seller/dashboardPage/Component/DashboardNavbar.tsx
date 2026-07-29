import type { StoreInfoForSellerDto, PersonAuthResponseDto } from '@/types/dtos';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { User, Store, LogOut, Home, Package, BadgePercent, Gift, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link, useLocation } from 'react-router-dom';

interface Props {
  store: StoreInfoForSellerDto | null | undefined;
  person: PersonAuthResponseDto;
}

export default function DashboardNavbar({ store, person }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname === '/seller/dashboard';

  const handleLogout = () => {
    logout();
    navigate('/seller/sign-in', { replace: true });
  };

  return (
    <>
      {/* Desktop navbar */}
      <nav className="hidden md:flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
        <div className="flex items-center gap-3">
          <img src="/sallahlogo.png" alt="سلة جو" className="h-9 w-auto" />
          <span className="text-lg font-bold text-gray-900">سلة جو</span>
          <span className="mr-4 text-xs text-gray-400 hidden lg:inline">صفحة مدير المتجر</span>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/seller/info')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
            <Avatar className="h-8 w-8 border-2 border-gray-200">
              {person.imageUrl ? (
                <AvatarImage src={person.imageUrl} alt={person.fullName} />
              ) : null}
              <AvatarFallback className="bg-gray-100">
                <User className="h-4 w-4 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{person.fullName || 'حسابك'}</span>
          </button>

          <Link to="/seller/support" className="text-sm text-gray-600 hover:text-primary transition-colors">
            الدعم الفني
          </Link>

          <button onClick={() => navigate('/seller/store/info')} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
            <Store className="h-4 w-4" />
            <span>متجرك</span>
          </button>

          {store && (
            <div className="flex items-center gap-2 border-r border-gray-200 pr-4 mr-2">
              {store.logoImageUrl ? (
                <img src={store.logoImageUrl} alt={store.name} className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                  <Store className="h-4 w-4 text-gray-400" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">{store.name}</span>
            </div>
          )}

          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="تسجيل الخروج">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-2">
        <div className="grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <img src="/sallahlogo.png" alt="سلة جو" className="h-10 w-auto" />
          </div>
          <div className="flex justify-center">
            {store && (
              <div className="flex flex-col items-center">
                {store.logoImageUrl ? (
                  <img src={store.logoImageUrl} alt={store.name} className="h-7 w-7 rounded-lg object-cover" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
                    <Store className="h-4 w-4 text-gray-400" />
                  </div>
                )}
                <span className="text-xs font-medium text-gray-700 mt-0.5 max-w-[100px] truncate">{store.name}</span>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            {isDashboard ? (
              <span className="text-[10px] text-gray-400">مدير المتجر</span>
            ) : (
              <button onClick={() => navigate('/seller/dashboard')} className="text-gray-500 hover:text-primary transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-gray-200 bg-white py-2">
        {person.isActive ? (
          <>
            <Link to="/seller/info" className={`flex flex-col items-center gap-0.5 transition-colors ${location.pathname === '/seller/info' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
              <User className="h-5 w-5" />
              <span className="text-[10px]">الحساب</span>
            </Link>
            <Link to="/seller/products" className={`flex flex-col items-center gap-0.5 transition-colors ${location.pathname === '/seller/products' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
              <Package className="h-5 w-5" />
              <span className="text-[10px]">منتجاتك</span>
            </Link>
          </>
        ) : null}
        <Link to="/seller/dashboard" className={`flex flex-col items-center gap-0.5 -mt-2 ${location.pathname === '/seller/dashboard' ? 'text-primary' : 'text-gray-400'}`}>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${location.pathname === '/seller/dashboard' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
            <Home className="h-5 w-5" />
          </div>
          <span className={`text-[10px] font-medium ${location.pathname === '/seller/dashboard' ? 'text-primary' : 'text-gray-400'}`}>الرئيسية</span>
        </Link>
        {person.isActive ? (
          <>
            <Link to="/seller/discounts" className={`flex flex-col items-center gap-0.5 transition-colors ${location.pathname === '/seller/discounts' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
              <BadgePercent className="h-5 w-5" />
              <span className="text-[10px]">خصوماتي</span>
            </Link>
            <Link to="/seller/offers" className={`flex flex-col items-center gap-0.5 transition-colors ${location.pathname === '/seller/offers' ? 'text-primary' : 'text-gray-400 hover:text-primary'}`}>
              <Gift className="h-5 w-5" />
              <span className="text-[10px]">عروضك</span>
            </Link>
          </>
        ) : null}
      </div>
    </>
  );
}
