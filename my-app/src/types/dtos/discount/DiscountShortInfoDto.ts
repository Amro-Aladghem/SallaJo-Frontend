import type { ProductSimpleInfoDto } from '../product/ProductSimpleInfoDto';

export interface DiscountShortInfoDto {
  discountAmount: number | null;
  leastAmountNumber: number | null;
  startDate: string | null;
  endDate: string | null;
  product: ProductSimpleInfoDto;
}
