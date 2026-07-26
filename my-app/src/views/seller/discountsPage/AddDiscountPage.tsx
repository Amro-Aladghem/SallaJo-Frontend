import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import Toast from '@/components/ui/toast';
import { ProductController } from '@/services/ProductController';
import type { GetProductFullInfoForSellerDto, AddDiscountDto } from '@/types/dtos';
import { Tag, ArrowLeft, Save } from 'lucide-react';

function toUtcIso(dateStr: string): string {
  return `${dateStr}T00:00:00Z`;
}

export default function AddDiscountPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<GetProductFullInfoForSellerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [leastAmountNumber, setLeastAmountNumber] = useState('');

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  useEffect(() => {
    if (!productId) return;
    (async () => {
      setLoading(true);
      setError(false);
      const result = await ProductController.getProductForSeller(productId);
      if (result.isSuccess) {
        setProduct(result.data);
      } else {
        setError(true);
      }
      setLoading(false);
    })();
  }, [productId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date().toISOString().split('T')[0];

    if (!startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    } else if (startDate < today) {
      newErrors.startDate = 'تاريخ البداية يجب أن يكون من اليوم أو لاحقاً';
    }

    if (endDate) {
      if (startDate && endDate <= startDate) {
        newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
      }
    }

    const amount = parseFloat(discountAmount);
    if (!discountAmount || isNaN(amount) || amount <= 0) {
      newErrors.discountAmount = 'قيمة الخصم يجب أن تكون أكبر من صفر';
    }

    const least = parseFloat(leastAmountNumber);
    if (!leastAmountNumber || isNaN(least) || least <= 0) {
      newErrors.leastAmountNumber = 'الحد الأدنى للطلب يجب أن يكون أكبر من صفر';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!productId || !validate()) return;
    setSaving(true);

    const data: AddDiscountDto = {
      startDate: toUtcIso(startDate),
      endDate: endDate ? toUtcIso(endDate) : null,
      discountAmount: parseFloat(discountAmount),
      leastAmountNumber: parseFloat(leastAmountNumber),
    };

    const result = await ProductController.addDiscount(productId, data);
    if (result.isSuccess) {
      showToast('success', 'تم إضافة الخصم بنجاح');
      setTimeout(() => navigate('/seller/discounts'), 1000);
    } else {
      showToast('error', `فشل إضافة الخصم`);
    }
    setSaving(false);
  };

  if (loading) return <Loader />;
  if (error || !product) return <ErrorPage />;

  console.log('product.amountOfDiscount', product);
  if (product.amountOfDiscount != null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-4">
        <Tag className="h-12 w-12 text-orange-400" />
        <h2 className="text-lg font-bold text-gray-900">هذا المنتج لديه خصم بالفعل</h2>
        <p className="text-sm text-gray-500 max-w-xs">
          قم بحذف الخصم القديم أولاً قبل إضافة خصم جديد
        </p>
        <Button variant="outline" onClick={() => navigate('/seller/discounts')}>
          <ArrowLeft className="ml-2 h-4 w-4" />
          الذهاب إلى الخصومات
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <div>
        <h1 className="text-xl font-bold text-gray-900">إضافة خصم</h1>
        <p className="text-sm text-gray-500 mt-1">للمنتج: {product.name}</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="startDate">تاريخ البداية</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: '' })); }}
          />
          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="endDate">تاريخ النهاية</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: '' })); }}
          />
          {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="discountAmount">قيمة الخصم</Label>
          <Input
            id="discountAmount"
            type="number"
            dir="ltr"
            placeholder="0"
            value={discountAmount}
            onChange={(e) => { setDiscountAmount(e.target.value); setErrors((p) => ({ ...p, discountAmount: '' })); }}
          />
          {errors.discountAmount && <p className="text-xs text-red-500">{errors.discountAmount}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="leastAmountNumber">الحد الأدنى للطلب</Label>
          <Input
            id="leastAmountNumber"
            type="number"
            dir="ltr"
            placeholder="0"
            value={leastAmountNumber}
            onChange={(e) => { setLeastAmountNumber(e.target.value); setErrors((p) => ({ ...p, leastAmountNumber: '' })); }}
          />
          {errors.leastAmountNumber && <p className="text-xs text-red-500">{errors.leastAmountNumber}</p>}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={saving} className="w-full">
        <Save className="ml-2 h-4 w-4" />
        {saving ? 'جاري الحفظ...' : 'حفظ الخصم'}
      </Button>
    </div>
  );
}
