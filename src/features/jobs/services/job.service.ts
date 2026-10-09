import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import {
  CreateJobPayload,
  JobCreateResponse,
  JobResultResponse,
} from '../types/job.type';

export const jobService = {
  async createJob(payload: CreateJobPayload): Promise<JobCreateResponse> {
    const response = await apiClient.post<JobCreateResponse>(
      API_ENDPOINTS.JOBS.CREATE,
      payload
    );
    return response.data;
  },

  async getJobStatus<T = any>(jobId: string): Promise<JobResultResponse<T>> {
    const response = await apiClient.get<JobResultResponse<T>>(
      API_ENDPOINTS.JOBS.GET_STATUS(jobId)
    );
    return response.data;
  },

  async resumeJob<T = any>(
    jobId: string,
    payload?: Record<string, any>
  ): Promise<JobResultResponse<T>> {
    const response = await apiClient.post<JobResultResponse<T>>(
      API_ENDPOINTS.JOBS.RESUME(jobId),
      payload
    );
    return response.data;
  },
};

