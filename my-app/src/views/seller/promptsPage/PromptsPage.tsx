import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Layout, Tag, Package } from 'lucide-react';
import Toast from '@/components/ui/toast';

const prompts = [
  {
    id: 'cover',
    title: 'صورة الغلاف',
    icon: Layout,
    dimensions: '380 × 142.5 بكسل',
    prompt: 'صمم صورة غلاف لمتجر إلكتروني جذاب ونظيف بجودة عالية ودقة 380×142.5 بكسل، تحتوي على خلفية موحدة مع اسم المتجر وشعار بسيط في المنتصف، استخدم ألوان هادئة ومتناسقة، بدون نصوص طويلة أو فوضى، بأسلوب عصري Minimalist.',
  },
  {
    id: 'offer',
    title: 'صورة العرض',
    icon: Tag,
    dimensions: '420 × 200 بكسل',
    prompt: 'صمم صورة عرض أو خصم لمنتج معين بجودة عالية ودقة 420×200 بكسل، تحتوي على المنتج في منتصف الصورة مع خلفية جذابة، أضف شعار "خصم" أو "عرض" بشكل أنيق في الزاوية، استخدم ألوان زاهية تبرز العرض، الصورة بشكل أفقي كامل بدون زوايا مقطوعة. بأسلوب احترافي يجذب الانتباه.',
  },
  {
    id: 'product',
    title: 'صورة المنتج',
    icon: Package,
    dimensions: '180 × 180 بكسل',
    prompt: 'صمم صورة منتج مربعة الشكل دقة 180×180 بكسل بجودة عالية، خلفية بيضاء ناصعة أو شفافة، المنتج في منتصف الصورة مع إضاءة متساوية وظلال ناعمة، بدون أي شعارات أو نصوص أو عناصر إضافية، بأسلوب تصوير احترافي للمنتجات التجارية.',
  },
];

export default function PromptsPage() {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false, type: '', message: '',
  });

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setToast({ open: true, type: 'success', message: 'تم نسخ الأمر بنجاح' });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setToast({ open: true, type: 'error', message: 'فشل النسخ' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-700" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">أوامر الذكاء الاصطناعي</h1>
          <p className="text-sm text-gray-500">لتوليد صور متوافقة مع مقاسات الموقع وجذابة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {prompts.map((item) => {
          const Icon = item.icon;
          const isCopied = copiedId === item.id;
          return (
            <div key={item.id} className="border border-gray-200 rounded-xl p-5 space-y-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">{item.title}</h2>
                  <p className="text-xs text-gray-400">{item.dimensions}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed text-justify border border-gray-100">
                {item.prompt}
              </div>

              <button
                onClick={() => handleCopy(item.id, item.prompt)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isCopied
                    ? 'bg-green-50 text-green-600 border border-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {isCopied ? (
                  <><Check className="h-4 w-4" /> تم النسخ</>
                ) : (
                  <><Copy className="h-4 w-4" /> نسخ الأمر</>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 leading-relaxed">
        <p className="font-semibold mb-1">ملاحظة:</p>
        <p>يمكنك استخدام هذه الأوامر مع أي أداة ذكاء اصطناعي لتوليد الصور مثل DALL·E أو Midjourney أو Adobe Firefly.
        الصورة الأكبر (العرض) هي 420×200 بكسل وتستخدم للعروض.</p>
      </div>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </div>
  );
}
