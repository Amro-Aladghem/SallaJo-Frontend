import api, { type ApiResponse, type ApiResult } from '@/libs/api';
import type { SellerAuthInfoDto, AddInitialPersonInfoDto, PersonInfoDto, UpdatePersonDto } from '@/types/dtos';

const baseUri = '/sellers';

export const SellerService = {
  async getAuthInfo(): Promise<ApiResponse<SellerAuthInfoDto>> {
    try {
      const response = await api.get<SellerAuthInfoDto>(`${baseUri}/info/auth`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async addInitialInfo(data: AddInitialPersonInfoDto): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.post<ApiResult>(`${baseUri}/info/initial`, data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getMyInfo(): Promise<ApiResponse<PersonInfoDto>> {
    try {
      const response = await api.get<PersonInfoDto>(`${baseUri}/me`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateInfo(data: UpdatePersonDto): Promise<ApiResponse<ApiResult>> {
    try {
      const response = await api.put<ApiResult>(`${baseUri}/info`, data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
