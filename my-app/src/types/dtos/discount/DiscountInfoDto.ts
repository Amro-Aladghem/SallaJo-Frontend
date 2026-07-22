import type { ProductSimpleInfoDto } from '../product/ProductSimpleInfoDto';

export interface DiscountInfoDto {
  id: string;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean | null;
  discountAmount: number | null;
  leastAmountNumber: number | null;
  product: ProductSimpleInfoDto;
}
