import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { StoreService } from '@/services/StoreService';
import type { ProductSimpleInfoDto, AddOfferDto } from '@/types/dtos';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import Toast from '@/components/ui/toast';
import OfferProductCard from './Component/OfferProductCard';
import OfferForm from './Component/OfferForm';

function toUtcIso(dateStr: string): string {
  return `${dateStr}T00:00:00Z`;
}

interface OfferFormData {
  imageLink: string;
  title: string;
  description: string | null;
  offerPrice: number | null;
  startDate: string;
  endDate: string;
}

export default function AddOfferPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preSelectedId = searchParams.get('productId');

  const [products, setProducts] = useState<ProductSimpleInfoDto[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(false);
  const lastSeqRef = useRef<number>(Number.MAX_SAFE_INTEGER);

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    preSelectedId ? [preSelectedId] : []
  );

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const loadMore = useCallback(async () => {
    const result = await StoreService.getMyStoreProducts({
      lastSequenceProductNumber:
        lastSeqRef.current === Number.MAX_SAFE_INTEGER ? null : lastSeqRef.current,
      limit: 10,
    });
    if (result.isSuccess) {
      setProducts((prev) => [...prev, ...result.data.products]);
      if (result.data.products.length === 0) {
        setHasMore(false);
      } else {
        lastSeqRef.current = result.data.lastSequenceProductNumber ?? Number.MAX_SAFE_INTEGER;
      }
    } else {
      setErrorProducts(true);
    }
  }, []);

  useEffect(() => {
    loadMore().finally(() => setLoadingProducts(false));
  }, [loadMore]);

  const toggleProduct = (productId: string) => {
    setSelectedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleFormSubmit = async (formData: OfferFormData) => {
    setSaving(true);
    const data: AddOfferDto = {
      imageLink: formData.imageLink,
      title: formData.title,
      description: formData.description,
      offerPrice: formData.offerPrice,
      productsIds: selectedIds,
      startDate: toUtcIso(formData.startDate),
      endDate: toUtcIso(formData.endDate),
    };
    const result = await StoreService.addOffer(data);
    if (result.isSuccess) {
      showToast('success', 'تم إضافة العرض بنجاح');
      setTimeout(() => navigate('/seller/offers'), 1000);
    } else {
      showToast('error', 'فشل إضافة العرض');
    }
    setSaving(false);
  };

  if (errorProducts) return <ErrorPage />;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <div>
        <h1 className="text-xl font-bold text-gray-900">إضافة عرض</h1>
        <p className="text-sm text-gray-500 mt-1">املأ بيانات العرض الجديد</p>
      </div>

      <OfferForm onSubmit={handleFormSubmit} saving={saving} />

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">اختر المنتجات المشمولة اختيار</h2>
          <span className="text-xs text-gray-500">{selectedIds.length} منتج</span>
        </div>

        {loadingProducts ? (
          <Loader />
        ) : (
          <div id="offer-products-list" className="max-h-[480px] overflow-y-auto">
            <InfiniteScroll
              dataLength={products.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className="flex justify-center py-3">
                  <Loader />
                </div>
              }
              endMessage={
                <p className="text-center text-gray-400 py-3 text-xs">لا يوجد المزيد من المنتجات</p>
              }
              scrollableTarget="offer-products-list"
            >
              <div className="space-y-3">
                {products.map((product) => (
                  <OfferProductCard
                    key={product.id}
                    product={product}
                    checked={selectedIds.includes(product.id)}
                    onToggle={toggleProduct}
                  />
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
}
