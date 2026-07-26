import api, { type ApiResponse } from '@/libs/api';
import type { DiscountInfoDto, DiscountShortInfoDto, UpdateDiscountDto } from '@/types/dtos';

const baseUri = '/discounts';

export const DiscountService = {
  async getAll(): Promise<ApiResponse<DiscountInfoDto[]>> {
    try {
      const response = await api.get<DiscountInfoDto[]>(baseUri);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getActive(): Promise<ApiResponse<DiscountShortInfoDto[]>> {
    try {
      const response = await api.get<DiscountShortInfoDto[]>(`${baseUri}/active`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async update(id: string, data: UpdateDiscountDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/${id}`, data);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
