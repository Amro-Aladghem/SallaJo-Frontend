import { useEffect, useState, useRef, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { StoreService } from '@/services/StoreService';
import type { ProductSimpleInfoDto } from '@/types/dtos';
import ProductCard from './Component/ProductCard';
import ProductDialog from './Component/ProductDialog';
import AddProductDialog from './Component/AddProductDialog';
import ErrorPage from '@/components/ErrorPage';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductSimpleInfoDto[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const lastSeqRef = useRef<number>(Number.MAX_SAFE_INTEGER);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const loadMore = useCallback(async () => {
    const result = await StoreService.getMyStoreProducts({
      lastSequenceProductNumber:
        lastSeqRef.current === Number.MAX_SAFE_INTEGER ? null : lastSeqRef.current,
      limit: 8,
    });

    if (result.isSuccess) {
      setProducts((prev) => [...prev, ...result.data.products]);
      if (result.data.products.length === 0 && lastSeqRef.current === Number.MAX_SAFE_INTEGER) {
        setNotFound(true);
      } else if (result.data.products.length === 0) {
        setHasMore(false);
      } else {
        lastSeqRef.current = result.data.lastSequenceProductNumber ?? Number.MAX_SAFE_INTEGER;
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

  if (error) return <ErrorPage />;
  if (initialLoading) return <Loader />;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">منتجاتي</h1>
          <Button variant="ghost" size="sm" onClick={refreshList}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white" onClick={() => setShowAddDialog(true)}>
          <Plus className="ml-1 h-4 w-4" /> إضافة منتج
        </Button>
      </div>

      {notFound ? (
        <div className="text-center py-16">
          <p className="text-gray-400">لم تقم بإضافة أية منتجات بعد</p>
        </div>
      ) : (

      <InfiniteScroll
        dataLength={products.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-4">
            <Loader />
          </div>
        }
        endMessage={
          <p className="text-center text-gray-400 py-4">لا يوجد المزيد من المنتجات</p>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSeller
              onClick={() => setSelectedProductId(product.id)}
            />
          ))}
        </div>
      </InfiniteScroll>
      )}

      {selectedProductId && (
        <ProductDialog
          productId={selectedProductId}
          open={!!selectedProductId}
          onClose={() => setSelectedProductId(null)}
          onRefreshList={refreshList}
        />
      )}

      <AddProductDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSuccess={refreshList}
      />
    </div>
  );
}
