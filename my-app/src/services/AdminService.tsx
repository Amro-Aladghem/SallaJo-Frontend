import api, { type ApiResponse } from '@/libs/api';
import type { StoreDeliveryDto, ActivateStoreByAdminDto } from '@/types/dtos';

const baseUri = '/admin';

export const AdminService = {
  async setStoreDeliveries(storeId: string, deliveries: StoreDeliveryDto[]): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.post<boolean>(`${baseUri}/stores/${storeId}/deliveries`, deliveries);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async activateStoreSubscriptionByAdmin(dto: ActivateStoreByAdminDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/stores/activate-subscription`, dto);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async createActivationCode(personId: string): Promise<ApiResponse<string>> {
    try {
      const response = await api.put<string>(`${baseUri}/persons/${personId}/activate-code`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
