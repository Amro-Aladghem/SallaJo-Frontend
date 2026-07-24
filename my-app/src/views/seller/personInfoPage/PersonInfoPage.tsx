import { useEffect, useState, useRef } from 'react';
import {SellerService} from '@/services/SellerService';
import { ToolService } from '@/services/ToolService';
import type { PersonInfoDto, UpdatePersonDto } from '@/types/dtos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import Toast from '@/components/ui/toast';
import { User, Save, RefreshCw, Camera, Loader2 } from 'lucide-react';

export default function PersonInfoPage() {
  const [info, setInfo] = useState<PersonInfoDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const fetchInfo = async () => {
    setLoading(true);
    setError(false);
    const result = await SellerService.getMyInfo();
    if (result.isSuccess) {
      setInfo(result.data);
      setImageUrl(result.data.imageUrl ?? '');
      setFirstName(result.data.firstName);
      setLastName(result.data.lastName);
      setEmail(result.data.email ?? '');
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await ToolService.uploadImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (result.isSuccess) {
      setImageUrl(result.data);
      showToast('success', 'تم رفع الصورة بنجاح');
    } else {
      showToast('error', 'فشل رفع الصورة');
    }
    setUploading(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!lastName.trim()) newErrors.lastName = 'اسم العائلة مطلوب';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const data: UpdatePersonDto = {
      firstName,
      lastName,
      email: email || null,
      imageUrl: imageUrl || null,
    };
    const result = await SellerService.updateInfo(data);
    if (result.isSuccess) {
      showToast('success', 'تم حفظ التغييرات بنجاح');
      await fetchInfo();
    } else {
      showToast('error', 'فشل حفظ التغييرات');
    }
    setSaving(false);
  };

  if (loading) return <Loader />;
  if (error || !info) return <ErrorPage />;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-gray-900">معلومات الحساب</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchInfo}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex justify-center">
          <div className="relative">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="صورتك"
                className="w-24 h-24 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-400" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -left-1 bg-white rounded-full p-1.5 shadow border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Camera className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="pi-first">الاسم الأول</Label>
            <Input
              id="pi-first"
              className="bg-gray-50"
              value={firstName}
              onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: '' })); }}
            />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pi-last">اسم العائلة</Label>
            <Input
              id="pi-last"
              className="bg-gray-50"
              value={lastName}
              onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: '' })); }}
            />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="pi-email">البريد الإلكتروني</Label>
            <Input
              id="pi-email"
              type="email"
              dir="ltr"
              className="bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-500">معلومات إضافية</h2>

        <div className="space-y-1.5">
          <Label htmlFor="pi-phone">رقم الهاتف</Label>
          <Input id="pi-phone" value={info.phone} disabled className="bg-gray-50 text-gray-900" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pi-role">الدور</Label>
          <Input id="pi-role" value={info.userRole} disabled className="bg-gray-50 text-gray-900" />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full">
        <Save className="ml-2 h-4 w-4" />
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </Button>
    </div>
  );
}
