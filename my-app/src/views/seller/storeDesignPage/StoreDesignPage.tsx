import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Toast from '@/components/ui/toast';
import { StoreService } from '@/services/StoreService';
import { ToolService } from '@/services/ToolService';
import { useAuth } from '@/hooks/useAuth';
import { governorates } from '@/assets/Data/governorates';
import { colors } from '@/assets/Data/colors';

import {
  Store, Camera, Loader2, Pencil, Phone, MapPin, Facebook, Instagram,
  Package, Gift, ArrowRight, Home, BadgePercent, User, Images,
} from 'lucide-react';
import CoverPickerDialog from './Component/CoverPickerDialog';

const colorHex: Record<string, string> = {
  أحمر: '#FF0000', أزرق: '#0000FF', أصفر: '#FFFF00', أخضر: '#008000',
  أسود: '#000000', أبيض: '#FFFFFF', برتقالي: '#FFA500', بنفسجي: '#800080',
  وردي: '#FFC0CB', بني: '#A52A2A', رمادي: '#808080', سماوي: '#00FFFF',
  كحلي: '#000080', زيتي: '#808000', خمري: '#800000', ذهبي: '#FFD700',
  فضي: '#C0C0C0', بيج: '#F5F5DC', فيروزي: '#40E0D0', أرجواني: '#FF00FF',
};

const DEFAULT_COLOR_ID = 19;

function getColorHexById(colorId: number): string {
  const c = colors.find((c) => c.id === colorId);
  return c ? colorHex[c.name] || '#00FFFF' : '#00FFFF';
}

const FAKE_OFFERS_DATA: { title: string; description: string }[] = [
  { title: 'العرض الأول', description: 'وصف العرض الأول' },
  { title: 'العرض الثاني', description: 'وصف العرض الثاني' },
  { title: 'العرض الثالث', description: 'وصف العرض الثالث' },
];

const FAKE_DISCOUNTS_DATA: { name: string; description: string; price: number; discountAmount: number }[] = [
  { name: 'خصم المنتج الأول', description: 'وصف المنتج الأول', price: 20, discountAmount: 3 },
  { name: 'خصم المنتج الثاني', description: 'وصف المنتج الثاني', price: 25, discountAmount: 4 },
  { name: 'خصم المنتج الثالث', description: 'وصف المنتج الثالث', price: 30, discountAmount: 5 },
  { name: 'خصم المنتج الرابع', description: 'وصف المنتج الرابع', price: 15, discountAmount: 2 },
  { name: 'خصم المنتج الخامس', description: 'وصف المنتج الخامس', price: 35, discountAmount: 6 },
];

const FAKE_PRODUCTS_DATA: { name: string; description: string; price: number }[] = [
  { name: 'المنتج الأول', description: 'وصف المنتج الأول', price: 10 },
  { name: 'المنتج الثاني', description: 'وصف المنتج الثاني', price: 13 },
  { name: 'المنتج الثالث', description: 'وصف المنتج الثالث', price: 16 },
  { name: 'المنتج الرابع', description: 'وصف المنتج الرابع', price: 19 },
  { name: 'المنتج الخامس', description: 'وصف المنتج الخامس', price: 22 },
  { name: 'المنتج السادس', description: 'وصف المنتج السادس', price: 25 },
  { name: 'المنتج السابع', description: 'وصف المنتج السابع', price: 28 },
  { name: 'المنتج الثامن', description: 'وصف المنتج الثامن', price: 31 },
];

type EditTarget = null | 'name' | 'description' | 'phone' | 'facebook' | 'instagram' | 'color' | 'logoUrl';

interface ImageCardEdit {
  type: 'offer' | 'discount' | 'product';
  index: number;
}

const EditDialog = ({ editTarget, editValue, setEditValue, onClose, onConfirm, title, inputType = 'text', multiline = false }: {
  editTarget: string | null; editValue: string; setEditValue: (v: string) => void;
  onClose: () => void; onConfirm: () => void;
  title: string; inputType?: string; multiline?: boolean;
}) => {
  if (editTarget === null) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-base mb-4">{title}</h3>
        {multiline ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            rows={3}
            className="flex w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            dir="rtl"
            autoFocus
          />
        ) : (
          <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} type={inputType} dir={inputType === 'tel' ? 'ltr' : 'rtl'} autoFocus />
        )}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={onClose}>إلغاء</Button>
          <Button className="flex-1" onClick={onConfirm}>تأكيد</Button>
        </div>
      </div>
    </div>
  );
};

const ColorDialog = ({ editTarget, primaryColorId, onSelect, onClose }: {
  editTarget: string | null; primaryColorId: number;
  onSelect: (id: number) => void; onClose: () => void;
}) => {
  if (editTarget !== 'color') return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-base mb-4">اختر اللون الأساسي</h3>
        <div className="grid grid-cols-4 gap-3">
          {colors.map((c) => {
            const hex = getColorHexById(c.id);
            const selected = primaryColorId === c.id;
            return (
              <button key={c.id} onClick={() => { onSelect(c.id); onClose(); }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-colors ${selected ? 'border-primary' : 'border-transparent'}`}
              >
                <div className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: hex }} />
                <span className="text-[10px] text-gray-600">{c.name}</span>
              </button>
            );
          })}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={onClose}>إلغاء</Button>
      </div>
    </div>
  );
};

const ImageCardDialog = ({ imageCardEdit, cardImages, uploadingCardImage, onClose, onUploadClick }: {
  imageCardEdit: ImageCardEdit | null;
  cardImages: Record<string, string>;
  uploadingCardImage: boolean;
  onClose: () => void;
  onUploadClick: () => void;
}) => {
  if (!imageCardEdit) return null;
  const key = `${imageCardEdit.type}-${imageCardEdit.index}`;
  const currentImage = cardImages[key];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-base mb-4">
          {imageCardEdit.type === 'offer' ? 'صورة العرض' : imageCardEdit.type === 'discount' ? 'صورة الخصم' : 'صورة المنتج'}
        </h3>
        {currentImage && <img src={currentImage} alt="" className="w-full h-40 object-cover rounded-lg mb-3" />}
        <Button variant="outline" className="w-full" onClick={onUploadClick} disabled={uploadingCardImage}>
          {uploadingCardImage ? <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> جاري...</> : <><Camera className="ml-2 h-4 w-4" /> اختر صورة</>}
        </Button>
        <Button variant="outline" className="w-full mt-2" onClick={onClose}>إغلاق</Button>
      </div>
    </div>
  );
};

export default function StoreDesignPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; type: string; message: string }>({
    open: false, type: '', message: '',
  });

  const [logoUrl, setLogoUrl] = useState(user.store?.logoImageUrl || '');
  const [coverUrl, setCoverUrl] = useState(user.store?.coverStoreImageLink || '');
  const [name, setName] = useState(user.store?.name || '');
  const [description, setDescription] = useState(user.store?.description || '');
  const [phoneNumber, setPhoneNumber] = useState(user.store?.phoneNumber || '');
  const [governorateId] = useState(user.store?.governorateId || 0);
  const [primaryColorId, setPrimaryColorId] = useState(user.store?.primaryColorId || DEFAULT_COLOR_ID);
  const [facebookLink, setFacebookLink] = useState(user.store?.facebookLink || '');
  const [instagramLink, setInstagramLink] = useState(user.store?.instagramLink || '');

  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [imageCardEdit, setImageCardEdit] = useState<ImageCardEdit | null>(null);
  const [editValue, setEditValue] = useState('');

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingCardImage, setUploadingCardImage] = useState(false);
  const [cardImages, setCardImages] = useState<Record<string, string>>({});
  const [showCoverPicker, setShowCoverPicker] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const cardImageInputRef = useRef<HTMLInputElement>(null);

  const storeId = user.seller?.storeId;
  const primaryHex = getColorHexById(primaryColorId);
  const governorateName = governorates.find((g) => g.id === governorateId)?.name || '';

  const showToast = (type: string, message: string) => {
    setToast({ open: true, type, message });
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const result = await ToolService.uploadImage(file);
    if (logoInputRef.current) logoInputRef.current.value = '';
    if (result.isSuccess) setLogoUrl(result.data);
    else showToast('error', 'فشل رفع الشعار');
    setUploadingLogo(false);
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const result = await ToolService.uploadImage(file);
    if (coverInputRef.current) coverInputRef.current.value = '';
    if (result.isSuccess) setCoverUrl(result.data);
    else showToast('error', 'فشل رفع صورة الغلاف');
    setUploadingCover(false);
  };

  const handleUploadCardImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !imageCardEdit) return;
    setUploadingCardImage(true);
    const result = await ToolService.uploadImage(file);
    if (cardImageInputRef.current) cardImageInputRef.current.value = '';
    if (result.isSuccess) {
      const key = `${imageCardEdit.type}-${imageCardEdit.index}`;
      setCardImages((prev) => ({ ...prev, [key]: result.data }));
    } else showToast('error', 'فشل رفع الصورة');
    setUploadingCardImage(false);
    setImageCardEdit(null);
  };

  const openEdit = (target: EditTarget) => {
    setEditTarget(target);
    if (target === 'name') setEditValue(name);
    else if (target === 'description') setEditValue(description);
    else if (target === 'phone') setEditValue(phoneNumber);
    else if (target === 'facebook') setEditValue(facebookLink);
    else if (target === 'instagram') setEditValue(instagramLink);
    else if (target === 'logoUrl') setEditValue(logoUrl);
    else setEditValue('');
  };

  const confirmEdit = () => {
    if (editTarget === 'name') setName(editValue);
    else if (editTarget === 'description') setDescription(editValue);
    else if (editTarget === 'phone') setPhoneNumber(editValue);
    else if (editTarget === 'facebook') setFacebookLink(editValue);
    else if (editTarget === 'instagram') setInstagramLink(editValue);
    else if (editTarget === 'logoUrl') setLogoUrl(editValue);
    setEditTarget(null);
  };

  const verfiy = () : boolean=>{
    const errors: string[] = [];
    if (!name.trim()) errors.push('اسم المتجر مطلوب');
    if (!phoneNumber) errors.push('رقم الهاتف مطلوب');
    else if (!/^(079|077|078)\d{7}$/.test(phoneNumber)) errors.push('رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 079 أو 077 أو 078');
    if (!primaryColorId) errors.push('اللون الأساسي مطلوب');
    if (!logoUrl) errors.push('شعار المتجر مطلوب');
    if (!coverUrl) errors.push('صورة الغلاف مطلوبة');
    if (errors.length) {
      showToast('error', errors.join(' • '));
      return false;
    }
    return true;
  }

  const handleSave = async () => {
    if(!verfiy() || !storeId) return;

    setSaving(true);
    const data = {
      name: name.trim(),
      description: description || 'وصف المتجر',
      phoneNumber,
      email: null,
      facebookLink: facebookLink || null,
      instagramLink: instagramLink || null,
      welcomeHeaderText: 'أهلا وسهلا بالمتجر',
      governorateId,
      primaryColorId,
      secondaryColorId: primaryColorId,
      logoImageUrl: logoUrl,
      coverStoreImageLink: coverUrl,
      isAcceptedToShowStoke: false,
    };
    const result = await StoreService.updateStore(storeId, data);
    if (result.isSuccess) {
      showToast('success', 'تم حفظ التغييرات بنجاح');
      sessionStorage.removeItem('store');
      setUser((prev) => ({ ...prev, store: null }));
      setTimeout(() => navigate('/seller/dashboard', { replace: true }), 1500);
    } else showToast('error', 'فشل حفظ التغييرات');
    setSaving(false);
  };

  return (
    <div className="flex-1 w-full max-w-lg mx-auto bg-white md:border-x border-gray-200 min-h-screen relative pb-24" dir="rtl" lang="ar">
      <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadLogo} />
      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadCover} />
      <input ref={cardImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleUploadCardImage} />

      <Toast open={toast.open} type={toast.type} message={toast.message}
        handleCloseCallBack={() => setToast((prev) => ({ ...prev, open: false }))} />

      {editTarget && <EditDialog
        editTarget={editTarget}
        editValue={editValue}
        setEditValue={setEditValue}
        onClose={() => setEditTarget(null)}
        onConfirm={confirmEdit}
        title={
          editTarget === 'name' ? 'اسم المتجر' :
          editTarget === 'description' ? 'الوصف' :
          editTarget === 'phone' ? 'رقم الهاتف' :
          editTarget === 'facebook' ? 'رابط فيسبوك' :
          editTarget === 'instagram' ? 'رابط إنستغرام' :
          editTarget === 'logoUrl' ? 'رابط الشعار' : ''
        }
        inputType={editTarget === 'phone' ? 'tel' : editTarget === 'facebook' || editTarget === 'instagram' || editTarget === 'logoUrl' ? 'url' : 'text'}
        multiline={editTarget === 'description'}
      />}
      <ColorDialog
        editTarget={editTarget}
        primaryColorId={primaryColorId}
        onSelect={(id) => setPrimaryColorId(id)}
        onClose={() => setEditTarget(null)}
      />
      <ImageCardDialog
        imageCardEdit={imageCardEdit}
        cardImages={cardImages}
        uploadingCardImage={uploadingCardImage}
        onClose={() => setImageCardEdit(null)}
        onUploadClick={() => cardImageInputRef.current?.click()}
      />
      <CoverPickerDialog
        open={showCoverPicker}
        onClose={() => setShowCoverPicker(false)}
        onSelect={(url) => setCoverUrl(url)}
      />

      {/* Top navbar */}
      <div className="fixed top-0 right-0 left-0 z-40 bg-white border-b border-gray-200" style={{ maxWidth: '448px', margin: '0 auto' }}>
        <div className="flex items-center justify-between h-12 px-3">
          <button onClick={() => navigate('/seller/dashboard')} className="text-gray-500 hover:text-primary transition-colors">
            <ArrowRight className="h-5 w-5" />
          </button>
          <div className="flex items-center justify-center gap-1.5 w-full">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-8 w-8 rounded object-cover" />
            ) : (
              <Store className="h-4 w-4 text-gray-400" />
            )}
            <button onClick={() => logoInputRef.current?.click()} disabled={uploadingLogo} className="text-gray-400 hover:text-primary transition-colors">
              {uploadingLogo ? <Loader2 className="h-7 w-7 animate-spin" /> : <Camera className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>


      <div className="pt-12">
        {/* Note above cover + color selector */}
        <div className="px-4 pt-3 pb-2 flex gap-2">
          <div className="flex-1 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700 leading-relaxed">
            منتجاتك وعروضك وخصوماتك لن تظهر هنا في صفحة التعديل.
            يمكنك رؤيتهم في صفحة عرض متجرك. هذه الصفحة لتعديل موقعك.
          </div>
          <div className="flex-shrink-0 flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-2.5 py-2 self-start">
            <div className="w-4 h-4 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: primaryHex }} />
            <span className="text-[11px] text-gray-700 whitespace-nowrap">{colors.find((c) => c.id === primaryColorId)?.name || 'اللون'}</span>
            <button onClick={() => setEditTarget('color')} className="text-gray-400 hover:text-primary transition-colors shrink-0">
              <Pencil className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Cover */}
        <div className="px-4">
          <div className="relative w-full rounded-xl overflow-hidden group" style={{ aspectRatio: '16 / 6' }}>
            {coverUrl ? (
              <img src={coverUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center flex-col justify-center">
                <Camera className="h-10 w-10 text-gray-300" />
                <p>صورة البداية لموقعك اختارها تعبر عن متجرك</p>
              </div>
            )}
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex flex-col items-center justify-center gap-1"
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2">
                {uploadingCover ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Camera className="h-5 w-5 text-gray-700" />}
              </div>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white font-medium drop-shadow">
                اختر صورة تعبر عن متجرك
              </span>
            </button>
            <button onClick={() => setShowCoverPicker(true)}
              className="absolute bottom-2 right-2 bg-white/90 text-[10px] text-gray-700 font-medium px-2.5 py-1 rounded-full shadow-sm hover:bg-white transition-colors z-10">
              <Images className="h-3 w-3 inline-block ml-1" />
              صور جاهزة
            </button>
          </div>
        </div>



        {/* Offers section */}
        <section className="mt-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-bold text-lg relative inline-block">
              أحدث العروض
              <div className="absolute -bottom-1 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: `${primaryHex}33` }} />
            </h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-4">
              {FAKE_OFFERS_DATA.map((offer, i) => {
                const imgKey = `offer-${i}`;
                const imgSrc = cardImages[imgKey];
                return (
                  <div key={i} className="flex-[0_0_100%] min-w-0 relative group">
                    <div className="w-full relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 78%, 0 100%)' }}>
                      <div className="h-[200px] bg-gray-100 flex items-center justify-center">
                        {imgSrc ? (
                          <img src={imgSrc} alt={offer.title} className="w-full h-full object-cover" />
                        ) : (
                          <Gift className="h-10 w-10 text-gray-300" />
                        )}
                      </div>
                      <div className="absolute top-3 right-3 text-white text-xs font-medium px-3 py-1 rounded-sm shadow" style={{ backgroundColor: primaryHex }}>
                        يشمل 1 منتج
                      </div>
                    </div>
                    <div className="px-4 pt-1 pb-2" style={{ marginTop: '-1.25rem' }}>
                      <h3 className="font-bold text-base">{offer.title}</h3>
                      <p className="text-sm text-gray-500">{offer.description}</p>
                    </div>
                    <button
                      onClick={() => setImageCardEdit({ type: 'offer', index: i })}
                      className="absolute top-2 left-2 bg-white/90 hover:bg-white rounded-full p-1.5 shadow opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Camera className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Discounts section */}
        <section className="mt-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="font-bold text-lg relative inline-block">
              الخصومات
              <div className="absolute -bottom-1 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: `${primaryHex}33` }} />
            </h2>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-4">
              {FAKE_DISCOUNTS_DATA.map((item, i) => {
                const imgKey = `discount-${i}`;
                const imgSrc = cardImages[imgKey];
                return (
                  <div key={i} className="flex-[0_0_40%] min-w-[140px] relative group">
                    <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setImageCardEdit({ type: 'discount', index: i })}
                        className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow">
                        <Camera className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                      <div className="relative w-full bg-gray-50 h-[140px]">
                        {imgSrc ? (
                          <img src={imgSrc} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 text-white text-[10px] font-bold px-2 py-1 rounded-sm bg-red-500">
                          خصم {item.discountAmount} د.أ
                        </div>
                      </div>
                      <div className="p-2">
                        <h3 className="font-medium text-xs text-gray-900 line-clamp-1">{item.name}</h3>
                        <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                        <div className="flex items-end gap-1 mt-1">
                          <span className="font-bold text-xs" style={{ color: primaryHex }}>{(item.price - item.discountAmount).toFixed(1)} د.أ</span>
                          <span className="text-gray-400 text-[10px] line-through">{item.price.toFixed(1)} د.أ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Products section */}
        <section className="mt-8 px-4">
          <h2 className="font-bold text-lg relative inline-block mb-4">
            جميع المنتجات
            <div className="absolute -bottom-1 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: `${primaryHex}33` }} />
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {FAKE_PRODUCTS_DATA.map((prod, i) => {
              const imgKey = `product-${i}`;
              const imgSrc = cardImages[imgKey];
              return (
                <div key={i} className="relative group">
                  <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setImageCardEdit({ type: 'product', index: i })}
                      className="bg-white/90 hover:bg-white rounded-full p-1.5 shadow">
                      <Camera className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                    <div className="relative w-full bg-gray-50 h-[140px]">
                      {imgSrc ? (
                        <img src={imgSrc} alt="" className="w-full h-full object-cover mix-blend-multiply" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <h3 className="font-medium text-xs text-gray-900 line-clamp-1">{prod.name}</h3>
                      <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{prod.description}</p>
                      <span className="font-bold text-xs mt-1 block" style={{ color: primaryHex }}>{prod.price.toFixed(1)} د.أ</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-200 bg-gray-50/30 pt-8 pb-6 px-4">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-16 h-16 rounded-sm border-2 border-white shadow-sm mb-3 overflow-hidden bg-gray-100 group">
              {logoUrl ? (
                <img src={logoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><Store className="h-6 w-6 text-gray-300" /></div>
              )}
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                {uploadingLogo ? <Loader2 className="h-5 w-5 animate-spin text-white" /> : <Camera className="h-5 w-5 text-white drop-shadow" />}
              </button>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <h3 className="font-bold text-lg text-gray-900">{name || 'اسم المتجر'}</h3>
              <button onClick={() => openEdit('name')} className="text-gray-400 hover:text-primary transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-start gap-2">
              <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{description || 'وصف متجرك'}</p>
              <button onClick={() => openEdit('description')} className="text-gray-400 hover:text-primary transition-colors flex-shrink-0 mt-0.5">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 max-w-sm mx-auto">
            <div className="flex items-center justify-between gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" style={{ color: primaryHex }} />
                <span dir="ltr">{phoneNumber || 'رقم الهاتف'}</span>
              </div>
              <button onClick={() => openEdit('phone')} className="text-gray-400 hover:text-primary transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 shrink-0" style={{ color: primaryHex }} />
                <span>{governorateName || 'المحافظة'}، الأردن</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Facebook className="w-5 h-5 shrink-0 text-blue-600" />
                <span className="text-gray-400">{facebookLink || 'رابط فيسبوك'}</span>
              </div>
              <button onClick={() => openEdit('facebook')} className="text-gray-400 hover:text-primary transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <Instagram className="w-5 h-5 shrink-0 text-pink-600" />
                <span className="text-gray-400">{instagramLink || 'رابط إنستغرام'}</span>
              </div>
              <button onClick={() => openEdit('instagram')} className="text-gray-400 hover:text-primary transition-colors">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                disabled={saving || !storeId}
                className="w-full py-3 text-base font-bold text-white bg-primary rounded-xl transition-colors hover:opacity-90 disabled:opacity-50"
              >
                {saving ? <><Loader2 className="ml-2 h-5 w-5 animate-spin inline" /> جاري الحفظ...</> : 'حفظ معلومات المتجر'}
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200" style={{ maxWidth: '448px', margin: '0 auto' }}>
        <div className="flex items-center justify-around py-2">
          <button onClick={() => navigate('/seller/info')} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary transition-colors">
            <User className="h-5 w-5" />
            <span className="text-[10px]">الحساب</span>
          </button>
          <button onClick={() => navigate('/seller/products')} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary transition-colors">
            <Package className="h-5 w-5" />
            <span className="text-[10px]">منتجاتك</span>
          </button>
          <button onClick={() => navigate('/seller/dashboard')} className="flex flex-col items-center gap-0.5 -mt-2 text-primary">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-[10px] font-medium text-primary">الرئيسية</span>
          </button>
          <button onClick={() => navigate('/seller/discounts')} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary transition-colors">
            <BadgePercent className="h-5 w-5" />
            <span className="text-[10px]">خصوماتي</span>
          </button>
          <button onClick={() => navigate('/seller/offers')} className="flex flex-col items-center gap-0.5 text-gray-400 hover:text-primary transition-colors">
            <Gift className="h-5 w-5" />
            <span className="text-[10px]">عروضك</span>
          </button>
        </div>
      </div>
    </div>
  );
}
