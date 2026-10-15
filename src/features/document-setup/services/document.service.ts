import { apiClient } from '@/lib/api-client';

export interface CreateDocumentDto {
  title?: string;
  field?: string;
  documentType?: string;
  language?: string;
  domains?: any;
  subdomains?: any;
  numberOfDomains?: number;
  numberOfSubdomains?: number;
  webSearchEnabled?: boolean;
  researchType?: string;
}

export interface UpdateDocumentDto extends Partial<CreateDocumentDto> {
  status?: string;
}

export const documentService = {
  async create(dto: CreateDocumentDto) {
    const response = await apiClient.post('/documents', dto);
    return response.data;
  },

  async findAll() {
    const response = await apiClient.get('/documents');
    return response.data;
  },

  async findOne(id: string) {
    const response = await apiClient.get(`/documents/${id}`);
    return response.data;
  },

  async update(id: string, dto: UpdateDocumentDto) {
    const response = await apiClient.patch(`/documents/${id}`, dto);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/documents/${id}`);
    return response.data;
  },

  async listReferences(id: string) {
    const response = await apiClient.get(`/documents/${id}/references`);
    return response.data;
  },

  async attachReference(id: string, referenceId: string) {
    const response = await apiClient.post(`/documents/${id}/references`, { referenceId });
    return response.data;
  },

  async detachReference(id: string, referenceId: string) {
    const response = await apiClient.delete(`/documents/${id}/references/${referenceId}`);
    return response.data;
  },
};

