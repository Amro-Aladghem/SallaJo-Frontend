import { useLocation, useParams, Link } from 'react-router-dom';
import { Home, Percent, Gift, ShoppingCart } from 'lucide-react';
import { getCartCount } from '@/libs/cart';

export default function BottomNav() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  if (!slug) return null;

  const base = `/store/${slug}`;
  const isActive = (path: string) => location.pathname === path;
  const cartCount = getCartCount();

  const items = [
    { label: 'الخصومات', icon: Percent, href: `${base}/discounts` },
    { label: 'الرئيسية', icon: Home, href: base },
    { label: 'العروض', icon: Gift, href: `${base}/offers` },
    { label: 'السلة', icon: ShoppingCart, href: `${base}/cart` },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14 px-2">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                active ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? 'fill-primary/15' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.label === 'السلة' && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
