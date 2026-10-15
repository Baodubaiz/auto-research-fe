import { apiClient } from '@/lib/api-client';

export interface CreateUploadedDocDto {
  documentId: string;
  fileName: string;
  title?: string;
  processingStatus?: string;
  isEmbedded?: boolean;
}

export const uploadedDocumentService = {
  async create(dto: CreateUploadedDocDto) {
    const response = await apiClient.post('/uploaded-documents', dto);
    return response.data;
  },

  async findAll(documentId: string) {
    const response = await apiClient.get('/uploaded-documents', { params: { documentId } });
    return response.data;
  },

  async findOne(id: string) {
    const response = await apiClient.get(`/uploaded-documents/${id}`);
    return response.data;
  },

  async update(id: string, dto: Partial<CreateUploadedDocDto>) {
    const response = await apiClient.patch(`/uploaded-documents/${id}`, dto);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/uploaded-documents/${id}`);
    return response.data;
  },
};

