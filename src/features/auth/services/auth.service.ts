import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth.type';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload
    );
    return response.data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      payload
    );
    return response.data;
  },

  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      '/auth/logout'
    );
    return response.data;
  },
};

