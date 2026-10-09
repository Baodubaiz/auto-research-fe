export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  userName: string;
  password: string;
  fullName?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  userName: string;
  fullName?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

