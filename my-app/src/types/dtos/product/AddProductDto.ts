export interface AddProductDto {
  name: string;
  description: string;
  price: number;
  stock: number;
  primaryImageLink: string;
  imagesLinks: string[];
}
