import { useState } from 'react';
import type { OfferFullInfoDto } from '@/types/dtos';
import ProductCard from '@/views/seller/productsPage/Component/ProductCard';
import { ChevronUp, ChevronDown, ToggleLeft, ToggleRight, Edit3 } from 'lucide-react';

interface Props {
  offer: OfferFullInfoDto;
  onToggleStatus: (id: string) => void;
  onUpdate: (offer: OfferFullInfoDto) => void;
  toggling: boolean;
  isClickable?: boolean;
}

export default function OfferCard({ offer, onToggleStatus, onUpdate, toggling, isClickable = false }: Props) {
  const [productsOpen, setProductsOpen] = useState(false);
  const hasProducts = offer.offerProducts && offer.offerProducts.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-sm truncate">{offer.title}</h3>
          {offer.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{offer.description}</p>
          )}
        </div>

        {offer.imageLink && (
          <img src={offer.imageLink} alt={offer.title} className="w-full h-32 rounded-lg object-cover border border-gray-100" />
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
          {offer.offerPrice != null && (
            <span>السعر: <strong className="text-gray-800">{offer.offerPrice}</strong></span>
          )}
          {offer.startDate && (
            <span>من: <strong className="text-gray-800">{offer.startDate.split('T')[0]}</strong></span>
          )}
          {offer.endDate && (
            <span>إلى: <strong className="text-gray-800">{offer.endDate.split('T')[0]}</strong></span>
          )}
          <span className={`font-medium ${offer.isActive ? 'text-green-600' : 'text-gray-400'}`}>
            {offer.isActive ? 'نشط' : 'غير نشط'}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onUpdate(offer)}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            تعديل
          </button>
          <button
            onClick={() => onToggleStatus(offer.id)}
            disabled={toggling}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border transition-colors ${
              offer.isActive
                ? 'border-green-200 text-green-600 hover:bg-green-50'
                : 'border-gray-200 text-gray-400 hover:bg-gray-50'
            }`}
          >
            {offer.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
            {offer.isActive ? 'إيقاف' : 'تفعيل'}
          </button>
        </div>
      </div>

      {hasProducts && (
        <div className="border-t border-gray-100">
          <button
            onClick={() => setProductsOpen(!productsOpen)}
            className="hidden md:flex w-full items-center justify-center gap-1 py-2 text-xs text-gray-500 hover:bg-gray-50 transition-colors"
          >
            {productsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {productsOpen ? 'إخفاء المنتجات' : `عرض المنتجات (${offer.offerProducts.length})`}
          </button>

          <div className={`grid grid-cols-2 gap-2 p-3 pt-0 ${productsOpen ? '' : 'md:hidden'}`}>
            {offer.offerProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSeller={true}
                isClickable={isClickable}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
