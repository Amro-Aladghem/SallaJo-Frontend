import { useEffect, useState } from 'react';
import { DiscountService } from '@/services/DiscountService';
import { ProductController } from '@/services/ProductController';
import type { DiscountInfoDto } from '@/types/dtos';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import Toast from '@/components/ui/toast';
import { ToggleLeft, ToggleRight, RefreshCw } from 'lucide-react';
import NotFoundPage from '@/components/NotFoundPage';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<DiscountInfoDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const fetchDiscounts = async () => {
    setLoading(true);
    setError(false);
    const result = await DiscountService.getAll();
    if (result.isSuccess) {
      setDiscounts(result.data);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleToggle = async (productId: string, discountId: string) => {
    const result = await ProductController.toggleDiscountStatus(productId, discountId);
    if (result.isSuccess) {
      showToast('success', 'تم تغيير حالة الخصم');
      await fetchDiscounts();
    } else {
      showToast('error', 'فشل تغيير الحالة');
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '---';
    return new Date(dateStr).toLocaleDateString('ar-JO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;


  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">الخصومات</h1>
          <p className="text-sm text-gray-500">{discounts.length} خصم</p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchDiscounts}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {discounts.length === 0 ? (
        <NotFoundPage message="لم تقم بإضافة أية خصومات حالياً" />
      ) : (
        <div className="space-y-4">
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <ProductCard product={discount.product} isSeller isClickable={false} />

              <div className="px-4 py-3 space-y-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                  <span className="text-gray-500">قيمة الخصم</span>
                  <span className="text-gray-900 font-medium">
                    {discount.discountAmount != null ? `${discount.discountAmount} د.أ` : '---'}
                  </span>
                  <span className="text-gray-500">السعر</span>
                  <span className="text-gray-900 font-medium">
                    {discount.product.price != null ? `${discount.product.price} د.أ` : '---'}
                  </span>
                  <span className="text-gray-500">السعر بعد الخصم</span>
                  <span className="text-primary font-bold">
                    {discount.product.price != null && discount.discountAmount != null
                      ? `${Math.max(0, discount.product.price - discount.discountAmount)} د.أ`
                      : '---'}
                  </span>
                  <span className="text-gray-500">الحد الأدنى للطلب</span>
                  <span className="text-gray-900 font-medium">
                    {discount.leastAmountNumber != null ? `${discount.leastAmountNumber} قطعة` : '---'}
                  </span>
                  <span className="text-gray-500">تاريخ البداية</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(discount.startDate)}
                  </span>
                  <span className="text-gray-500">تاريخ النهاية</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(discount.endDate)}
                  </span>
                  <span className="text-gray-500">الحالة</span>
                  <span
                    className={`font-medium ${
                      discount.isActive ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {discount.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>

                <div className="flex pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(discount.product.id, discount.id)}
                    className="w-full"
                  >
                    {discount.isActive ? (
                      <ToggleLeft className="ml-1.5 h-4 w-4" />
                    ) : (
                      <ToggleRight className="ml-1.5 h-4 w-4" />
                    )}
                    {discount.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
