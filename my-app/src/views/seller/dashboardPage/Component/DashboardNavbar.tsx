import type { StoreInfoForSellerDto, PersonAuthResponseDto } from '@/types/dtos';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { User, Headset, Store, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

interface Props {
  store: StoreInfoForSellerDto | null | undefined;
  person: PersonAuthResponseDto;
}

export default function DashboardNavbar({ store, person }: Props) {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
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

          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors">
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
      <div className="md:hidden flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/sallahlogo.png" alt="سلة جو" className="h-8 w-auto" />
        </div>
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
        <span className="text-[10px] text-gray-400">مدير المتجر</span>
      </div>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-gray-200 bg-white py-4">
        <Link to="/seller/info" className="flex flex-col items-center gap-0.5 text-primary">
          <User className="h-5 w-5" />
        </Link>
        <Link to="/seller/support" className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary transition-colors">
          <Headset className="h-5 w-5" />
        </Link>
        <Link to="/seller/store/info" className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary transition-colors">
          <Store className="h-5 w-5" />
        </Link>
        <button onClick={handleLogout} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-red-500 transition-colors">
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </>
  );
}
