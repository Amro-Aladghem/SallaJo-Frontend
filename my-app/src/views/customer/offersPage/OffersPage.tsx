import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreService } from '@/services/StoreService';
import type { OfferCustomerInfoDto } from '@/types/dtos';
import { getCustomerStore } from '@/libs/customerStorage';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import NotFoundPage from '@/components/NotFoundPage';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function OffersPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferCustomerInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const store = getCustomerStore();

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const result = await StoreService.getStoreOffers(slug);
      if (result.isSuccess) {
        setOffers(result.data.filter((o) => o.isActive));
      } else {
        setError(true);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;
  if (!offers.length) return <NotFoundPage message="لا توجد عروض حالياً" />;

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-gray-200 py-3 px-4 flex items-center gap-3">
        <button onClick={() => navigate(`/store/${slug}`)} className="text-gray-600 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </button>
        {store && (
          <>
            <img src={store.logoImageUrl} alt={store.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
            <h1 className="font-bold text-base text-gray-900 truncate">{store.name}</h1>
          </>
        )}
      </header>

      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">العروض</h1>
        <div className="space-y-6">
        {offers.map((offer) => (
          <div key={offer.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {offer.imageLink && (
              <img
                src={offer.imageLink}
                alt={offer.title}
                className="w-full h-52 object-cover"
              />
            )}
            <div className="p-4 space-y-2">
              <h2 className="font-bold text-lg text-gray-900">{offer.title}</h2>
              {offer.description && (
                <p className="text-sm text-gray-500 leading-relaxed">{offer.description}</p>
              )}
            </div>
            {offer.products && offer.products.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-3">
                <p className="text-xs text-gray-500 mb-2 font-medium">المنتجات المشمولة</p>
                <div className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-3">
                    {offer.products.map((product) => (
                      <div key={product.id} className="flex-[0_0_45%] min-w-[140px]">
                        <ProductCard
                          product={product}
                          isSeller={false}
                          isClickable={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </>
  );
}
