import { useEffect, useState, useRef } from 'react';
import { StoreService } from '@/services/StoreService';
import { ToolService } from '@/services/ToolService';
import { useAuth } from '@/hooks/useAuth';
import { colors } from '@/assets/Data/colors';
import { governorates } from '@/assets/Data/governorates';
import type { StoreInfoForSellerDto, UpdateStoreInfoDto } from '@/types/dtos';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import Toast from '@/components/ui/toast';
import { Store, Save, RefreshCw, Camera, Loader2, Copy } from 'lucide-react';

const colorHex: Record<string, string> = {
  أحمر: '#FF0000', أزرق: '#0000FF', أصفر: '#FFFF00', أخضر: '#008000',
  أسود: '#000000', أبيض: '#FFFFFF', برتقالي: '#FFA500', بنفسجي: '#800080',
  وردي: '#FFC0CB', بني: '#A52A2A', رمادي: '#808080', سماوي: '#00FFFF',
  كحلي: '#000080', زيتي: '#808000', خمري: '#800000', ذهبي: '#FFD700',
  فضي: '#C0C0C0', بيج: '#F5F5DC', فيروزي: '#40E0D0', أرجواني: '#FF00FF',
};

function getColorHex(colorId: number): string {
  const c = colors.find((c) => c.id === colorId);
  return c ? colorHex[c.name] || '#cccccc' : '#cccccc';
}

export default function StoreInfoPage() {
  const { user, setStore: setContextStore } = useAuth();
  const [store, setLocalStore] = useState<StoreInfoForSellerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');
  const [welcomeHeaderText, setWelcomeHeaderText] = useState('');
  const [governorateId, setGovernorateId] = useState<number>(0);
  const [primaryColorId, setPrimaryColorId] = useState<number>(0);
  const [secondaryColorId, setSecondaryColorId] = useState<number>(0);
  const [isAcceptedToShowStoke, setIsAcceptedToShowStoke] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const storeId = user.seller?.storeId;

  const storeUrl = store?.slug ? `https://sallahjo.taskalyze.com/store/${store.slug}` : '---';

  const handleCopyLink = async () => {
    if (!store?.slug) return;
    try {
      await navigator.clipboard.writeText(storeUrl);
      showToast('success', 'تم نسخ الرابط');
    } catch {
      showToast('error', 'فشل نسخ الرابط');
    }
  };

  const fetchStore = async () => {
    setLoading(true);
    setError(false);
    const result = await StoreService.getMyStore();
    if (result.isSuccess) {
      setContextStore(result.data);
      setLocalStore(result.data);
      setLogoUrl(result.data.logoImageUrl);
      setCoverUrl(result.data.coverStoreImageLink ?? '');
      setName(result.data.name);
      setDescription(result.data.description);
      setPhoneNumber(result.data.phoneNumber);
      setEmail(result.data.email ?? '');
      setFacebookLink(result.data.facebookLink ?? '');
      setInstagramLink(result.data.instagramLink ?? '');
      setWelcomeHeaderText(result.data.welcomeHeaderText ?? '');
      setGovernorateId(result.data.governorateId);
      setPrimaryColorId(result.data.primaryColorId);
      setSecondaryColorId(result.data.secondaryColorId);
      setIsAcceptedToShowStoke(result.data.isAcceptedToShowStoke);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStore();
  }, []);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const result = await ToolService.uploadImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (result.isSuccess) {
      setLogoUrl(result.data);
      showToast('success', 'تم رفع الشعار بنجاح');
    } else {
      showToast('error', 'فشل رفع الشعار');
    }
    setUploadingLogo(false);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const result = await ToolService.uploadImage(file);
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (result.isSuccess) {
      setCoverUrl(result.data);
      showToast('success', 'تم رفع صورة البداية بنجاح');
    } else {
      showToast('error', 'فشل رفع صورة البداية');
    }
    setUploadingCover(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'اسم المتجر مطلوب';
    if (!description.trim()) newErrors.description = 'الوصف مطلوب';
    if (!phoneNumber.trim()) newErrors.phoneNumber = 'رقم الهاتف مطلوب';
    if (!governorateId) newErrors.governorateId = 'المحافظة مطلوبة';
    if (!primaryColorId) newErrors.primaryColorId = 'اللون الأساسي مطلوب';
    if (!secondaryColorId) newErrors.secondaryColorId = 'اللون الثانوي مطلوب';
    if (!welcomeHeaderText.trim()) newErrors.welcomeHeaderText = 'الرسالة الترحيبية مطلوبة';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!storeId || !validate()) return;
    setSaving(true);
    const data: UpdateStoreInfoDto = {
      name,
      description,
      phoneNumber,
      email: email || null,
      facebookLink: facebookLink || null,
      instagramLink: instagramLink || null,
      welcomeHeaderText: welcomeHeaderText || null,
      governorateId,
      primaryColorId,
      secondaryColorId,
      logoImageUrl: logoUrl,
      coverStoreImageLink: coverUrl || null,
      isAcceptedToShowStoke,
    };
    const result = await StoreService.updateStore(storeId, data);
    if (result.isSuccess) {
      showToast('success', 'تم حفظ التغييرات بنجاح');
      await fetchStore();
    } else {
      showToast('error', 'فشل حفظ التغييرات');
    }
    setSaving(false);
  };

  if (loading) return <Loader />;
  if (error || !store) return <ErrorPage />;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoChange}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverChange}
      />

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-gray-900">معلومات المتجر</h1>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchStore}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={logoUrl}
              alt={store.name}
              className="w-24 h-24 rounded-lg object-cover border border-gray-200"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingLogo}
              className="absolute -bottom-1 -left-1 bg-white rounded-full p-1.5 shadow border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {uploadingLogo ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Camera className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>صورة بداية الموقع</Label>
          <div className="relative">
            {coverUrl ? (
              <img
                src={coverUrl}
                alt="صورة بداية الموقع"
                className="w-full h-32 rounded-lg object-cover border border-gray-200"
              />
            ) : (
              <div className="w-full h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-400">لا توجد صورة</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute top-2 left-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow border border-gray-200 transition-colors"
            >
              {uploadingCover ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Camera className="h-4 w-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="si-name">اسم المتجر</Label>
            <Input id="si-name" className="bg-gray-50" value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }} />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="si-desc">الوصف</Label>
            <Textarea
              id="si-desc"
              rows={3}
              className="bg-gray-50"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="si-phone">رقم الهاتف</Label>
            <Input
              id="si-phone"
              dir="ltr"
              className="bg-gray-50"
              value={phoneNumber}
              onChange={(e) => { setPhoneNumber(e.target.value); setErrors((p) => ({ ...p, phoneNumber: '' })); }}
            />
            {errors.phoneNumber && <p className="text-xs text-red-500">{errors.phoneNumber}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="si-email">البريد الإلكتروني</Label>
            <Input
              id="si-email"
              type="email"
              dir="ltr"
              className="bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="si-facebook">رابط فيسبوك</Label>
            <Input
              id="si-facebook"
              dir="ltr"
              className="bg-gray-50"
              value={facebookLink}
              onChange={(e) => setFacebookLink(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="si-instagram">رابط إنستغرام</Label>
            <Input
              id="si-instagram"
              dir="ltr"
              className="bg-gray-50"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="si-welcome">الرسالة الترحيبية بزوار الموقع</Label>
            <Textarea
              id="si-welcome"
              rows={2}
              className="bg-gray-50"
              value={welcomeHeaderText}
              onChange={(e) => setWelcomeHeaderText(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="si-gov">المحافظة</Label>
            <select
              id="si-gov"
              value={governorateId}
              onChange={(e) => { setGovernorateId(Number(e.target.value)); setErrors((p) => ({ ...p, governorateId: '' })); }}
              className="flex h-9 w-full rounded-md border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={0}>اختر المحافظة</option>
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
            {errors.governorateId && <p className="text-xs text-red-500">{errors.governorateId}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>اللون الأساسي</Label>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: getColorHex(primaryColorId) }}
              />
              <select
                value={primaryColorId}
                onChange={(e) => { setPrimaryColorId(Number(e.target.value)); setErrors((p) => ({ ...p, primaryColorId: '' })); }}
                className="flex h-9 w-full rounded-md border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value={0}>اختر اللون</option>
                {colors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.primaryColorId && <p className="text-xs text-red-500">{errors.primaryColorId}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>اللون الثانوي</Label>
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: getColorHex(secondaryColorId) }}
              />
              <select
                value={secondaryColorId}
                onChange={(e) => { setSecondaryColorId(Number(e.target.value)); setErrors((p) => ({ ...p, secondaryColorId: '' })); }}
                className="flex h-9 w-full rounded-md border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value={0}>اختر اللون</option>
                {colors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.secondaryColorId && <p className="text-xs text-red-500">{errors.secondaryColorId}</p>}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div>
              <Label className="text-sm font-medium">إظهار المخزون</Label>
              <p className="text-xs text-gray-500">
                {isAcceptedToShowStoke ? 'المخزون مرئي للعملاء' : 'المخزون مخفي عن العملاء'}
              </p>
            </div>
            <Switch
              checked={isAcceptedToShowStoke}
              onCheckedChange={setIsAcceptedToShowStoke}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
        <h2 className="text-sm font-bold text-gray-500">معلومات إضافية</h2>

          <div className="space-y-1.5">
            <Label htmlFor="si-slug">رابط متجرك</Label>
            <div className="flex gap-2">
              <Input
                id="si-slug"
                value={storeUrl}
                disabled
                className="bg-gray-50 text-gray-900 flex-1"
              />
              <Button variant="outline" size="icon" onClick={handleCopyLink} className="shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

        <div className="space-y-1.5">
          <Label htmlFor="si-activated">حالة التفعيل</Label>
          <Input
            id="si-activated"
            value={store.isActivatedStore ? 'مفعل' : 'غير مفعل'}
            disabled
            className="bg-gray-50 text-gray-900"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="si-completed">اكتمال الملف</Label>
          <Input
            id="si-completed"
            value={store.isCompletedStoreProfile ? 'مكتمل' : 'غير مكتمل'}
            disabled
            className="bg-gray-50 text-gray-900"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving || !storeId} className="w-full">
        <Save className="ml-2 h-4 w-4" />
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </Button>
    </div>
  );
}
