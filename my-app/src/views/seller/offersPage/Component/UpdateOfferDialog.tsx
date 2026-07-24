import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Toast from '@/components/ui/toast';
import { ToolService } from '@/services/ToolService';
import { StoreService } from '@/services/StoreService';
import type { OfferFullInfoDto, UpdateOfferDto } from '@/types/dtos';
import { Camera, Loader2, Save, X } from 'lucide-react';

function toUtcIso(dateStr: string): string {
  return `${dateStr}T00:00:00Z`;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: OfferFullInfoDto;
  onSuccess: () => void;
}

export default function UpdateOfferDialog({ open, onOpenChange, offer, onSuccess }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageLink, setImageLink] = useState(offer.imageLink || '');
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState(offer.title);
  const [description, setDescription] = useState(offer.description || '');
  const [offerPrice, setOfferPrice] = useState(offer.offerPrice?.toString() || '');
  const [startDate, setStartDate] = useState(offer.startDate?.split('T')[0] || '');
  const [endDate, setEndDate] = useState(offer.endDate?.split('T')[0] || '');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false, type: '', message: '',
  });

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await ToolService.uploadImage(file);
    if (result.isSuccess) {
      setImageLink(result.data);
      setErrors((p) => ({ ...p, imageLink: '' }));
    } else {
      showToast('error', 'فشل رفع الصورة');
    }
    setUploading(false);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!imageLink) newErrors.imageLink = 'صورة العرض مطلوبة';
    if (!title.trim()) newErrors.title = 'العنوان مطلوب';
    if (offerPrice) {
      const priceNum = parseFloat(offerPrice);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.offerPrice = 'سعر العرض يجب أن يكون أكبر من صفر';
      }
    }
    if (!startDate) newErrors.startDate = 'تاريخ البداية مطلوب';
    if (!endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    } else if (startDate && endDate <= startDate) {
      newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    const data: UpdateOfferDto = {
      imageLink,
      title: title.trim(),
      description: description.trim() || null,
      offerPrice: offerPrice ? parseFloat(offerPrice) : null,
      startDate: toUtcIso(startDate),
      endDate: toUtcIso(endDate),
    };
    const result = await StoreService.updateOffer(offer.id, data);
    if (result.isSuccess) {
      showToast('success', 'تم تحديث العرض بنجاح');
      setTimeout(() => { onSuccess(); onOpenChange(false); }, 800);
    } else {
      showToast('error', result.error || 'فشل تحديث العرض');
    }
    setSaving(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg">تعديل العرض</DialogTitle>
            <DialogClose className="absolute top-4 left-4">
              <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>صورة العرض <span className="text-red-500">*</span></Label>
              <div className="relative">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                {imageLink ? (
                  <img src={imageLink} alt="صورة العرض" className="w-full h-40 rounded-lg object-cover border border-gray-200" />
                ) : (
                  <div className="w-full h-40 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-400">اختر صورة العرض</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute top-2 left-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow border border-gray-200 transition-colors"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Camera className="h-4 w-4 text-gray-600" />}
                </button>
              </div>
              {errors.imageLink && <p className="text-xs text-red-500">{errors.imageLink}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uo-title">العنوان <span className="text-red-500">*</span></Label>
              <Input id="uo-title" className="bg-gray-50" value={title} onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }} />
              {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uo-desc">الوصف</Label>
              <Textarea id="uo-desc" rows={3} className="bg-gray-50" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="uo-price">سعر العرض</Label>
              <Input
                id="uo-price"
                type="text"
                inputMode="decimal"
                dir="ltr"
                className="bg-gray-50"
                placeholder="0"
                value={offerPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*\.?\d*$/.test(val) || val === '') {
                    setOfferPrice(val);
                    setErrors((p) => ({ ...p, offerPrice: '' }));
                  }
                }}
              />
              {errors.offerPrice && <p className="text-xs text-red-500">{errors.offerPrice}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="uo-start">تاريخ البداية <span className="text-red-500">*</span></Label>
                <Input id="uo-start" type="date" className="bg-gray-50" value={startDate} onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: '' })); }} />
                {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="uo-end">تاريخ النهاية <span className="text-red-500">*</span></Label>
                <Input id="uo-end" type="date" className="bg-gray-50" value={endDate} onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: '' })); }} />
                {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
              </div>
            </div>

            <Button onClick={handleSubmit} disabled={saving} className="w-full">
              <Save className="ml-2 h-4 w-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
