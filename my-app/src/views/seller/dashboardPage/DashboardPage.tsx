import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '@/components/Loader';
import { useAuth } from '@/hooks/useAuth';
import { StoreService } from '@/services/StoreService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DashboardBoxes from './Component/DashboardBoxes';
import PendingDashboard from './Component/PendingDashboard';
import Toast from '@/components/ui/toast';
import { Store } from 'lucide-react';
import ErrorPage from '@/components/ErrorPage';

export default function DashboardPage() {
  const { user, setStore } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(user.person.isActive);
  const [ErrorLoadingData, setErrorLoadingData] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!user.person.isActive) {
      setLoading(false);
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchStore = async () => {
      const result = await StoreService.getMyStore();
      if (result.isSuccess) {
        setStore(result.data);
      } else {
        setToast({
          open: true,
          type: 'error',
          message: `فشل تحميل بيانات المتجر الرجاء تحديث الصفحة`,
        });
        setErrorLoadingData(true);  
      }
      setLoading(false);
    };

    fetchStore();
  }, [setStore, user.person.isActive]);

  if (loading) {
    return <Loader />;
  }

  if (!user.person.isActive) {
    return <PendingDashboard />;
  }

  if(ErrorLoadingData) return <ErrorPage/>;

  const store = user.store;
  if (store && !store.isCompletedStoreProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
          <Card className="w-full border border-gray-200 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">إنشاء متجرك</h2>
              <p className="text-sm text-gray-500">قم بتصميم متجرك وإضافة المعلومات الأساسية ليظهر للعملاء</p>
              <Button onClick={() => navigate('/seller/store/design')} className="w-full py-5 text-base font-bold">
                ابدأ الآن
              </Button>
            </CardContent>
          </Card>
          <Card className="w-full border border-gray-200 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">شاهد متجراً  لعملائنا</h2>
              <p className="text-sm text-gray-500">اطلع على متجر حقيقي لترى كيف سيبدو متجرك</p>
              <a href="https://sallahjo.taskalyze.com/store/cookienoura" target="_blank" rel="noopener noreferrer" className="w-full">
                <Button className="w-full py-5 text-base font-bold">
                  عرض المتجر
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />
      <DashboardBoxes store={store} />
    </>
  );
}
