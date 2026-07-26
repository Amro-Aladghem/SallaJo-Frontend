import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Toast from '@/components/ui/toast';
import { SellerService } from '@/services/SellerService';
import { StoreService } from '@/services/StoreService';
import { PersonService } from '@/services/PersonService';
import { useAuth } from '@/hooks/useAuth';
import { governorates } from '@/assets/Data/governorates';
import { Loader2, ChevronLeft, Camera, CheckCircle, MessageCircle, User, Store, Key } from 'lucide-react';

const STAGE_KEY = 'seller-stage';

type Stage = 'initial' | 'pending';

function getStage(): Stage | null {
  const raw = sessionStorage.getItem(STAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.stage === 'initial' || parsed.stage === 'pending' ? parsed.stage : null;
  } catch {
    return null;
  }
}

function setStage(stage: Stage) {
  sessionStorage.setItem(STAGE_KEY, JSON.stringify({ stage }));
}

function clearStage() {
  sessionStorage.removeItem(STAGE_KEY);
}

export default function PendingDashboard() {
  const navigate = useNavigate();
  const { user, setPerson } = useAuth();

  const currentStage = getStage() || 'initial';
  const [stage, setStageState] = useState<Stage>(currentStage);
  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [sellerId, setSellerId] = useState('');
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false, type: '', message: '',
  });

  // Step 1 fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [personGovernorateId, setPersonGovernorateId] = useState(0);

  // Step 2 fields
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeGovernorateId, setStoreGovernorateId] = useState(0);
  const [storeLogoFile, setStoreLogoFile] = useState<File | null>(null);
  const [storeLogoPreview, setStoreLogoPreview] = useState('');
  const storeFileRef = useRef<HTMLInputElement>(null);

  // Activation
  const [activationCode, setActivationCode] = useState('');

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  useEffect(() => {
    if (stage === 'initial') {
      setStage('initial');
    }
  }, []);

  const handleSelectStoreLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStoreLogoFile(file);
    setStoreLogoPreview(URL.createObjectURL(file));
  };

  const handleStep1Next = async () => {
    if (!firstName.trim() || !lastName.trim() || !personGovernorateId) {
      showToast('error', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    const result = await SellerService.addInitialInfo({
      fristName: firstName.trim(),
      lastName: lastName.trim(),
      imageUrl: null,
      governorateId: personGovernorateId,
    });
    if (result.isSuccess) {
      setSellerId(result.data);
      setStoreGovernorateId(personGovernorateId);
      setStep(2);
    } else {
      showToast('error', 'فشل حفظ المعلومات، حاول مرة أخرى');
    }
    setLoading(false);
  };

  const handleStep2Save = async () => {
    if (!storeName.trim() || !storeGovernorateId) {
      showToast('error', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    const result = await StoreService.createStore({
      name: storeName.trim(),
      description: storeDescription.trim() || null,
      governorateId: storeGovernorateId,
      sellerId: sellerId,
      logoImageUrl: null,
    }, storeLogoFile || undefined);
    if (result.isSuccess) {
      setStage('pending');
      clearStage();
      setStage('pending');
      setStageState('pending');
      showToast('success', 'تم إنشاء المتجر بنجاح');
    } else {
      showToast('error', 'فشل إنشاء المتجر، حاول مرة أخرى');
    }
    setLoading(false);
  };

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      showToast('error', 'يرجى إدخال كود التفعيل');
      return;
    }
    setLoading(true);
    const result = await PersonService.activate(activationCode.trim());
    if (result.isSuccess) {
      clearStage();
      showToast('success', 'لقد اصبحت الأن قادر على انشاء متجرك مجانا تفضل بتسجيل الدخول');
      setTimeout(() => navigate('/seller/sign-in', { replace: true }));
    } else {
      showToast('error', 'كود التفعيل غير صحيح، حاول مرة أخرى');
    }
    setLoading(false);
  };

  const handleChat = () => {
    const WA_NUMBER = '962796102413';
    const msg = encodeURIComponent(
        `مرحبا فريق سلة جو , اريد كود تفعيل حسابي المجاني لأنشاء المتجر رقم معرفي: ${user.person.sysId}`
      );
    
    window.open(`https://wa.me/${WA_NUMBER}?text=${msg}`, '_blank');
  };

  if (stage === 'initial') {
    return (
      <>
        <input
          ref={storeFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSelectStoreLogo}
        />

        <Toast
          open={toast.open}
          type={toast.type}
          message={toast.message}
          handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
        />

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <div className="flex items-center gap-1.5">
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-gray-500 hover:text-primary transition-colors">
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <h1 className="text-xl font-bold text-gray-900">
              {step === 1 ? 'المعلومات الأولية' : 'معلومات المتجر'}
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-primary' : 'text-gray-300'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
              <span className="text-xs font-medium">صاحب المتجر</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-primary' : 'text-gray-300'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
              <span className="text-xs font-medium">المتجر</span>
            </div>
          </div>

          {step === 1 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <div className="flex justify-center">
                <User className="h-14 w-14 text-primary/40" />
              </div>

              <div className="space-y-1.5">
                <Label>الاسم الأول</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="محمد" />
              </div>
              <div className="space-y-1.5">
                <Label>اسم العائلة</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="أحمد" />
              </div>
              <div className="space-y-1.5">
                <Label>المحافظة</Label>
                <select
                  value={personGovernorateId}
                  onChange={(e) => setPersonGovernorateId(Number(e.target.value))}
                  className="flex h-9 w-full rounded-md border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value={0}>اختر المحافظة</option>
                  {governorates.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <Button onClick={handleStep1Next} disabled={loading} className="w-full">
                {loading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري...</> : 'التالي'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  {storeLogoPreview ? (
                    <img src={storeLogoPreview} alt="" className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Store className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => storeFileRef.current?.click()}
                    className="absolute -bottom-1 -left-1 bg-white rounded-full p-1.5 shadow border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>اسم المتجر</Label>
                <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="متجري" />
              </div>
              <div className="space-y-1.5">
                <Label>الوصف</Label>
                <textarea
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="وصف بسيط لمتجرك"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label>المحافظة</Label>
                <select
                  value={storeGovernorateId}
                  onChange={(e) => setStoreGovernorateId(Number(e.target.value))}
                  className="flex h-9 w-full rounded-md border border-input bg-gray-50 px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value={0}>اختر المحافظة</option>
                  {governorates.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <Button onClick={handleStep2Save} disabled={loading} className="w-full">
                {loading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري الحفظ...</> : 'حفظ'}
              </Button>
            </div>
          )}
        </div>
      </>
    );
  }

  if (stage === 'pending') {
    return (
      <>
        <Toast
          open={toast.open}
          type={toast.type}
          message={toast.message}
          handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
        />

        <div className="max-w-lg mx-auto px-4 py-8 space-y-6 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-14 w-14 text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 leading-relaxed">
            تواصل الأن مع<br />الدعم الفني لسلة جو
          </h1>

          <p className="text-gray-600 text-base leading-loose">
            لأعطائك كود تفعيل حسابك كبائع
            <br />
            وتستطيع إنشاء المتجر الخاص بك
          </p>

          <p className="text-green-600 font-semibold text-base">
            مجانا لا يوجد عملية دفع
            <br />
            الكود سوف يعطى مجانا
          </p>

          <p className="text-gray-500 text-sm">
            الدعم الفني لأمكانية التحقق من شخصيتك فقط.
          </p>

          <p className="text-gray-700 font-medium text-base">
            الأن خلال ثواني الرد
          </p>

          {/* Activation code input */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3 text-right">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              أدخل كود التفعيل
            </Label>
            <Input
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value)}
              placeholder="XXXXXX"
              dir="ltr"
              className="text-center tracking-[0.3em]"
            />
            <Button onClick={handleActivate} disabled={loading} className="w-full">
              {loading ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري...</> : 'تفعيل'}
            </Button>
          </div>

          <button
            onClick={handleChat}
            className="inline-flex items-center justify-center gap-3 bg-primary text-white font-semibold text-base px-8 py-4 rounded-xl transition-colors shadow-md hover:shadow-lg w-full"
          >
            <MessageCircle className="h-6 w-6" />
            تواصل مع موظف سلة جو
          </button>
        </div>
      </>
    );
  }

  return null;
}
