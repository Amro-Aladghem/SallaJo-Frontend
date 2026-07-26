import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { StoreService } from '@/services/StoreService';
import { ProductController } from '@/services/ProductController';
import type { ProductSimpleInfoDto } from '@/types/dtos';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';
import ErrorPage from '@/components/ErrorPage';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { RefreshCw, Minus, Plus, Package, Check, X as XIcon } from 'lucide-react';

interface StockProduct extends ProductSimpleInfoDto {
  _stock: number;
}

function StockToast({ message, type, onDone }: { message: string; type: 'success' | 'error'; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg text-sm font-medium transition-all ${
      type === 'success' ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
    }`}>
      {type === 'success' ? <Check className="h-4 w-4" /> : <XIcon className="h-4 w-4" />}
      {message}
    </div>
  );
}

export default function StockPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<StockProduct[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Record<string, boolean>>({});
  const lastSeqRef = useRef<number>(Number.MAX_SAFE_INTEGER);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const loadMore = useCallback(async () => {
    const result = await StoreService.getMyStoreProducts({
      lastSequenceProductNumber:
        lastSeqRef.current === Number.MAX_SAFE_INTEGER ? null : lastSeqRef.current,
      limit: 8,
    });

    if (result.isSuccess) {
      const mapped: StockProduct[] = result.data.products.map((p) => ({
        ...p,
        _stock: p.stock ?? 0,
      }));
      setProducts((prev) => [...prev, ...mapped]);
      if (result.data.products.length === 0 && lastSeqRef.current === Number.MAX_SAFE_INTEGER) {
        setNotFound(true);
      } else if (result.data.products.length === 0) {
        setHasMore(false);
      } else {
        lastSeqRef.current = result.data.lastSequenceProductNumber;
      }
    } else {
      setError(true);
    }
  }, []);

  const refreshList = useCallback(() => {
    setProducts([]);
    setHasMore(true);
    setNotFound(false);
    setInitialLoading(true);
    lastSeqRef.current = Number.MAX_SAFE_INTEGER;
    loadMore().finally(() => setInitialLoading(false));
  }, [loadMore]);

  useEffect(() => {
    loadMore().finally(() => setInitialLoading(false));
  }, [loadMore]);

  const handleStockChange = async (id: string, change: number) => {
    if (updatingIds[id]) return;
    setUpdatingIds((prev) => ({ ...prev, [id]: true }));
    const result = await ProductController.updateStock(id, change);
    if (result.isSuccess) {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, _stock: p._stock + change } : p))
      );
      showToast(`تم تعديل المخزون`, 'success');
    } else {
      showToast('فشل تعديل المخزون', 'error');
    }
    setUpdatingIds((prev) => ({ ...prev, [id]: false }));
  };

  if (error) return <ErrorPage />;
  if (initialLoading) return <Loader />;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">إدارة المخزون</h1>
          <Button variant="ghost" size="sm" onClick={refreshList}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-xs text-gray-500">{products.length} منتج</span>
      </div>
      <p className="text-xs text-gray-400 mb-1 leading-relaxed">
        هذه الصفحة لإدارة المخزون أثناء العمل والبيع للعملاء
        <br />
        إذا أردت إضافة كمية كبيرة للمخزن وتحديثها اذهب لصفحة <button onClick={() => navigate('/seller/products')} className="text-primary hover:underline font-medium inline align-baseline">المنتجات</button>.
      </p>
      <p className="text-xs text-red-500 mb-4 leading-relaxed">
        في الحالة الافتراضية لن يتم إظهار الكمية للعميل يمكنك تغييرها من الإعدادات المتجر وتفعيلها
        <br />
        ولكنك لن تستقبل طلبات للمنتج في حال عدم تحديث للكميات بشكل فعلي ومستمر لأنها قد تنفذ داخل النظام
      </p>

      {notFound ? (
        <div className="text-center py-16">
          <p className="text-gray-400">لم تقم بإضافة أية منتجات بعد</p>
        </div>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={loadMore}
          hasMore={hasMore}
          loader={<div className="flex justify-center py-4"><Loader /></div>}
          endMessage={<p className="text-center text-gray-400 py-4">لا يوجد المزيد من المنتجات</p>}
        >
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white">
                <ProductCard product={product} isSeller isClickable={false} />
                <div className="px-3 pb-3 pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleStockChange(product.id, -1)}
                      disabled={updatingIds[product.id] || product._stock <= 0}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Package className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-bold text-gray-900">{product._stock}</span>
                    </div>
                    <button
                      onClick={() => handleStockChange(product.id, 1)}
                      disabled={updatingIds[product.id]}
                      className="w-8 h-8 rounded-full bg-green-50 text-green-500 hover:bg-green-100 transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      )}

      {toast && <StockToast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
