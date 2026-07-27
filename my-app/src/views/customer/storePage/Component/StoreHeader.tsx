import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  name: string;
  logoImageUrl: string;
}

export default function StoreHeader({ name, logoImageUrl }: Props) {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  return (
    <header className="fixed top-0 z-30 bg-gradient-to-b from-white to-gray-50/80 backdrop-blur border-b border-gray-200 shadow-sm py-2.5 px-4 flex items-center justify-between w-full max-w-lg" style={{ left: '50%', transform: 'translateX(-50%)' }}>
      <h1 className="font-bold text-base text-gray-900 truncate max-w-[270px]">{name}</h1>

      <button onClick={() => navigate(`/store/${slug}/info`)}>
        <div className="w-11 h-11 rounded-xl border-2 border-white shadow-md overflow-hidden bg-gray-100">
          <img src={logoImageUrl} alt={name} className="w-full h-full object-cover" />
        </div>
      </button>

    </header>
  );
}
