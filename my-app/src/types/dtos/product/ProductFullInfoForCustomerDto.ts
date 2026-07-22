import type { ProductImageDto } from './ProductImageDto';

export interface ProductFullInfoForCustomerDto {
  id: string;
  storeId: string;
  storeName: string;
  storeImageLink: string;
  name: string;
  price: number | null;
  primaryImageLink: string;
  description: string;
  sequenceProductNumber: number | null;
  stoke: number;
  isAcceptToShowTheStock: boolean;
  amountOfDiscount: number | null;
  images: ProductImageDto[];
}
