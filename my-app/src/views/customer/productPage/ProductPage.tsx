import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductController } from '@/services/ProductController';
import type { ProductFullInfoForCustomerDto } from '@/types/dtos';
import { getCustomerStore } from '@/libs/customerStorage';
import { getProductQuantity, addProductToCart } from '@/libs/cart';
import Loader from '@/components/Loader';
import ErrorPage from '@/components/ErrorPage';
import NotFoundPage from '@/components/NotFoundPage';
import { ArrowRight, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductPage() {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductFullInfoForCustomerDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showToast, setShowToast] = useState(false);

  const store = getCustomerStore();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      const result = await ProductController.getProductPublic(id);
      if (result.isSuccess) {
        setProduct(result.data);
      } else {
        setError(true);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const initialQty = id ? getProductQuantity(id) : 0;
  const [quantity, setQuantity] = useState(initialQty || 1);
  const [inCart, setInCart] = useState(initialQty > 0);

  useEffect(() => {
    if (id) {
      const q = getProductQuantity(id);
      setQuantity(q || 1);
      setInCart(q > 0);
    }
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (!id) return;
    addProductToCart(id, quantity);
    setInCart(true);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }, [id, quantity]);

  if (loading) return <Loader />;
  if (error) return <ErrorPage />;
  if (!product) return <NotFoundPage message="المنتج غير موجود" />;

  const hasDiscount = product.amountOfDiscount != null && product.amountOfDiscount > 0;
  const originalPrice = product.price ?? 0;
  const discountedPrice = hasDiscount ? Math.max(0, originalPrice - product.amountOfDiscount!) : originalPrice;

  const allImages = [
    { imageLink: product.primaryImageLink },
    ...(product.images || []).filter((img) => img.imageLink !== product.primaryImageLink),
  ];
  const currentImage = allImages.length > currentImageIndex ? allImages[currentImageIndex].imageLink : product.primaryImageLink;

  const minQty = 1;
  const maxQty = product.stoke ?? 99;

  return (
    <>
      <header className="sticky top-0 bg-white/95 backdrop-blur z-30 border-b border-gray-200 py-3 px-4 flex items-center gap-3">
        <button onClick={() => navigate(`/store/${slug}`)} className="text-gray-600 hover:text-gray-900">
          <ArrowRight className="h-5 w-5" />
        </button>
        {product.storeImageLink && (
          <img src={product.storeImageLink} alt={product.storeName} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
        )}
        <h1 className="font-bold text-base text-gray-900 truncate">{product.storeName}</h1>
      </header>

      <div className="relative w-full aspect-square bg-gray-50">
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply"
        />
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm">
            خصم {product.amountOfDiscount} د.أ
          </div>
        )}
        {allImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((i) => (i === 0 ? allImages.length - 1 : i - 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow text-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((i) => (i === allImages.length - 1 ? 0 : i + 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow text-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {allImages.map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

        <div className="flex items-center gap-3">
          {hasDiscount ? (
            <>
              <span className="text-primary font-bold text-xl">{discountedPrice.toFixed(1)} د.أ</span>
              <span className="text-gray-400 text-sm line-through">{originalPrice.toFixed(1)} د.أ</span>
            </>
          ) : (
            <span className="text-gray-900 font-bold text-xl">
              {product.price ? `${product.price} د.أ` : '---'}
            </span>
          )}
        </div>

        {product.description && (
          <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
        )}

        {product.isAcceptToShowTheStock && product.stoke != null && (
          <p className="text-xs text-gray-500">
            المخزون: <span className="font-medium text-gray-700">{product.stoke}</span> قطعة
          </p>
        )}

        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setQuantity((q) => Math.max(minQty, q - 1))}
              disabled={quantity <= minQty}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-1.5 border-x border-gray-200 text-sm font-medium min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={quantity >= maxQty}
              className="px-3 py-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            {inCart ? 'تعديل الكمية في السلة' : 'أضف إلى السلة'}
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg transition-all">
          تمت إضافة المنتج إلى السلة
        </div>
      )}
    </>
  );
}
