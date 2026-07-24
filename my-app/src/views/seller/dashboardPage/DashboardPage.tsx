import { useEffect, useState } from 'react';
import Loader from '@/components/Loader';
import { useAuth } from '@/hooks/useAuth';
import { StoreService } from '@/services/StoreService';
import DashboardBoxes from './Component/DashboardBoxes';
import Toast from '@/components/ui/toast';

export default function DashboardPage() {
  const { user, setStore } = useAuth();
  const [loading, setLoading] = useState(!user.store);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });

  useEffect(() => {
    if (user.store) {
      setLoading(false);
      return;
    }

    const fetchStore = async () => {
      const result = await StoreService.getMyStore();
      if (result.isSuccess) {
        setStore(result.data);
      } else {
        setToast({
          open: true,
          type: 'error',
          message: `${result.error} (${result.statusCode})`,
        });
      }
      setLoading(false);
    };

    fetchStore();
  }, [user.store, setStore]);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      <DashboardBoxes store={user.store} />
    </>
  );
}
