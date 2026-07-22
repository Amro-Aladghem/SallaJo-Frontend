export interface AddOfferDto {
  imageLink: string | null;
  title: string;
  description: string | null;
  offerPrice: number | null;
  productsIds: string[];
  startDate: string | null;
  endDate: string | null;
}
