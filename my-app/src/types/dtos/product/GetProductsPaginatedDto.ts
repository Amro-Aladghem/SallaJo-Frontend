import type { ProductSimpleInfoDto } from './ProductSimpleInfoDto';

export interface GetProductsPaginatedDto {
  products: ProductSimpleInfoDto[];
  lastSequenceProductNumber: number | null;
}
