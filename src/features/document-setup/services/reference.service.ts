import { apiClient } from '@/lib/api-client';

export interface CreateReferenceDto {
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  openAccess?: boolean;
  downloadedStatus?: 'pending' | 'downloaded' | 'failed';
  url?: string;
  abstract?: string;
}

export const referenceService = {
  async create(dto: CreateReferenceDto) {
    const response = await apiClient.post('/references', dto);
    return response.data;
  },

  async findAll(search?: string) {
    const response = await apiClient.get('/references', { params: { search } });
    return response.data;
  },

  async findOne(id: string) {
    const response = await apiClient.get(`/references/${id}`);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/references/${id}`);
    return response.data;
  },
};

