import api, { type ApiResponse, type UploadImageResult } from '@/libs/api';

const baseUri = '/tool';

export const ToolService = {
  async uploadImage(file: File): Promise<ApiResponse<UploadImageResult>> {
    try {
      const formData = new FormData();
      formData.append('imageFile', file);
      const response = await api.post<UploadImageResult>(`${baseUri}/upload/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return { isSuccess: true, data: response.data };
    } catch (error) {
      const { message, statusCode } = error as { message: string; statusCode: number };
      return { isSuccess: false, error: message, statusCode };
    }
  },
};
