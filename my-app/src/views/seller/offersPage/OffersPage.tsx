import { useEffect, useState, useCallback } from 'react';
import { StoreService } from '@/services/StoreService';
import type { OfferFullInfoDto } from '@/types/dtos';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import NotFoundPage from '@/components/NotFoundPage';
import Toast from '@/components/ui/toast';
import OfferCard from './Component/OfferCard';
import UpdateOfferDialog from './Component/UpdateOfferDialog';

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferFullInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false, type: '', message: '',
  });
  const [updateOffer, setUpdateOffer] = useState<OfferFullInfoDto | null>(null);

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    setError(false);
    const result = await StoreService.getAllOffers();
    if (result.isSuccess) {
      setOffers(result.data);
    } else {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleToggleStatus = async (id: string) => {
    setToggling(true);
    const result = await StoreService.toggleOfferStatus(id);
    if (result.isSuccess) {
      setOffers((prev) =>
        prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
      );
      showToast('success', 'تم تغيير حالة العرض بنجاح');
    } else {
      showToast('error', result.error || 'فشل تغيير حالة العرض');
    }
    setToggling(false);
  };

  const handleUpdateSuccess = () => {
    fetchOffers();
  };

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;
  if (offers.length === 0) return <NotFoundPage message="لا توجد عروض حالياً" />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">العروض</h1>
        <span className="text-xs text-gray-500">{offers.length} عرض</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onToggleStatus={handleToggleStatus}
            onUpdate={setUpdateOffer}
            toggling={toggling}
          />
        ))}
      </div>

      {updateOffer && (
        <UpdateOfferDialog
          open={!!updateOffer}
          onOpenChange={(open) => { if (!open) setUpdateOffer(null); }}
          offer={updateOffer}
          onSuccess={handleUpdateSuccess}
        />
      )}

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
