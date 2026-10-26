import { apiClient } from '@/lib/api-client';

export interface CreateProposalDto {
  documentId: string;
  title: string;
  problemStatement?: string;
  motivation?: string;
  isSelected?: boolean;
}

export interface UpdateProposalDto {
  title?: string;
  problemStatement?: string;
  motivation?: string;
  isSelected?: boolean;
}

export interface GenerateDomainsDto {
  documentId: string;
  field: string;
  language?: string;
  domainsNum?: number;
  numberOfDomains?: number;
}

export interface GenerateSubdomainsDto {
  documentId: string;
  field?: string;
  domain?: string;
  subdomainsNum?: number;
  numberOfSubdomains?: number;
}

export interface GenerateTitlesDto {
  documentId: string;
  field?: string;
  domain?: string;
  subdomains?: string[];
  keywords?: string[];
  level?: string;
  useWebSearch?: boolean;
  language?: string;
}

export const proposalService = {
  async create(dto: CreateProposalDto) {
    const response = await apiClient.post('/proposals', dto);
    return response.data;
  },

  async findAll(documentId: string) {
    const response = await apiClient.get('/proposals', { params: { documentId } });
    return response.data;
  },

  async findOne(id: string) {
    const response = await apiClient.get(`/proposals/${id}`);
    return response.data;
  },

  async select(id: string) {
    const response = await apiClient.post(`/proposals/${id}/select`);
    return response.data;
  },

  async update(id: string, dto: UpdateProposalDto) {
    const response = await apiClient.patch(`/proposals/${id}`, dto);
    return response.data;
  },

  async remove(id: string) {
    const response = await apiClient.delete(`/proposals/${id}`);
    return response.data;
  },

  async generateDomains(dto: GenerateDomainsDto) {
    const response = await apiClient.post('/proposals/generate-domains', dto, {
      timeout: 120000,
    });
    return response.data;
  },

  async generateSubdomains(dto: GenerateSubdomainsDto) {
    const response = await apiClient.post('/proposals/generate-subdomains', dto, {
      timeout: 120000,
    });
    return response.data;
  },

  async generateTitles(dto: GenerateTitlesDto) {
    const response = await apiClient.post('/proposals/generate-titles', dto, {
      timeout: 180000,
    });
    return response.data;
  },
};
