import api, { type ApiResponse } from '@/libs/api';
import type {
  AddProductDto,
  UpdateProductDto,
  UpdateImageDto,
  GetProductsPaginatedRequestDto,
  GetProductsPaginatedDto,
  ProductFullInfoForCustomerDto,
  GetProductFullInfoForSellerDto,
  AddDiscountDto,
} from '@/types/dtos';

const baseUri = '/products';

export const ProductController = {
  async getProducts(params: GetProductsPaginatedRequestDto): Promise<ApiResponse<GetProductsPaginatedDto>> {
    try {
      const response = await api.get<GetProductsPaginatedDto>(`${baseUri}/show`, { params });
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getProductPublic(id: string): Promise<ApiResponse<ProductFullInfoForCustomerDto>> {
    try {
      const response = await api.get<ProductFullInfoForCustomerDto>(`${baseUri}/${id}/public`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getProductForSeller(id: string): Promise<ApiResponse<GetProductFullInfoForSellerDto>> {
    try {
      const response = await api.get<GetProductFullInfoForSellerDto>(`${baseUri}/${id}`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async addProduct(data: AddProductDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.post<boolean>(baseUri, data);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateProduct(id: string, data: UpdateProductDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/${id}`, data);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async toggleAppear(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/${id}/appear`);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async deleteProduct(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/${id}/delete`);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateImages(id: string, data: UpdateImageDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/${id}/images`, data);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async addDiscount(productId: string, data: AddDiscountDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.post<boolean>(`${baseUri}/${productId}/discounts`, data);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async toggleDiscountStatus(productId: string, discountId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/${productId}/discounts/${discountId}`);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateStock(id: string, stockChange: number): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/${id}/stock`, null, { params: { stockChange } });
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
