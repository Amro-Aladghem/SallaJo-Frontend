import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Toast from '@/components/ui/toast';
import { PersonService } from '@/services/PersonService';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';

const PASSWORD_RULES = [
  { key: 'minLength', label: '8 أحرف على الأقل', test: (p: string) => p.length >= 8 },
  { key: 'englishOnly', label: 'حروف إنجليزية فقط', test: (p: string) => /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/.test(p) },
  { key: 'hasDigit', label: 'رقم واحد على الأقل', test: (p: string) => /\d/.test(p) },
  { key: 'hasSymbol', label: 'رمز واحد على الأقل', test: (p: string) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p) },
] as const;

function PasswordCheck({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-red-400 flex-shrink-0" />
      )}
      <span className={met ? 'text-green-600' : 'text-red-400'}>{label}</span>
    </div>
  );
}

export default function SignUpForm() {
  const navigate = useNavigate();
  const { setPerson } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });

  const passwordChecks = useMemo(
    () =>
      Object.fromEntries(
        PASSWORD_RULES.map((rule) => [rule.key, rule.test(password)]),
      ) as Record<(typeof PASSWORD_RULES)[number]['key'], boolean>,
    [password],
  );

  const allPasswordValid = Object.values(passwordChecks).every(Boolean);
  const mismatch = confirmTouched && confirmPassword !== password;

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  function validate(): string | null {
    const trimmedPhone = phone.trim();

    if (!trimmedPhone) return 'يرجى إدخال رقم الهاتف';

    if (!/^07[789]\d{7}$/.test(trimmedPhone)) return 'رقم الهاتف يجب أن يبدأ بـ 079 أو 078 أو 077 ويتكون من 10 أرقام';

    if (!password) return 'يرجى إدخال كلمة المرور';

    if (!allPasswordValid) return 'كلمة المرور لا تستوفي جميع الشروط';

    if (password !== confirmPassword) return 'كلمة المرور غير متطابقة';

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

    const result = await PersonService.register({ phone: phone.trim(), password });

    if (result.isSuccess) {
      setPerson(result.data);
      showToast('success', 'تم إنشاء الحساب بنجاح');
      setTimeout(() => navigate('/seller/initial-info'), 1500);
    } else {
      showToast('error', `فشل انشاء الحساب الرجاء اعادة المحاولة`);
    }

    setLoading(false);
  };

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
            <CardTitle className="text-2xl font-bold text-gray-900">إنشاء حساب بائع جديد</CardTitle>
            <CardDescription className="text-gray-500">
              أدخل بياناتك للتسجيل في {''}
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
                {password.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {PASSWORD_RULES.map((rule) => (
                      <PasswordCheck key={rule.key} label={rule.label} met={passwordChecks[rule.key]} />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">تأكيد كلمة المرور</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    dir="rtl"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setConfirmTouched(true);
                    }}
                    className={`text-lg tracking-widest ${mismatch ? 'border-red-400 text-red-600 focus-visible:ring-red-400' : ''}`}
                    disabled={loading}
                  />
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
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  'تسجيل'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                لديك حساب بالفعل؟{' '}
                <Link to="/seller/sign-in" className="font-medium text-primary hover:text-primary-dark">
                  سجل الدخول
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
