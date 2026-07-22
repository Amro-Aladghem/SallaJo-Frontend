export interface ProductSimpleInfoDto {
  id: string;
  name: string;
  price: number | null;
  primaryImageLink: string;
  description: string;
  sequenceProductNumber: number | null;
}
