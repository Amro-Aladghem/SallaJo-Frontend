import type { StorePageInfoDto } from '@/types/dtos';
import { governorates } from '@/assets/Data/governorates';
import { Phone, MapPin, Clock, Instagram, Facebook } from 'lucide-react';

interface Props {
  store: StorePageInfoDto;
}

export default function StoreFooter({ store }: Props) {
  const governorateName = governorates.find((g) => g.id === store.governorateId)?.name || '';

  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50/30 pt-8 pb-6 px-4">
      <div className="flex flex-col items-center text-center mb-6">
        <img
          src={store.logoImageUrl}
          alt={store.name}
          className="w-16 h-16 rounded-full border-2 border-white shadow-sm mb-3 object-cover"
        />
        <h3 className="font-bold text-lg text-gray-900 mb-2">{store.name}</h3>
        {store.description && (
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{store.description}</p>
        )}
      </div>

      <div className="space-y-4 max-w-sm mx-auto">
        {store.phoneNumber && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Phone className="w-5 h-5 text-primary shrink-0" />
            <span dir="ltr">{store.phoneNumber}</span>
          </div>
        )}

        {governorateName && (
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <MapPin className="w-5 h-5 text-primary shrink-0" />
            <span>{governorateName}، الأردن</span>
          </div>
        )}

        <a
          href={`https://wa.me/${store.phoneNumber?.replace(/^0+/, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 w-full flex items-center justify-center gap-2 bg-primary text-white h-11 rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Phone className="w-4 h-4 fill-current" />
          تواصل عبر واتساب
        </a>

        {(store.instagramLink || store.facebookLink) && (
          <div className="flex items-center justify-center gap-4 mt-6">
            {store.instagramLink && (
              <a
                href={store.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {store.facebookLink && (
              <a
                href={store.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
