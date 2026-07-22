import api, { type ApiResponse, type ApiResult } from '@/libs/api';
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

  async addProduct(data: AddProductDto): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.post<ApiResult>(baseUri, data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateProduct(id: string, data: UpdateProductDto): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.put<ApiResult>(`${baseUri}/${id}`, data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async toggleAppear(id: string): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.put<ApiResult>(`${baseUri}/${id}/appear`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async deleteProduct(id: string): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.put<ApiResult>(`${baseUri}/${id}/delete`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateImages(id: string, data: UpdateImageDto): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.put<ApiResult>(`${baseUri}/${id}/images`, data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async addDiscount(productId: string, data: AddDiscountDto): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.post<ApiResult>(`${baseUri}/${productId}/discounts`, data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateDiscount(id: string, discountId: string): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.put<ApiResult>(`${baseUri}/${id}/discounts/${discountId}`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
