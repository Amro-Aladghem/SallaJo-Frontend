import api, { type ApiResponse } from '@/libs/api';
import type {
  AddInitialStoreInfoDto,
  InitialStoreInfoDto,
  StoreInfoForSellerDto,
  StorePageInfoDto,
  StoreInfoForCustomerDto,
  UpdateStoreInfoDto,
  AddOfferDto,
  OfferCustomerInfoDto,
  UpdateOfferDto,
  OfferFullInfoDto,
  DiscountShortInfoDto,
  GetProductsPaginatedRequestDto,
  GetProductsPaginatedDto,
} from '@/types/dtos';

const baseUri = '/stores';

function toFormData<T extends object>(data: T, file?: File): FormData {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  }
  if (file) {
    formData.append('image', file);
  }
  return formData;
}

export const StoreService = {
  async createStore(data: AddInitialStoreInfoDto, image?: File): Promise<ApiResponse<InitialStoreInfoDto>> {
    try {
      const formData = toFormData(data, image);
      const response = await api.post<InitialStoreInfoDto>(baseUri, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getMyStore(): Promise<ApiResponse<StoreInfoForSellerDto>> {
    try {
      const response = await api.get<StoreInfoForSellerDto>(baseUri);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getStorePage(slug: string): Promise<ApiResponse<StorePageInfoDto>> {
    try {
      const response = await api.get<StorePageInfoDto>(`${baseUri}/${slug}`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getStoreInfo(slug: string): Promise<ApiResponse<StoreInfoForCustomerDto>> {
    try {
      const response = await api.get<StoreInfoForCustomerDto>(`${baseUri}/${slug}/info`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateStore(id: string, data: UpdateStoreInfoDto, image?: File): Promise<ApiResponse<boolean>> {
    try {
      const formData = toFormData(data, image);
      const response = await api.put<boolean>(`${baseUri}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async addOffer(data: AddOfferDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.post<boolean>(`${baseUri}/offer`, data);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async toggleOfferStatus(id: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/offer/${id}/status`);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getStoreOffers(slug: string): Promise<ApiResponse<OfferCustomerInfoDto[]>> {
    try {
      const response = await api.get<OfferCustomerInfoDto[]>(`${baseUri}/${slug}/offers`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getStoreDiscounts(slug: string): Promise<ApiResponse<DiscountShortInfoDto[]>> {
    try {
      const response = await api.get<DiscountShortInfoDto[]>(`${baseUri}/${slug}/active`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async updateOffer(id: string, data: UpdateOfferDto): Promise<ApiResponse<boolean>> {
    try {
      const response = await api.put<boolean>(`${baseUri}/offers/${id}`, data);
      return { isSuccess: response.data, data: response.data } as ApiResponse<boolean>;
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getAllOffers(): Promise<ApiResponse<OfferFullInfoDto[]>> {
    try {
      const response = await api.get<OfferFullInfoDto[]>(`${baseUri}/offers`);
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getStoreProducts(slug: string, params: GetProductsPaginatedRequestDto): Promise<ApiResponse<GetProductsPaginatedDto>> {
    try {
      const response = await api.get<GetProductsPaginatedDto>(`${baseUri}/${slug}/products`, { params });
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },

  async getMyStoreProducts(params: GetProductsPaginatedRequestDto): Promise<ApiResponse<GetProductsPaginatedDto>> {
    try {
      const response = await api.get<GetProductsPaginatedDto>(`${baseUri}/products`, { params });
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
