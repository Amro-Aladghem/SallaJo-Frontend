import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreService } from '@/services/StoreService';
import type { StoreInfoForCustomerDto } from '@/types/dtos';
import { governorates } from '@/assets/Data/governorates';
import { countries } from '@/assets/Data/countries';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import NotFoundPage from '@/components/NotFoundPage';
import { ArrowRight, Phone, MapPin, Mail, Instagram, Facebook, Share2 } from 'lucide-react';

export default function StoreInfoPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<StoreInfoForCustomerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const result = await StoreService.getStoreInfo(slug);
      if (result.isSuccess) {
        setStore(result.data);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;
  if (!store) return <NotFoundPage message="المتجر غير موجود" />;

  const shareUrl = `${window.location.origin}/store/${slug}`;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const governorateName = governorates.find((g) => g.id === store.governorateId)?.name || '';
  const countryName = countries.find((c) => c.id === store.countryId)?.name || '';

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-gray-200 py-3 px-4 flex items-center gap-3">
        <button onClick={() => navigate(`/store/${slug}`)} className="text-gray-600 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </button>
        {store.logoImageUrl && (
          <img src={store.logoImageUrl} alt={store.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
        )}
        <h1 className="font-bold text-base text-gray-900 truncate">{store.name}</h1>
      </header>

      <div className="flex flex-col items-center text-center py-8 px-4">
        <img
          src={store.logoImageUrl}
          alt={store.name}
          className="w-24 h-24 rounded-full border-2 border-gray-200 shadow-sm mb-4 object-cover"
        />
        <h1 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h1>
        {store.description && (
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{store.description}</p>
        )}
      </div>

      <div className="px-4 space-y-5 pb-8">
        <div className="bg-gray-50/50 rounded-xl p-4 space-y-4">
          {store.phoneNumber && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Phone className="w-5 h-5 text-primary shrink-0" />
              <span dir="ltr">{store.phoneNumber}</span>
            </div>
          )}

          {governorateName && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <MapPin className="w-5 h-5 text-primary shrink-0" />
              <span>
                {governorateName}{countryName ? `، ${countryName}` : ''}
              </span>
            </div>
          )}

          {store.email && (
            <div className="flex items-center gap-3 text-sm text-gray-700">
              <Mail className="w-5 h-5 text-primary shrink-0" />
              <span dir="ltr">{store.email}</span>
            </div>
          )}

          <button onClick={handleShare} className="flex items-center gap-3 text-sm text-gray-700 w-full text-right">
            <Share2 className="w-5 h-5 text-primary shrink-0" />
            <span dir="ltr" className="truncate flex-1">{shareUrl}</span>
            {copied && <span className="text-[10px] text-primary font-medium shrink-0">تم النسخ</span>}
          </button>
        </div>

        <a
          href={`https://wa.me/${store.phoneNumber?.replace(/^0+/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-primary text-white h-11 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Phone className="w-4 h-4 fill-current" />
          تواصل عبر واتساب
        </a>

        {(store.instagramLink || store.facebookLink) && (
          <div className="flex items-center justify-center gap-4">
            {store.instagramLink && (
              <a
                href={store.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {store.facebookLink && (
              <a
                href={store.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
}
