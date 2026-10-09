export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
  DASHBOARD: {
    HOME: '/',
    DOCUMENTS: '/documents',
    DOCUMENT_DETAIL: (id: string) => `/documents/${id}`,
    DOCUMENT_SETUP: (id: string) => `/documents/${id}/setup`,
    WRITE_REPORT: (id: string) => `/documents/${id}/write`,
    ENHANCEMENT: (id: string) => `/documents/${id}/enhancement`,
    CHATBOT: '/chatbot',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  JOBS: {
    CREATE: '/jobs',
    GET_STATUS: (jobId: string) => `/jobs/${jobId}`,
    STREAM: (jobId: string) => `/jobs/${jobId}/stream`,
    RESUME: (jobId: string) => `/jobs/${jobId}/resume`,
  },
};

export const JOB_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  FINISHED: 'finished',
  ERROR: 'error',
  SUSPENDED: 'suspended',
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auto_research_token',
  USER_INFO: 'auto_research_user',
};

