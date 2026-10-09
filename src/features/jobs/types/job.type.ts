export type JobModule =
  | 'document_setup'
  | 'write_report'
  | 'chatbot'
  | 'enhancement';

export type JobStatus =
  | 'pending'
  | 'processing'
  | 'finished'
  | 'error'
  | 'suspended';

export interface CreateJobPayload {
  module: JobModule;
  action: string;
  document_id?: string;
  session_id?: string;
  payload: Record<string, any>;
}

export interface JobCreateResponse {
  job_id: string;
  status: JobStatus;
}

export interface JobResultResponse<T = any> {
  job_id: string;
  status: JobStatus;
  data: T | null;
  error?: string | null;
  error_code?: string | null;
  progress?: number;
}

