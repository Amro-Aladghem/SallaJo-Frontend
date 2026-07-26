import api, { type ApiResponse, type AddInitialInfoResult } from '@/libs/api';
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

  async addInitialInfo(data: AddInitialPersonInfoDto): Promise<ApiResponse<string>> {
    try {
      const response = await api.post<string>(`${baseUri}/info/initial`, data);
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

  async updateInfo(data: UpdatePersonDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/info`, data);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
