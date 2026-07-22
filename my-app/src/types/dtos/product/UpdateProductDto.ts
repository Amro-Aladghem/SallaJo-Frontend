export interface UpdateProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  isAcceptedToAppear: boolean;
  primaryImageLink: string;
}
