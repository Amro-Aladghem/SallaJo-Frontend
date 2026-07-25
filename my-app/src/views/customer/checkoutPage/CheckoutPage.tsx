import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCart } from '@/libs/cart';
import { getCustomerProducts, getCustomerOffers, getCustomerStore } from '@/libs/customerStorage';
import { governorates } from '@/assets/Data/governorates';
import { regions } from '@/assets/Data/regions';
import { ArrowRight, Crosshair } from 'lucide-react';

const STORAGE_KEY = 'checkout';

function loadSaved(slug: string) {
  const raw = sessionStorage.getItem(`${STORAGE_KEY}-${slug}`);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // fall through
    }
  }
  return null;
}

function saveData(slug: string, data: Record<string, unknown>) {
  sessionStorage.setItem(`${STORAGE_KEY}-${slug}`, JSON.stringify(data));
}

export default function CheckoutPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const store = getCustomerStore();
  const cart = getCart();
  const allProducts = getCustomerProducts(slug || '') || [];
  const allOffers = getCustomerOffers() || [];

  const productRows = cart.products
    .map((cp) => {
      const info = allProducts.find((p) => p.id === cp.id);
      return info ? { info, quantity: cp.quantity } : null;
    })
    .filter(Boolean);

  const offerRows = cart.offers
    .map((co) => {
      const info = allOffers.find((o) => o.id === co.id);
      return info ? { info } : null;
    })
    .filter(Boolean);

  const getEffectivePrice = (p: { price?: number | null; amountOfDiscount?: number | null }) => {
    const original = p.price ?? 0;
    if (p.amountOfDiscount && p.amountOfDiscount > 0) {
      return Math.max(0, original - p.amountOfDiscount);
    }
    return original;
  };

  const productsTotal = productRows.reduce(
    (sum, r: any) => sum + getEffectivePrice(r.info) * r.quantity, 0
  );
  const offersTotal = offerRows.reduce(
    (sum: number, r: any) => sum + (r.info.offerPrice ?? 0), 0
  );
  const grandTotal = productsTotal + offersTotal;

  const saved = slug ? loadSaved(slug) : null;

  const [name, setName] = useState(saved?.name ?? '');
  const [phone, setPhone] = useState(saved?.phone ?? '');
  const [phoneError, setPhoneError] = useState('');
  const [governorateId, setGovernorateId] = useState<number | ''>(saved?.governorateId ?? '');
  const [regionId, setRegionId] = useState<number | ''>(saved?.regionId ?? '');
  const [lat, setLat] = useState<number | null>(saved?.lat ?? null);
  const [lng, setLng] = useState<number | null>(saved?.lng ?? null);
  const [locError, setLocError] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>(saved?.orderType ?? 'delivery');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!slug) return;
    saveData(slug, { name, phone, governorateId, regionId, lat, lng, orderType });
  }, [slug, name, phone, governorateId, regionId, lat, lng, orderType]);

  const filteredRegions = useMemo(
    () => (governorateId ? regions.filter((r) => r.governorateId === governorateId) : []),
    [governorateId]
  );

  const validatePhone = (val: string) => {
    const cleaned = val.replace(/\s/g, '');
    if (cleaned.length === 0) return '';
    if (!/^07[789]/.test(cleaned)) return 'يجب أن يبدأ الرقم بـ 079 أو 077 أو 078';
    if (!/^\d{10}$/.test(cleaned)) return 'يجب أن يتكون الرقم من 10 أرقام';
    return '';
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    setPhone(cleaned);
    const err = validatePhone(cleaned);
    setPhoneError(err);
    if (err) {
      setErrors((prev) => ({ ...prev, phone: err }));
    } else {
      setErrors((prev) => {
        const { phone: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError('خدمة تحديد الموقع غير متوفرة');
      return;
    }
    setLocLoading(true);
    setLocError('');
    setTouched((prev) => ({ ...prev, location: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLocLoading(false);
        setErrors((prev) => {
          const { location: _, ...rest } = prev;
          return rest;
        });
      },
      () => {
        setLocError('لم نتمكن من الوصول إلى موقعك، يرجى تفعيل صلاحية الموقع');
        setLocLoading(false);
      },
    );
  };

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validateField = (field: string, value: unknown): string => {
    switch (field) {
      case 'name':
        if (!String(value).trim()) return 'حقل الاسم مطلوب';
        return '';
      case 'phone':
        if (!String(value).trim()) return 'حقل رقم الهاتف مطلوب';
        return validatePhone(String(value));
      case 'governorate':
        if (!value) return 'يرجى اختيار المحافظة';
        return '';
      case 'region':
        if (!value) return 'يرجى اختيار المنطقة';
        return '';
      case 'location':
        if (orderType === 'delivery' && (!lat || !lng)) return 'يرجى تحديد موقعك';
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (field: string, value: unknown) => {
    markTouched(field);
    const err = validateField(field, value);
    if (err) {
      setErrors((prev) => ({ ...prev, [field]: err }));
    } else {
      setErrors((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validate = (): boolean => {
    const allFields = ['name', 'phone', 'governorate', 'region'];
    if (orderType === 'delivery') allFields.push('location');
    const errs: Record<string, string> = {};
    allFields.forEach((f) => {
      let val: unknown;
      if (f === 'name') val = name;
      else if (f === 'phone') val = phone;
      else if (f === 'governorate') val = governorateId;
      else if (f === 'region') val = regionId;
      else if (f === 'location') val = lat;
      const err = validateField(f, val);
      if (err) errs[f] = err;
    });
    setErrors(errs);
    setTouched({ name: true, phone: true, governorate: true, region: true, location: true });
    return Object.keys(errs).length === 0;
  };

  const handleCheckout = () => {
    if (!validate()) return;
    if (!store?.phoneNumber) return;

    const governorateName = governorates.find((g) => g.id === governorateId)?.name || '';
    const regionName = regions.find((r) => r.id === regionId)?.regionName || '';
    const mapsLink = lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : '';

    const typeLabel = orderType === 'pickup' ? 'جاي على المحل' : 'توصيل';
    let message = '';
    message += `الاسم: ${name.trim()}\n`;
    message += `رقم الهاتف: ${phone}\n`;
    message += `نوع الطلب: ${typeLabel}\n`;
    message += `المحافظة: ${governorateName}\n`;
    message += `المنطقة: ${regionName}\n`;
    if (orderType === 'delivery' && mapsLink) {
      message += `الموقع: ${mapsLink}\n`;
    }
    message += `\n--- المنتجات ---\n`;
    productRows.forEach((r: any, i: number) => {
      const p = r.info;
      const ep = getEffectivePrice(p);
      const total = ep * r.quantity;
      message += `${i+1}- ${p.name}\n`;
      message += `  الكمية: ${r.quantity} | السعر: ${total.toFixed(1)} د.أ\n`;
      if (p.amountOfDiscount && p.amountOfDiscount > 0) {
        message += `  مع تطبيق خصم ${p.amountOfDiscount} د.أ لكل وحدة\n`;
      }
      message += `\n`;
    });
    if (offerRows.length > 0) {
      message += `\n--- العروض ---\n`;
      offerRows.forEach((r: any, i: number) => {
        message += `${i+1}- ${r.info.title}\n`;
        message += `  سعر العرض: ${r.info.offerPrice} د.أ\n`;
      });
    }
    message += `\nالمجموع الكلي: ${grandTotal.toFixed(1)} د.أ`;

    const waPhone = store.phoneNumber.replace(/^0+/, '');
    const url = `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const showError = (field: string) => errors[field] && touched[field];

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-gray-200 py-3 px-4 flex items-center gap-3">
        <button onClick={() => navigate(`/store/${slug}/cart`)} className="text-gray-600 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </button>
        {store && (
          <>
            <img src={store.logoImageUrl} alt={store.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
            <h1 className="font-bold text-base text-gray-900 truncate">إتمام الطلب</h1>
          </>
        )}
      </header>

      <div className="px-4 py-4 space-y-5">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسمك</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => {
                  const { name: _, ...rest } = prev;
                  return rest;
                });
              }}
              onBlur={(e) => handleBlur('name', e.target.value)}
              placeholder="أدخل اسمك"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
            {showError('name') && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم هاتفك</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              onBlur={() => markTouched('phone')}
              placeholder="079xxxxxxx"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors ltr text-left"
            />
            {showError('phone') && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الموقع</label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locLoading}
              className="w-full flex items-center justify-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              <Crosshair className={`h-4 w-4 ${locLoading ? 'animate-spin' : ''}`} />
              {locLoading ? 'جاري تحديد الموقع...' : lat && lng ? 'تم تحديد الموقع ✓' : 'تحديد موقعي الحالي'}
            </button>
            {(showError('location') || locError) && (
              <p className="text-red-500 text-xs mt-1">{showError('location') ? errors.location : locError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المحافظة</label>
            <select
              value={governorateId}
              onChange={(e) => {
                setGovernorateId(e.target.value ? Number(e.target.value) : '');
                setRegionId('');
                setErrors((prev) => {
                  const { governorate: _, region: _r, ...rest } = prev;
                  return rest;
                });
              }}
              onBlur={() => handleBlur('governorate', governorateId)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
            >
              <option value="">اختر المحافظة</option>
              {governorates.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
            {showError('governorate') && <p className="text-red-500 text-xs mt-1">{errors.governorate}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة</label>
            <select
              value={regionId}
              onChange={(e) => {
                setRegionId(e.target.value ? Number(e.target.value) : '');
                setErrors((prev) => {
                  const { region: _, ...rest } = prev;
                  return rest;
                });
              }}
              onBlur={() => handleBlur('region', regionId)}
              disabled={!governorateId}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">اختر المنطقة</option>
              {filteredRegions.map((r) => (
                <option key={r.id} value={r.id}>{r.regionName}</option>
              ))}
            </select>
            {showError('region') && <p className="text-red-500 text-xs mt-1">{errors.region}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع الطلب</label>
            <div className="flex gap-3">
              <label
                className={`flex-1 flex items-center justify-center gap-2 border rounded-lg px-3 py-3 text-sm cursor-pointer transition-colors ${
                  orderType === 'delivery'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="orderType"
                  value="delivery"
                  checked={orderType === 'delivery'}
                  onChange={() => setOrderType('delivery')}
                  className="sr-only"
                />
                توصيل
              </label>
              <label
                className={`flex-1 flex items-center justify-center gap-2 border rounded-lg px-3 py-3 text-sm cursor-pointer transition-colors ${
                  orderType === 'pickup'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="orderType"
                  value="pickup"
                  checked={orderType === 'pickup'}
                  onChange={() => setOrderType('pickup')}
                  className="sr-only"
                />
                جاي على المحل
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">السعر الكلي للمنتجات</span>
            <span className="font-bold text-gray-900">{grandTotal.toFixed(1)} د.أ</span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-primary text-white h-12 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          إتمام الطلب عبر واتساب
        </button>
      </div>
    </>
  );
}
