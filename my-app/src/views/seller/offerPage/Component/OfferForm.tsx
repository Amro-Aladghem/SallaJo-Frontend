import { useState, useRef } from 'react';
import { ToolService } from '@/services/ToolService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Camera, Loader2, Save } from 'lucide-react';

interface OfferFormData {
  imageLink: string;
  title: string;
  description: string | null;
  offerPrice: number | null;
  startDate: string;
  endDate: string;
}

interface Props {
  onSubmit: (data: OfferFormData) => void;
  saving: boolean;
}

export default function OfferForm({ onSubmit, saving }: Props) {
  const [imageLink, setImageLink] = useState('');
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await ToolService.uploadImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (result.isSuccess) {
      setImageLink(result.data);
      setErrors((p) => ({ ...p, imageLink: '' }));
    }
    setUploading(false);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const today = new Date().toISOString().split('T')[0];

    if (!imageLink) newErrors.imageLink = 'صورة العرض مطلوبة';
    if (!title.trim()) newErrors.title = 'العنوان مطلوب';
    if (!startDate) {
      newErrors.startDate = 'تاريخ البداية مطلوب';
    } else if (startDate < today) {
      newErrors.startDate = 'تاريخ البداية يجب أن يكون من اليوم أو لاحقاً';
    }
    if (offerPrice) {
      const priceNum = parseFloat(offerPrice);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.offerPrice = 'سعر العرض يجب أن يكون أكبر من صفر';
      }
    }
    if (!endDate) {
      newErrors.endDate = 'تاريخ النهاية مطلوب';
    } else if (startDate && endDate <= startDate) {
      newErrors.endDate = 'تاريخ النهاية يجب أن يكون بعد تاريخ البداية';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      imageLink,
      title,
      description: description || null,
      offerPrice: offerPrice ? parseFloat(offerPrice) : null,
      startDate,
      endDate,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      <div className="space-y-1.5">
        <Label>
          صورة العرض <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          {imageLink ? (
            <img
              src={imageLink}
              alt="صورة العرض"
              className="w-full h-40 rounded-lg object-cover border border-gray-200"
            />
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
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Camera className="h-4 w-4 text-gray-600" />
            )}
          </button>
        </div>
        {errors.imageLink && <p className="text-xs text-red-500">{errors.imageLink}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="of-title">
          العنوان <span className="text-red-500">*</span>
        </Label>
        <Input
          id="of-title"
          className="bg-gray-50"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
        />
        {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="of-desc">الوصف</Label>
        <Textarea
          id="of-desc"
          rows={3}
          className="bg-gray-50"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="of-price">سعر العرض</Label>
        <Input
          id="of-price"
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
          <Label htmlFor="of-start">
            تاريخ البداية <span className="text-red-500">*</span>
          </Label>
          <Input
            id="of-start"
            type="date"
            className="bg-gray-50"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setErrors((p) => ({ ...p, startDate: '' })); }}
          />
          {errors.startDate && <p className="text-xs text-red-500">{errors.startDate}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="of-end">
            تاريخ النهاية <span className="text-red-500">*</span>
          </Label>
          <Input
            id="of-end"
            type="date"
            className="bg-gray-50"
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setErrors((p) => ({ ...p, endDate: '' })); }}
          />
          {errors.endDate && <p className="text-xs text-red-500">{errors.endDate}</p>}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={saving} className="w-full">
        <Save className="ml-2 h-4 w-4" />
        {saving ? 'جاري الحفظ...' : 'حفظ العرض'}
      </Button>
    </div>
  );
}
