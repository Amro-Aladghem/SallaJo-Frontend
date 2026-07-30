import type { DiscountShortInfoDto } from '@/types/dtos';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';
import { ChevronLeft } from 'lucide-react';

interface Props {
  discounts: DiscountShortInfoDto[];
  slug: string;
  onViewAll?: () => void;
}

export default function DiscountsSection({ discounts, slug, onViewAll }: Props) {
  if (!discounts.length) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="font-bold text-lg relative inline-block">
          الخصومات
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-full" />
        </h2>
        <button onClick={onViewAll} className="flex items-center gap-1 text-sm text-primary font-medium">
          الكل
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-hide ml-1 ">
        <div className="flex gap-3 px-4 pl-8 pb-1">
          {discounts.map((discount) => (
            <div key={discount.product.id} className="flex-[0_0_48%] min-w-[160px]">
              <ProductCard
                product={discount.product}
                isSeller={false}
                isClickable
                linkTo={`/store/${slug}/products/${discount.product.id}`}
                isDiscount
                discountAmount={discount.discountAmount ?? undefined}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
