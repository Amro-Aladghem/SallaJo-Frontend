import type { ProductSimpleInfoDto } from '@/types/dtos';
import { Link } from 'react-router-dom';

interface Props {
  product: ProductSimpleInfoDto;
  isSeller?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
  linkTo?: string;
  isDiscount?: boolean;
  discountPercent?: number;
}

export default function ProductCard({ product, isSeller = false, isClickable = true, onClick, linkTo, isDiscount = false, discountPercent }: Props) {
  const useLink = linkTo && isClickable;
  const showAsButton = isClickable && !linkTo;
  const Comp = useLink ? Link : showAsButton ? 'button' : 'div';
  const compProps = useLink
    ? { to: linkTo, className: 'flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-primary/30 hover:shadow-md transition-all text-right w-full cursor-pointer' }
    : showAsButton
    ? { onClick, className: 'flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white hover:border-primary/30 hover:shadow-md transition-all text-right w-full cursor-pointer' }
    : { className: 'flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white' };

  const finalDiscountPct = discountPercent ?? product.amountOfDiscount ?? 0;
  const hasDiscount = isDiscount && finalDiscountPct > 0;
  const originalPrice = product.price ?? 0;
  const discountedPrice = hasDiscount ? originalPrice * (1 - finalDiscountPct / 100) : originalPrice;

  return (
    <Comp {...compProps}>
      <div className="relative w-full bg-gray-50 h-[180px] max-h-[200px] md:h-[220px] md:max-h-none lg:h-[260px]">
        <img
          src={product.primaryImageLink}
          alt={product.name}
          className="w-full h-full object-cover mix-blend-multiply"
        />
        {isSeller && (
          <div className="absolute top-2 left-2 flex gap-1.5 z-10">
            <Link
              to={`/seller/discounts/add/${product.id}`}
              className="bg-white/90 hover:bg-white text-gray-700 text-[10px] font-medium px-2 py-1 rounded-full shadow transition-colors"
            >
              + خصم
            </Link>
            <Link
              to={`/seller/offers/add?productId=${product.id}`}
              className="bg-white/90 hover:bg-white text-gray-700 text-[10px] font-medium px-2 py-1 rounded-full shadow transition-colors"
            >
              + عرض
            </Link>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm">
            {Math.round(finalDiscountPct)}% خصم
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-medium text-sm text-gray-900 line-clamp-1 leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-2 flex-1 text-right">
          {product.description}...
        </p>
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {hasDiscount ? (
              <>
                <span className="text-primary font-bold text-sm">{discountedPrice.toFixed(1)} د.أ</span>
                <span className="text-gray-400 text-xs line-through">{originalPrice.toFixed(1)} د.أ</span>
              </>
            ) : (
              <span className="text-gray-900 font-bold text-sm">
                {product.price ? `${product.price} د.أ` : '---'}
              </span>
            )}
          </div>
          {isSeller ? (
            <span className="text-[10px] font-medium text-primary">تسعيرتك</span>
          ) : isClickable ? (
            <div className="w-7 h-7 rounded bg-gray-100 flex items-center justify-center text-primary">
              <span className="text-lg font-medium leading-none">+</span>
            </div>
          ) : null}
        </div>
      </div>
    </Comp>
  );
}
