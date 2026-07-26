import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreService } from '@/services/StoreService';
import type { StorePageInfoDto, OfferCustomerInfoDto, DiscountShortInfoDto } from '@/types/dtos';
import {
  setCustomerStore,
  setCustomerOffers,
  setCustomerDiscounts,
  getCustomerStore,
  getCustomerOffers,
  getCustomerDiscounts,
} from '@/libs/customerStorage';
import { initCart } from '@/libs/cart';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import StoreHeader from './Component/StoreHeader';
import CoverSection from './Component/CoverSection';
import OffersSection from './Component/OffersSection';
import DiscountsSection from './Component/DiscountsSection';
import ProductsSection from './Component/ProductsSection';
import StoreFooter from './Component/StoreFooter';
import BottomNav from '@/components/BottomNav';

export default function StorePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [store, setStore] = useState<StorePageInfoDto | null>(() => getCustomerStore());
  const [offers, setOffers] = useState<OfferCustomerInfoDto[]>(() => getCustomerOffers() || []);
  const [discounts, setDiscounts] = useState<DiscountShortInfoDto[]>(() => getCustomerDiscounts() || []);
  const [loadingStore, setLoadingStore] = useState(!getCustomerStore());
  const [storeError, setStoreError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      initCart();
      const storeResult = await StoreService.getStorePage(slug);
      if (storeResult.isSuccess) {
        setCustomerStore(storeResult.data);
        setStore(storeResult.data);
      } else {
        setStoreError(true);
        setLoadingStore(false);
        return;
      }

      const [offersResult, discountsResult] = await Promise.all([
        StoreService.getStoreOffers(slug),
        StoreService.getStoreDiscounts(slug),
      ]);

      if (offersResult.isSuccess) {
        const active = offersResult.data.filter((o) => o.isActive);
        setCustomerOffers(active);
        setOffers(active);
      }
      if (discountsResult.isSuccess) {
        setCustomerDiscounts(discountsResult.data);
        setDiscounts(discountsResult.data);
      }

      setLoadingStore(false);
    };

    load();
  }, [slug]);

  if (loadingStore) return <Loader />;
  if (storeError || !store) return <ErrorPage />;

  return (
    <div
      className="flex-1 w-full max-w-lg mx-auto bg-white md:border-x border-gray-200 min-h-screen relative"
      dir="rtl" lang="ar"
      style={{ '--color-primary': store.primaryColorCode } as React.CSSProperties}
    >
      <StoreHeader name={store.name} logoImageUrl={store.logoImageUrl} />

      <div className="pt-16 pb-14">
        <CoverSection
          coverImageLink={store.coverStoreImageLink}
          logoImageUrl={store.logoImageUrl}
          storeName={store.name}
        />

        <OffersSection
          offers={offers}
          onOfferClick={() => navigate(`/store/${slug}/offers`)}
          onViewAll={() => navigate(`/store/${slug}/offers`)}
        />
        <DiscountsSection
          discounts={discounts}
          slug={slug!}
          onViewAll={() => navigate(`/store/${slug}/discounts`)}
        />
        <ProductsSection slug={slug!} />

        <StoreFooter store={store} />
      </div>

      <BottomNav />
    </div>
  );
}
