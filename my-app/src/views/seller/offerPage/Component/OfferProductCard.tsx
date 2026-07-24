import type { ProductSimpleInfoDto } from '@/types/dtos';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';

interface Props {
  product: ProductSimpleInfoDto;
  checked: boolean;
  onToggle: (productId: string) => void;
}

export default function OfferProductCard({ product, checked, onToggle }: Props) {
  return (
    <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-white">
      <ProductCard product={product} isSeller isClickable={false} />
      <div className="absolute top-2 right-2 z-10">
        <label
          className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors cursor-pointer ${
            checked
              ? 'bg-primary border-primary'
              : 'bg-white border-gray-300'
          }`}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggle(product.id)}
            className="sr-only"
          />
          {checked && (
            <svg
              className="w-3.5 h-3.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </label>
      </div>
    </div>
  );
}
