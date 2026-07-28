import api, { type ApiResponse } from '@/libs/api';
import type { PersonAuthDto, PersonAuthResponseDto } from '@/types/dtos';

const baseUri = '/persons';

export const PersonService = {
  async login(data: PersonAuthDto): Promise<ApiResponse<PersonAuthResponseDto>> {
    try {
      const response = await api.post<PersonAuthResponseDto>(`${baseUri}/login`, data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async register(data: PersonAuthDto): Promise<ApiResponse<PersonAuthResponseDto>> {
    try {
      const response = await api.post<PersonAuthResponseDto>(`${baseUri}/register`, data);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async activate(activationCode: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/activate`, null, { params: { activationCode } });
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async refreshToken(): Promise<ApiResponse<PersonAuthResponseDto>> {
    try {
      const response = await api.post<PersonAuthResponseDto>(`${baseUri}/token/reffresh`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
