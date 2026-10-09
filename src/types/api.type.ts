export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  statusCode?: number;
  error?: string | null;
}

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error?: string;
  error_code?: string;
}

