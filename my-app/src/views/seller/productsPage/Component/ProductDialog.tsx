import { useEffect, useState, useRef } from 'react';
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
import { Separator } from '@/components/ui/separator';
import Toast from '@/components/ui/toast';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import ProductImagesSlider from './ProductImagesSlider';
import { ProductController } from '@/services/ProductController';
import { ToolService } from '@/services/ToolService';
import type { GetProductFullInfoForSellerDto } from '@/types/dtos';
import {
  Save,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  Hash,
  Store,
  Tag,
  Package,
  DollarSign,
  X,
} from 'lucide-react';

interface Props {
  productId: string;
  open: boolean;
  onClose: () => void;
  onRefreshList: () => void;
}

export default function ProductDialog({ productId, open, onClose, onRefreshList }: Props) {
  const [product, setProduct] = useState<GetProductFullInfoForSellerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [uploadingImageId, setUploadingImageId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false,
    type: '',
    message: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isAcceptedToAppear, setIsAcceptedToAppear] = useState(false);
  const [primaryImageLink, setPrimaryImageLink] = useState('');

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const fetchProduct = async () => {
    setLoading(true);
    setError(false);
    const result = await ProductController.getProductForSeller(productId);
    if (result.isSuccess) {
      setProduct(result.data);
      setName(result.data.name);
      setDescription(result.data.description);
      setPrice(result.data.price?.toString() ?? '');
      setStock(result.data.stock?.toString() ?? '');
      setIsAcceptedToAppear(result.data.isAcceptedToAppear ?? false);
      setPrimaryImageLink(result.data.primaryImageLink);
      setSelectedImageIndex(0);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchProduct();
    }
  }, [open, productId]);

  const handleSave = async () => {
    if (!product) return;
    setSaving(true);
    const result = await ProductController.updateProduct(productId, {
      name,
      description,
      price: parseFloat(price) || 0,
      stock: parseInt(stock) || 0,
      isAcceptedToAppear,
      primaryImageLink,
    });
    if (result.isSuccess) {
      showToast('success', 'تم حفظ التغييرات بنجاح');
      await fetchProduct();
    } else {
      showToast('error', `فشل حفظ التغييرات`);
    }
    setSaving(false);
  };

  const handleToggleAppear = async () => {
    if (!product) return;
    setSaving(true);
    const result = await ProductController.toggleAppear(productId);
    if (result.isSuccess) {
      showToast('success', isAcceptedToAppear ? 'تم إخفاء المنتج' : 'تم إظهار المنتج');
      await fetchProduct();
    } else {
      showToast('error', `فشل تبديل ظهور المنتج`);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!product) return;
    setSaving(true);
    const result = await ProductController.deleteProduct(productId);
    if (result.isSuccess) {
      showToast('success', 'تم حذف المنتج بنجاح');
      onRefreshList();
      onClose();
    } else {
      showToast('error', `فشل حذف المنتج`);
    }
    setSaving(false);
  };

  const handleChangeImage = (imageId: string) => {
    fileInputRef.current?.setAttribute('data-target-id', imageId);
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetId = fileInputRef.current?.getAttribute('data-target-id') || '';
    if (!targetId) return;

    setUploadingImageId(targetId);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const uploadResult = await ToolService.uploadImage(file);

    if (!uploadResult.isSuccess) {
      showToast('error', `فشل رفع الصورة`);
      setUploadingImageId(null);
      return;
    }


    const targetImage = product.images.find((img) => img.id === targetId);
    const wasPrimary = targetImage?.imageLink === primaryImageLink;

    const updateResult = await ProductController.updateImages(productId, {
      oldImageId: targetId,
      newImageLink: uploadResult.data,
      isPrimaryImage: wasPrimary,
    });

    setUploadingImageId(null);

    if (!updateResult.isSuccess) {
      showToast('error', `فشل تحديث الصورة`);
      return;
    }

    showToast('success', 'تم تحديث الصورة بنجاح');
    setPrimaryImageLink(uploadResult.data);
    await fetchProduct();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />

      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))}
      />

      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-[95vw] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <ErrorPage />
          ) : product ? (
            <>
              <DialogHeader className="px-4 pt-4 pb-2 sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <DialogClose className="rounded-full hover:bg-gray-100 p-1.5 transition-colors focus:outline-none">
                      <X className="h-4 w-4 text-gray-500" />
                    </DialogClose>
                    <DialogTitle className="text-lg font-bold text-gray-900 truncate">
                      {name}
                    </DialogTitle>
                  </div>
                  <Button variant="ghost" size="sm" onClick={fetchProduct} title="تحديث">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>

              <div className="px-4 pb-4 space-y-5">
                <ProductImagesSlider
                  images={product.images}
                  selectedIndex={selectedImageIndex}
                  onSelect={setSelectedImageIndex}
                  uploadingImageId={uploadingImageId}
                  onChangeImage={handleChangeImage}
                  primaryImageLink={primaryImageLink}
                />

                {product.images.length > 0 && (
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">اختر الصورة الرئيسية</Label>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {product.images.map((img, i) => (
                        <button
                          key={img.id}
                          type="button"
                          onClick={async () => {
                            setSelectedImageIndex(i);
                            setPrimaryImageLink(img.imageLink);
                            if (img.imageLink !== primaryImageLink) {
                              await ProductController.updateImages(productId, {
                                oldImageId: img.id,
                                newImageLink: img.imageLink,
                                isPrimaryImage: true,
                              });
                            }
                          }}
                          className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                            primaryImageLink === img.imageLink
                              ? 'border-primary'
                              : 'border-gray-200'
                          }`}
                        >
                          <img src={img.imageLink} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 flex items-center gap-1">
                      <Hash className="h-3 w-3" /> ID
                    </Label>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2 font-mono text-left dir-ltr">
                      {product.id}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 flex items-center gap-1">
                      <Store className="h-3 w-3" /> معرف المتجر
                    </Label>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2 font-mono text-left dir-ltr">
                      {product.storeId}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 flex items-center gap-1">
                      <Tag className="h-3 w-3" /> الرقم التسلسلي
                    </Label>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2">
                      {product.sequenceProductNumber ?? '---'}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-gray-400 flex items-center gap-1">
                      <Package className="h-3 w-3" /> الخصم
                    </Label>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-md px-3 py-2">
                      {product.amountOfDiscount != null
                        ? `${product.amountOfDiscount}`
                        : 'لم يتم اضافة خصم لهذا المنتج'}
                    </p>
                  </div>
                </div>

                <Separator />

                 <div className="space-y-1.5">
                  <Label htmlFor="pd-desc">الوصف</Label>
                  <Textarea
                    id="pd-desc"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="pd-name">اسم المنتج</Label>
                    <Input
                      id="pd-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pd-price">
                      <DollarSign className="h-3 w-3 inline ml-1" />
                      السعر
                    </Label>
                    <Input
                      id="pd-price"
                      type="text"
                      inputMode="decimal"
                      dir="ltr"
                      value={price}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*\.?\d*$/.test(val) || val === '') {
                          setPrice(val);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="pd-stock">
                      <Package className="h-3 w-3 inline ml-1" />
                       الكمية بأمكانه ترك فاضي اذا ما بتعرف
                    </Label>
                    <Input
                      id="pd-stock"
                      type="number"
                      dir="ltr"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                    />
                  </div>
                </div>

                

                <div className="flex flex-col md:flex-row gap-2">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    <Save className="ml-2 h-4 w-4" />
                    حفظ التغييرات
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleToggleAppear}
                    disabled={saving}
                  >
                    {isAcceptedToAppear ? (
                      <EyeOff className="ml-2 h-4 w-4" />
                    ) : (
                      <Eye className="ml-2 h-4 w-4" />
                    )}
                    {isAcceptedToAppear ? 'إخفاء' : 'إظهار'}
                  </Button>
                  {!showDeleteConfirm ? (
                    <Button
                      variant="destructive"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={saving}
                    >
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                        لا
                      </Button>
                      <Button variant="destructive" onClick={handleDelete} disabled={saving} className="flex-1">
                        نعم
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
