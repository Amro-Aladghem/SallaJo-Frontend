import axios from 'axios';

export interface ApiSuccess<T> {
  isSuccess: true;
  data: T;
}

export interface ApiFailure {
  isSuccess: false;
  error: string;
  statusCode: number;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface UploadImageResult {
  uploadedImageUrl: string;
}

export interface AddInitialInfoResult {
  id: string;
  isDone: boolean;
}

const api = axios.create({
  baseURL: 'https://sallahapi.taskalyze.com/api/v1',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const statusCode = error.response?.status ?? 0;
    const url = error.response?.config?.url ?? '';
    if (statusCode === 401 && url.startsWith('/seller')) {
      window.location.href = '/seller/sign-in';
      return Promise.reject({ message: '', statusCode });
    }
    const message = error.response?.data?.title ?? error.message ?? 'حدث خطأ غير متوقع';
     return Promise.reject({ message, statusCode });
  },
);

export default api;
