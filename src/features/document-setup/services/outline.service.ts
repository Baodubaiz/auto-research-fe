import { apiClient } from '@/lib/api-client';

export interface CreateOutlineDto {
  documentId: string;
  totalWordCount: number;
  structure: any;
}

export interface UpdateOutlineDto {
  totalWordCount?: number;
  structure?: any;
}

export const outlineService = {
  async create(dto: CreateOutlineDto) {
    const response = await apiClient.post('/outlines', dto);
    return response.data;
  },

  async findByDocument(documentId: string) {
    const response = await apiClient.get('/outlines', { params: { documentId } });
    return response.data;
  },

  async findOne(id: string) {
    const response = await apiClient.get(`/outlines/${id}`);
    return response.data;
  },

  async update(id: string, dto: UpdateOutlineDto) {
    const response = await apiClient.patch(`/outlines/${id}`, dto);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/outlines/${id}`);
    return response.data;
  },
};

