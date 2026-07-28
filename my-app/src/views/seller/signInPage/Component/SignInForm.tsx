import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Toast from '@/components/ui/toast';
import Loader from '@/components/Loader';
import { PersonService } from '@/services/PersonService';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export default function SignInForm() {
  const navigate = useNavigate();
  const { setPerson } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });


  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  function validate(): string | null {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) return 'يرجى إدخال رقم الهاتف';

    if (!/^07[789]\d{7}$/.test(trimmedPhone))
      return 'رقم الهاتف يجب أن يبدأ بـ 079 أو 078 أو 077 ويتكون من 10 أرقام';

    if (!password) return 'يرجى إدخال كلمة المرور';

    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      showToast('error', error);
      return;
    }

    setLoading(true);

    const result = await PersonService.login({ phone: phone.trim(), password });

    if (result.isSuccess) {
      setPerson(result.data);
      setTimeout(() => navigate('/seller/auth'), 1000);
    } else {
      showToast('error', `كلمة السر او رقم الهاتف غير صحيح`);
    }

    setLoading(false);
  };

  const refreshCalled = useRef(false);

  useEffect(() => {
    if (refreshCalled.current) return;
    refreshCalled.current = true;

    const tryRefresh = async () => {
      const result = await PersonService.refreshToken();
      if (result.isSuccess) {
        setPerson(result.data);
        navigate('/seller/auth', { replace: true });
        return;
      }
      setInitialLoading(false);
    };
    tryRefresh();
  }, [navigate, setPerson]);


  if (initialLoading) return <Loader />;

  return (
    <>
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
        <Card className="w-full max-w-sm border-none shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img src="/sallahlogo.png" alt="سلة جو" className="h-20 w-auto" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">تسجيل الدخول</CardTitle>
            <CardDescription className="text-gray-500">
              مرحباً بعودتك إلى {''}
              <span className="font-bold text-primary">سلة جو</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">رقم الهاتف</Label>
                <Input
                  id="phone"
                  type="tel"
                  dir="rtl"
                  placeholder="079xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="tracking-wider"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    dir="rtl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 text-lg tracking-widest"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-5 text-base font-bold"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  'تسجيل الدخول'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center">
              <p className="text-sm text-gray-500">
                ليس لديك حساب؟{' '}
                <Link to="/seller/sign-up" className="font-medium text-primary hover:text-primary-dark">
                  سجل الآن
                </Link>
              </p>
              <p className="text-xs leading-relaxed text-gray-400">
                في حالة إنشاءك حساب مسبقاً ولم تتواصل مع الدعم الفني لأخذ كود التفعيل،{' '}
                <Link to="/seller/sign-up" className="text-primary hover:text-primary-dark underline">
                  فعليك إعادة إنشاء الحساب
                </Link>
                {' '}يمكنك استخدام نفس المعلومات
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
