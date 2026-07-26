import { useState } from 'react';
import type { StoreInfoForSellerDto } from '@/types/dtos';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Toast from '@/components/ui/toast';
import { Store, ExternalLink, Copy, LinkIcon, Rocket, Headphones, Sparkles, Package } from 'lucide-react';

function Box({
  icon,
  title,
  description,
  buttonText,
  onClick,
  children,
  hideButton = false,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  buttonText: string;
  onClick?: () => void;
  children?: React.ReactNode;
  hideButton?: boolean;
}) {
  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500">{description}</p>}
        {children}
        {!hideButton && (
          <Button variant="outline" className="mt-1 w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors" onClick={onClick}>
            {buttonText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardBoxes({ store }: { store: StoreInfoForSellerDto | null | undefined }) {
  const navigate = useNavigate();
  const slug = store?.slug;
  const isStoreActive = !!slug && !slug.startsWith('temp');
  const storeUrl = slug ? `https://sallahjo.taskalyze.com/store/${slug}` : '';

  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false, type: '', message: '',
  });

  const handleCopyLink = async () => {
    if (!storeUrl) return;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setToast({ open: true, type: 'success', message: 'تم نسخ الرابط' });
    } catch {
      setToast({ open: true, type: 'error', message: 'فشل نسخ الرابط' });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 md:p-6 max-w-4xl mx-auto">
      <Toast open={toast.open} type={toast.type} message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))} />

      {/* Store Info */}
      <Box
        icon={<Store className="h-7 w-7 text-primary" />}
        title="المتجر"
        description={"ادارة معلومات متجرك، مثل الاسم، الشعار، وصف المتجر."}
        hideButton
      >
        {!isStoreActive ? (
          <p className="text-xs text-red-500 mt-2 leading-relaxed">
            راسل الدعم الفني لتفعيل المتجر وأخذ الرابط للمتجر مقابل <span className="text-gray-900 text-sm font-bold">4 د.أ</span> شهريا فقط
          </p>
        ) : (
          <div className="w-full bg-gray-100 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <LinkIcon className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-xs text-gray-600 truncate" dir="ltr">{storeUrl}</span>
            </div>
            <button onClick={handleCopyLink} className="text-gray-400 hover:text-primary transition-colors shrink-0">
              <Copy className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex flex-col gap-2 w-full">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors" onClick={() => navigate('/seller/store/info')}>
            ادارة المتجر
          </Button>
          {slug && (
            <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors" onClick={() => navigate(`/seller/store/${slug}`)}>
              <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
              عرض الموقع الإلكتروني كالعميل
            </Button>
          )}
        </div>
      </Box>

      {/* Activate Store */}
      {!isStoreActive && (
        <Box
          icon={<Rocket className="h-7 w-7 text-primary" />}
          title="فعل متجرك الآن"
          hideButton
        >
          <p className="text-sm text-gray-500 leading-relaxed">
            فعل متجرك الأن وأحصل على رابط خاص بأسم متجرك
          </p>
          <div className="w-full bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-700 leading-relaxed text-right">
            الرابط الحالي هو رابط مؤقت لمدة 3 أيام من إنشاء الموقع.
            <br />
            بعدها سوف يتم إيقافه.
            <br />
            لن تخسر البيانات وستبقى قادر على التفعيل بأي وقت تريده.
          </div>
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors" onClick={() => navigate('/seller/support')}>
            تفعيل المتجر
          </Button>
        </Box>
      )}

      {/* Customer Service */}
      <Box
        icon={<Headphones className="h-7 w-7 text-primary" />}
        title="خدمة العملاء"
        description="التواصل مع الدعم الفني والاستفسارات"
        buttonText="الدعم الفني"
        onClick={() => navigate('/seller/support')}
      />

      {/* Stock Management */}
        <Box
          icon={<Package className="h-7 w-7 text-primary" />}
          title="إدارة المخزون"
          description="تعديل أرصدة المنتجات بسهولة"
          buttonText="إدارة المخزون"
          onClick={() => navigate('/seller/products/stock')}
        />

      {/* AI Prompts */}
      {isStoreActive && (
        <Box
          icon={<Sparkles className="h-7 w-7 text-primary" />}
          title="أوامر الذكاء الاصطناعي"
          description="مجموعة أوامر ذكاء اصطناعي لتوليد صور تتناسب مع مقاسات الموقع وجذابة"
          buttonText="عرض الأوامر"
          onClick={() => navigate('/seller/prompts')}
        />
      )}
    </div>
  );
}
