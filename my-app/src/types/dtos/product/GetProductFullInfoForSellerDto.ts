import type { ProductImageDto } from './ProductImageDto';

export interface GetProductFullInfoForSellerDto {
  id: string;
  storeId: string;
  name: string;
  price: number | null;
  primaryImageLink: string;
  description: string;
  sequenceProductNumber: number | null;
  amountOfDiscount: number | null;
  stock: number | null;
  isDeleted: boolean | null;
  isAcceptedToAppear: boolean | null;
  images: ProductImageDto[];
}
