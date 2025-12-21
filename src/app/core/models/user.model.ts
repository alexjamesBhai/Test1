export type UserRole = 'ADMIN' | 'OWNER' | 'MANAGER' | 'SALESPERSON';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId?: string;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}
