export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'editor';
  avatarUrl: string;
  title: string;
  lastLogin: string;
}

export interface AuthSession {
  token: string;
  user: AdminUser;
  expiresAt: number;
  rememberMe: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
