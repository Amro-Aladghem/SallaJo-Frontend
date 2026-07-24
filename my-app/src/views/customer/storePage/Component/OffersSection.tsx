import { useState, useRef, useEffect } from 'react';
import type { OfferCustomerInfoDto } from '@/types/dtos';
import { ChevronLeft } from 'lucide-react';

interface Props {
  offers: OfferCustomerInfoDto[];
  onOfferClick?: (offerId: string) => void;
  onViewAll?: () => void;
}

export default function OffersSection({ offers, onOfferClick, onViewAll }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const index = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
      setActiveIndex(index);
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (index: number) => {
    scrollRef.current?.children[index]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };

  if (!offers.length) return null;

  return (
    <section className="mt-4">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="font-bold text-lg relative inline-block">
          أحدث العروض
          <div className="absolute -bottom-1 left-0 right-0 h-1 bg-primary/20 rounded-full" />
        </h2>
        <button onClick={onViewAll} className="flex items-center gap-1 text-sm text-primary font-medium">
          الكل
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
        <div className="flex">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="flex-[0_0_100%] min-w-0 snap-start cursor-pointer"
              onClick={() => onOfferClick?.(offer.id)}
            >
              <div className="w-full relative" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 78%, 0 100%)' }}>
                <div className="h-[200px] bg-gray-100">
                  <img
                    src={offer.imageLink || ''}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {offer.products && offer.products.length > 0 && (
                    <button
                  onClick={(e) => { e.stopPropagation(); onOfferClick?.(offer.id); }}
                  className="absolute top-3 right-3 bg-primary text-white text-xs font-medium px-3 py-1 rounded-sm shadow"
                >
                  {offer.products && offer.products.length > 0
                    ? `يشمل ${offer.products.length} منتج`
                    : 'المزيد'}
                </button>
                )}
              
              </div>
              <div className="px-4 pt-1 pb-2" style={{ marginTop: '-1.25rem' }}>
                <h3 className="font-bold text-base text-foreground mb-0.5">{offer.title}</h3>
                {offer.description && (
                  <p className="text-sm text-muted-foreground leading-snug line-clamp-1">{offer.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {offers.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {offers.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex ? 'w-5 h-2 bg-primary' : 'w-2 h-2 bg-border'
              }`}
              aria-label={`الانتقال إلى العرض ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
