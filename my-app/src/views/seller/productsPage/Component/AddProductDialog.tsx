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
import { ProductController } from '@/services/ProductController';
import { ToolService } from '@/services/ToolService';
import { Save, X, Camera, Loader2, Package, DollarSign, Star } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MAX_IMAGES = 3;

export default function AddProductDialog({ open, onClose, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false, type: '', message: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setStock('');
    setImages([]);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const result = await ToolService.uploadImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (result.isSuccess) {
      setImages((prev) => [...prev, result.data]);
    } else {
      showToast('error', 'فشل رفع الصورة');
    }
    setUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'اسم المنتج مطلوب';
    if (!description.trim()) errs.description = 'الوصف مطلوب';
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) errs.price = 'السعر يجب أن يكون رقماً أكبر من 0';
    if (images.length === 0) errs.images = 'يرجى رفع صورة واحدة على الأقل';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    const data = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      primaryImageLink: images[0] || '',
      imagesLinks: images,
    };
    const result = await ProductController.addProduct(data);
    if (result.isSuccess) {
      showToast('success', 'تم إضافة المنتج بنجاح');
      resetForm();
      onSuccess();
    } else {
      showToast('error', 'فشل إضافة المنتج');
    }
    setSaving(false);
  };

  return (
    <>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadImage} />

      <Toast open={toast.open} type={toast.type} message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))} />

      <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
        <DialogContent className="max-w-[95vw] md:max-w-[500px] max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="px-4 pt-4 pb-2 sticky top-0 bg-white z-10 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <DialogClose className="rounded-full hover:bg-gray-100 p-1.5 transition-colors focus:outline-none">
                <X className="h-4 w-4 text-gray-500" />
              </DialogClose>
              <DialogTitle className="text-lg font-bold text-gray-900">إضافة منتج جديد</DialogTitle>
            </div>
          </DialogHeader>

          <div className="px-4 pb-4 space-y-4">
            {/* Images */}
            <div className="space-y-2">
              <Label>صور المنتج (حد أقصى {MAX_IMAGES})</Label>
              <div className="flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(i)}
                      className="absolute top-0.5 right-0.5 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center shadow opacity-70 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                    {i === 0 && images.length > 1 && (
                      <div className="absolute bottom-0.5 left-0.5 w-5 h-5 flex items-center justify-center rounded-full bg-white shadow">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                  </div>
                ))}
                {images.length < MAX_IMAGES && (
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors">
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400">النجمة تمثل الصورة الرئيسية</p>
              {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-name">اسم المنتج</Label>
              <Input id="ap-name" value={name} onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: '' })); }} />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ap-desc">الوصف</Label>
              <Textarea id="ap-desc" rows={3} value={description} onChange={(e) => { setDescription(e.target.value); setErrors((p) => ({ ...p, description: '' })); }} />
              {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ap-price"><DollarSign className="h-3 w-3 inline ml-1" />السعر</Label>
                <Input id="ap-price" type="text" inputMode="decimal" dir="ltr" value={price}
                  onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v) || v === '') { setPrice(v); setErrors((p) => ({ ...p, price: '' })); }}} />
                {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ap-stock"><Package className="h-3 w-3 inline ml-1" />الكمية الي عندك اذا بتعرف </Label>
                <Input id="ap-stock" type="number" dir="ltr" value={stock}
                  onChange={(e) => { setStock(e.target.value); setErrors((p) => ({ ...p, stock: '' })); }} />
                {errors.stock && <p className="text-xs text-red-500">{errors.stock}</p>}
              </div>
            </div>

            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري...</> : <><Save className="ml-2 h-4 w-4" /> إضافة المنتج</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
