import { useState, useEffect, useRef, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { StoreService } from '@/services/StoreService';
import type { ProductSimpleInfoDto } from '@/types/dtos';
import {
  setCustomerProducts,
  appendCustomerProducts,
  getCustomerProducts,
} from '@/libs/customerStorage';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';
import Loader from '@/components/Loader';


interface Props {
  slug: string;
  storeAcceptsShowStock: boolean;
}

export default function ProductsSection({ slug, storeAcceptsShowStock }: Props) {
  const [products, setProducts] = useState<ProductSimpleInfoDto[]>(() => getCustomerProducts(slug) || []);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const lastSeqRef = useRef<number>(Number.MAX_SAFE_INTEGER);

  const loadMore = useCallback(async (replace = false) => {
    const result = await StoreService.getStoreProducts(slug, {
      lastSequenceProductNumber: replace || lastSeqRef.current === Number.MAX_SAFE_INTEGER ? null : lastSeqRef.current,
      limit: 10,
    });
    if (result.isSuccess) {
      setProducts((prev) => {
        const updated = replace ? result.data.products : [...prev, ...result.data.products];
        setCustomerProducts(slug, updated);
        return updated;
      });
      if (result.data.products.length === 0) {
        setHasMore(false);
      } else {
        lastSeqRef.current = result.data.lastSequenceProductNumber ?? Number.MAX_SAFE_INTEGER;
      }
    } else {
      setError(true);
    }
  }, [slug]);

  useEffect(() => {
    loadMore(true).finally(() => setLoading(false));
  }, [loadMore]);

  if (loading) return <div className="flex justify-center py-8"><Loader /></div>;
  if (error) return null;

  return (
    <section className="mt-8 px-4">
      <h2 className="font-bold text-lg relative inline-block mb-4">
        جميع المنتجات
        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-full" />
      </h2>

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
          <p className="text-center text-gray-400 py-4 text-xs">لا يوجد المزيد من المنتجات</p>
        }
      >
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isSeller={false}
              isClickable
              linkTo={`/store/${slug}/products/${product.id}`}
              isDiscount={!!product.amountOfDiscount}
              showOutOfStock={storeAcceptsShowStock}
            />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
}
