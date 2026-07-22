import type { ProductSimpleInfoDto } from '../product/ProductSimpleInfoDto';

export interface OfferCustomerInfoDto {
  id: string;
  imageLink: string | null;
  title: string;
  description: string | null;
  offerPrice: number | null;
  products: ProductSimpleInfoDto[];
  startDate: string | null;
  endDate: string | null;
  isActive: boolean | null;
}
