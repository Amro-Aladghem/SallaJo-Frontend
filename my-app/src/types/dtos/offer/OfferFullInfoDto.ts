import type { ProductSimpleInfoDto } from '../product/ProductSimpleInfoDto';

export interface OfferFullInfoDto {
  id: string;
  storeId: string;
  imageLink: string | null;
  title: string;
  description: string | null;
  offerPrice: number | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean | null;
  offerProducts: ProductSimpleInfoDto[];
}
