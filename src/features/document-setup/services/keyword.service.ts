import { apiClient } from '@/lib/api-client';

export interface CreateKeywordDto {
  documentId: string;
  keywordsMain?: any;
  keywordsSub?: any;
  searchQuery?: string;
  country?: string;
  yearFrom?: number;
  yearTo?: number;
  onlyOpenAccess?: boolean;
}

export const keywordService = {
  async create(dto: CreateKeywordDto) {
    const response = await apiClient.post('/document-keywords', dto);
    return response.data;
  },

  async findByDocument(documentId: string) {
    const response = await apiClient.get('/document-keywords', { params: { documentId } });
    return response.data;
  },

  async update(id: string, dto: Partial<CreateKeywordDto>) {
    const response = await apiClient.patch(`/document-keywords/${id}`, dto);
    return response.data;
  },
};

