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
};

