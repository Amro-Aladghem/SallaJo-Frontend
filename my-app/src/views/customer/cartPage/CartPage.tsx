import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCart, updateProductQuantity, removeProductFromCart, removeOfferFromCart, getCartCount } from '@/libs/cart';
import { getCustomerProducts, getCustomerOffers, getCustomerStore } from '@/libs/customerStorage';
import type { ProductSimpleInfoDto, OfferCustomerInfoDto } from '@/types/dtos';
import { ArrowRight, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';

interface CartProductRow {
  id: string;
  info: ProductSimpleInfoDto;
  quantity: number;
}

interface CartOfferRow {
  id: string;
  info: OfferCustomerInfoDto;
}

export default function CartPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [, refresh] = useState(0);
  const [stockPopup, setStockPopup] = useState<string | null>(null);

  const store = getCustomerStore();
  const cart = getCart();
  const allProducts = getCustomerProducts(slug || '') || [];
  const allOffers = getCustomerOffers() || [];

  const productRows: CartProductRow[] = cart.products
    .map((cp) => {
      const info = allProducts.find((p) => p.id === cp.id);
      return info ? { id: cp.id, info, quantity: cp.quantity } : null;
    })
    .filter((r): r is CartProductRow => r !== null);

  const offerRows: CartOfferRow[] = cart.offers
    .map((co) => {
      const info = allOffers.find((o) => o.id === co.id);
      return info ? { id: co.id, info } : null;
    })
    .filter((r): r is CartOfferRow => r !== null);

  const handleInc = (id: string) => {
    const product = allProducts.find((p) => p.id === id);
    const maxStock = store?.isAcceptedToShowStoke && product?.stock != null ? product.stock : 99;
    const currentQty = cart.products.find((p) => p.id === id)?.quantity || 0;
    if (currentQty >= maxStock) {
      setStockPopup(`الكمية لا تكفي — أقصى كمية متاحة: ${maxStock}`);
      setTimeout(() => setStockPopup(null), 3000);
      return;
    }
    updateProductQuantity(id, 1);
    refresh((n) => n + 1);
  };

  const handleDec = (id: string) => {
    updateProductQuantity(id, -1);
    refresh((n) => n + 1);
  };

  const handleRemoveProduct = (id: string) => {
    removeProductFromCart(id);
    refresh((n) => n + 1);
  };

  const handleRemoveOffer = (id: string) => {
    removeOfferFromCart(id);
    refresh((n) => n + 1);
  };

  const getEffectivePrice = (p: ProductSimpleInfoDto): number => {
    const original = p.price ?? 0;
    if (p.amountOfDiscount && p.amountOfDiscount > 0) {
      return Math.max(0, original - p.amountOfDiscount);
    }
    return original;
  };

  const productsTotal = productRows.reduce((sum, r) => sum + getEffectivePrice(r.info) * r.quantity, 0);
  const offersTotal = offerRows.reduce((sum, r) => sum + (r.info.offerPrice ?? 0), 0);
  const grandTotal = productsTotal + offersTotal;
  const itemCount = getCartCount();
  const cartCount = getCartCount();

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-gray-200 py-3 px-4 flex items-center gap-3">
        <button onClick={() => navigate(`/store/${slug}`)} className="text-gray-600 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </button>
        {store && (
          <>
            <img src={store.logoImageUrl} alt={store.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
            <h1 className="font-bold text-base text-gray-900 truncate flex-1">سلة المشتريات</h1>
          </>
        )}
        <button
          onClick={() => navigate(`/store/${slug}/cart`)}
          className="relative w-8 h-8 flex items-center justify-center text-gray-600"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </button>
      </header>

      <div className="px-4 py-4 space-y-4">
        {itemCount === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-sm">السلة فارغة</p>
          </div>
        ) : (
          <>
            {productRows.map((row) => {
              const p = row.info;
              const originalPrice = p.price ?? 0;
              const effectivePrice = getEffectivePrice(p);
              const hasDiscount = p.amountOfDiscount != null && p.amountOfDiscount > 0;
              const rowTotal = effectivePrice * row.quantity;
              return (
                <div key={row.id} className="flex gap-3 bg-white border border-gray-200 rounded-xl p-3">
                  <div className="w-20 h-20 rounded-lg bg-gray-50 shrink-0 overflow-hidden">
                    <img src={p.primaryImageLink} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{p.name}</h3>
                      <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-1">
                        {p.description && p.description.length > 30 ? `${p.description.slice(0, 30)}...` : p.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center border border-gray-200 rounded-md">
                        <button
                          onClick={() => handleDec(row.id)}
                          className="px-2 py-1 text-gray-600 hover:text-gray-900"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 py-1 border-x border-gray-200 text-xs font-medium min-w-[28px] text-center">
                          {row.quantity}
                        </span>
                        <button
                          onClick={() => handleInc(row.id)}
                          className="px-2 py-1 text-gray-600 hover:text-gray-900"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                          <span className="font-bold text-sm text-primary">{rowTotal.toFixed(1)} د.أ</span>
                          {hasDiscount && (
                            <span className="text-xs text-primary">{effectivePrice.toFixed(1)} د.أ</span>
                          )}
                          <span className={`text-[11px] ${hasDiscount ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                            {originalPrice.toFixed(1)} د.أ
                          </span>
                        </div>
                        <button onClick={() => handleRemoveProduct(row.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {offerRows.map((row) => {
              const o = row.info;
              return (
                <div key={row.id} className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900">{o.title}</h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-1">
                      {o.description && o.description.length > 30 ? `${o.description.slice(0, 30)}...` : o.description}
                    </p>
                    <span className="text-primary font-bold text-sm mt-1 block">{o.offerPrice} د.أ</span>
                  </div>
                  <button onClick={() => handleRemoveOffer(row.id)} className="text-gray-300 hover:text-red-500 transition-colors shrink-0">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-medium">السعر الكلي للمنتجات</span>
                <span className="font-bold text-gray-900 text-base">{grandTotal.toFixed(1)} د.أ</span>
              </div>
            </div>

            <button
              onClick={() => navigate(`/store/${slug}/checkout`)}
              className="w-full bg-primary text-white h-12 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              إتمام الطلب
            </button>
          </>
        )}
      </div>
      {stockPopup && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg transition-all">
          {stockPopup}
        </div>
      )}
    </>
  );
}
