export interface AdminUser {
  id: string;
  name: string;
  email: string;
  username?: string | undefined;
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
  email?: string | undefined;
  identifier?: string | undefined;
  password: string;
  rememberMe?: boolean | undefined;
}

export interface AdminCredentials {
  username: string;
  email: string;
  password: string;
  updatedAt?: string | undefined;
}
