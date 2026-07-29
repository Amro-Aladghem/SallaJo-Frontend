import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Toast from '@/components/ui/toast';
import { AdminService } from '@/services/AdminService';
import { useAuth } from '@/hooks/useAuth';
import { governorates } from '@/assets/Data/governorates';
import { Loader2, LogOut } from 'lucide-react';

interface DeliveryRow {
  governorateId: number;
  governorateName: string;
  isDelivered: boolean;
  amount: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user.person.userTypeId !== 3) {
      navigate('/admin/sign-in', { replace: true });
    }
  }, [user, navigate]);

  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false, type: '', message: '',
  });

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  // Activate Store
  const [activateStoreId, setActivateStoreId] = useState('');
  const [activateSlug, setActivateSlug] = useState('');
  const [activateIsHasDelivery, setActivateIsHasDelivery] = useState(false);
  const [activating, setActivating] = useState(false);

  const handleActivate = async () => {
    if (!activateStoreId.trim()) {
      showToast('error', 'يرجى إدخال معرف المتجر');
      return;
    }
    if (!activateSlug.trim()) {
      showToast('error', 'يرجى إدخال الرابط المختصر');
      return;
    }
    setActivating(true);
    const result = await AdminService.activateStoreSubscriptionByAdmin({
      storeId: activateStoreId.trim(),
      slug: activateSlug.trim(),
      isHasDelivery: activateIsHasDelivery,
    });
    if (result.isSuccess) {
      showToast('success', 'تم تفعيل المتجر بنجاح');
      setActivateStoreId('');
      setActivateSlug('');
      setActivateIsHasDelivery(false);
    } else {
      showToast('error', result.error || 'حدث خطأ أثناء التفعيل');
    }
    setActivating(false);
  };

  // Set Deliveries
  const [deliveryStoreId, setDeliveryStoreId] = useState('');
  const [deliveryRows, setDeliveryRows] = useState<DeliveryRow[]>(
    governorates.map((g) => ({
      governorateId: g.id,
      governorateName: g.name,
      isDelivered: false,
      amount: '',
    }))
  );
  const [savingDeliveries, setSavingDeliveries] = useState(false);

  const toggleDelivery = (id: number) => {
    setDeliveryRows((prev) =>
      prev.map((r) => (r.governorateId === id ? { ...r, isDelivered: !r.isDelivered } : r))
    );
  };

  const updateAmount = (id: number, value: string) => {
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setDeliveryRows((prev) =>
        prev.map((r) => (r.governorateId === id ? { ...r, amount: value } : r))
      );
    }
  };

  const handleSaveDeliveries = async () => {
    if (!deliveryStoreId.trim()) {
      showToast('error', 'يرجى إدخال معرف المتجر');
      return;
    }
    setSavingDeliveries(true);
    const deliveries = deliveryRows
      .filter((r) => r.isDelivered)
      .map((r) => ({
        governorateId: r.governorateId,
        isDelivery: r.isDelivered,
        amount: r.amount ? parseFloat(r.amount) : null,
      }));
    const result = await AdminService.setStoreDeliveries(deliveryStoreId.trim(), deliveries);
    if (result.isSuccess) {
      showToast('success', 'تم حفظ معلومات التوصيل بنجاح');
      setDeliveryStoreId('');
      setDeliveryRows(governorates.map((g) => ({
        governorateId: g.id,
        governorateName: g.name,
        isDelivered: false,
        amount: '',
      })));
    } else {
      showToast('error', result.error || 'حدث خطأ أثناء حفظ التوصيل');
    }
    setSavingDeliveries(false);
  };

  // Create Activation Code
  const [personId, setPersonId] = useState('');
  const [activationCode, setActivationCode] = useState<string | null>(null);
  const [creatingCode, setCreatingCode] = useState(false);

  const handleCreateCode = async () => {
    if (!personId.trim()) {
      showToast('error', 'يرجى إدخال معرف المستخدم');
      return;
    }
    setActivationCode(null);
    setCreatingCode(true);
    const result = await AdminService.createActivationCode(personId.trim());
    if (result.isSuccess) {
      setActivationCode(result.data);
      showToast('success', 'تم إنشاء كود التفعيل بنجاح');
    } else {
      showToast('error', result.error || 'حدث خطأ أثناء إنشاء الكود');
    }
    setCreatingCode(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/sign-in', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl" lang="ar">
      <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/sallahlogo.png" alt="سلة جو" className="h-9 w-auto" />
            <h1 className="font-bold text-lg text-gray-900">لوحة تحكم الأدمن</h1>
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Activate Store */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">تفعيل المتجر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>معرف المتجر (Store ID)</Label>
              <Input
                value={activateStoreId}
                onChange={(e) => setActivateStoreId(e.target.value)}
                placeholder="أدخل معرف المتجر"
              />
            </div>
            <div className="space-y-2">
              <Label>الرابط المختصر (Slug)</Label>
              <Input
                value={activateSlug}
                onChange={(e) => setActivateSlug(e.target.value)}
                placeholder="أدخل الرابط المختصر"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={activateIsHasDelivery}
                onCheckedChange={setActivateIsHasDelivery}
                id="isHasDelivery"
              />
              <Label htmlFor="isHasDelivery">المتجر يدعم التوصيل</Label>
            </div>
            <Button
              onClick={handleActivate}
              disabled={activating}
              className="w-full"
            >
              {activating ? (
                <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري التفعيل...</>
              ) : (
                'تفعيل المتجر'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Create Activation Code */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إنشاء كود التفعيل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>معرف المستخدم (Person ID)</Label>
              <Input
                value={personId}
                onChange={(e) => setPersonId(e.target.value)}
                placeholder="أدخل معرف المستخدم"
              />
            </div>
            <Button
              onClick={handleCreateCode}
              disabled={creatingCode}
              className="w-full"
            >
              {creatingCode ? (
                <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الإنشاء...</>
              ) : (
                'إنشاء كود التفعيل'
              )}
            </Button>
            {activationCode && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center space-y-2">
                <p className="text-sm text-green-700 font-medium">تم إنشاء الكود بنجاح</p>
                <p className="text-2xl font-bold text-green-900 tracking-widest ltr" dir="ltr">{activationCode}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Set Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">إعدادات التوصيل للمتجر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>معرف المتجر (Store ID)</Label>
              <Input
                value={deliveryStoreId}
                onChange={(e) => setDeliveryStoreId(e.target.value)}
                placeholder="أدخل معرف المتجر"
              />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-3">
              {deliveryRows.map((row) => (
                <div key={row.governorateId} className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0">
                  <input
                    type="checkbox"
                    checked={row.isDelivered}
                    onChange={() => toggleDelivery(row.governorateId)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700 min-w-[60px]">{row.governorateName}</span>
                  {row.isDelivered && (
                    <input
                      type="text"
                      value={row.amount}
                      onChange={(e) => updateAmount(row.governorateId, e.target.value)}
                      placeholder="سعر التوصيل"
                      className="flex-1 border border-gray-200 rounded px-2 py-1 text-sm outline-none focus:border-primary ltr text-left max-w-[120px]"
                    />
                  )}
                </div>
              ))}
            </div>

            <Button
              onClick={handleSaveDeliveries}
              disabled={savingDeliveries}
              className="w-full"
            >
              {savingDeliveries ? (
                <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...</>
              ) : (
                'حفظ إعدادات التوصيل'
              )}
            </Button>
          </CardContent>
        </Card>
      </main>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
