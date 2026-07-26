import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreService } from '@/services/StoreService';
import type { DiscountShortInfoDto } from '@/types/dtos';
import { getCustomerStore } from '@/libs/customerStorage';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';
import { ArrowRight } from 'lucide-react';

export default function DiscountsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState<DiscountShortInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const store = getCustomerStore();

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const result = await StoreService.getStoreDiscounts(slug);
      if (result.isSuccess) {
        setDiscounts(result.data);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-gray-200 py-3 px-4 flex items-center gap-3">
        <button onClick={() => navigate(`/store/${slug}`)} className="text-gray-600 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </button>
        <img src={store?.logoImageUrl} alt={store?.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
        <h1 className="font-bold text-base text-gray-900 truncate">{store?.name}</h1>
      </header>

      {!discounts.length ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-base">لا توجد خصومات حالياً</p>
        </div>
      ) : (
      <div className="px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">الخصومات</h1>
        <div className="grid grid-cols-2 gap-3">
          {discounts.map((discount) => (
            <ProductCard
              key={discount.product.id}
              product={discount.product}
              isSeller={false}
              isClickable
              linkTo={`/store/${slug}/products/${discount.product.id}`}
              isDiscount
              discountAmount={discount.discountAmount ?? undefined}
            />
          ))}
        </div>
      </div>
      )}
    </>
  );
}
