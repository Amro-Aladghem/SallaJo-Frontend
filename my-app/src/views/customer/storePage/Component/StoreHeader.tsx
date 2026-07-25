import { useNavigate, useParams } from 'react-router-dom';
import { getCartCount } from '@/libs/cart';

interface Props {
  name: string;
  logoImageUrl: string;
}

export default function StoreHeader({ name, logoImageUrl }: Props) {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const cartCount = getCartCount();

  return (
    <header className="fixed top-0 z-30 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur border-b border-gray-200 shadow-sm py-2.5 px-4 flex items-center justify-between w-full max-w-lg" style={{ left: '50%', transform: 'translateX(-50%)' }}>
      <h1 className="font-bold text-base text-gray-900 truncate max-w-[120px]">{name}</h1>

      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="w-11 h-11 rounded-xl border-2 border-white shadow-md overflow-hidden bg-gray-100">
          <img src={logoImageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      </div>

      <button
        onClick={() => navigate(`/store/${slug}/cart`)}
        className="relative w-10 h-10 flex items-center justify-center"
      >
        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))' }}
        >
          <path
            d="M4 5h3.5l2.5 14h14l3-10H9"
            stroke="#1a1a1a"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="13" cy="26" r="2" fill="#1a1a1a" />
          <circle cx="24" cy="26" r="2" fill="#1a1a1a" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
            {cartCount > 9 ? '9+' : cartCount}
          </span>
        )}
      </button>
    </header>
  );
}
