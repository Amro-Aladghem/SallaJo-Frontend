export interface UpdateOfferDto {
  imageLink: string | null;
  title: string;
  description: string | null;
  offerPrice: number | null;
  startDate: string | null;
  endDate: string | null;
}
