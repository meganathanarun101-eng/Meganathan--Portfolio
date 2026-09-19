import { AdminCredentials, AdminUser, AuthSession, LoginCredentials } from '../types/auth';

const STORAGE_KEY_SESSION = 'meganathan_admin_session';
const STORAGE_KEY_CREDENTIALS = 'meganathan_admin_credentials';

/**
 * DEFAULT DEMO CREDENTIALS:
 * Username: meganathan (or admin)
 * Email: admin@meganathan.dev (or meganathanarun101@gmail.com)
 * Password: admin123
 */

const DEFAULT_CREDENTIALS: AdminCredentials = {
  username: 'meganathan',
  email: 'admin@meganathan.dev',
  password: 'admin123',
};

const DEFAULT_ADMIN: AdminUser = {
  id: 'usr-admin-01',
  name: 'Meganathan R',
  email: 'admin@meganathan.dev',
  username: 'meganathan',
  role: 'superadmin',
  avatarUrl: '/assets/profile.jpg',
  title: 'Full Stack & MERN Developer',
  lastLogin: new Date().toISOString(),
};

export const authService = {
  getCredentials(): AdminCredentials {
    if (typeof window === 'undefined') return DEFAULT_CREDENTIALS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CREDENTIALS);
      if (!stored) return DEFAULT_CREDENTIALS;
      const parsed = JSON.parse(stored);
      return {
        username: parsed.username || DEFAULT_CREDENTIALS.username,
        email: parsed.email || DEFAULT_CREDENTIALS.email,
        password: parsed.password || DEFAULT_CREDENTIALS.password,
        updatedAt: parsed.updatedAt,
      };
    } catch {
      return DEFAULT_CREDENTIALS;
    }
  },

  isCustomCredentialsSet(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem(STORAGE_KEY_CREDENTIALS) !== null;
    } catch {
      return false;
    }
  },

  updateCredentials(params: {
    username?: string;
    email?: string;
    currentPassword: string;
    newPassword?: string;
  }): { success: boolean; error?: string } {
    if (typeof window === 'undefined') {
      return { success: false, error: 'Browser environment required.' };
    }

    const current = this.getCredentials();

    // Verify current password
    if (params.currentPassword !== current.password) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (params.newPassword && params.newPassword.trim().length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' };
    }

    const updated: AdminCredentials = {
      username: params.username ? params.username.trim() : current.username,
      email: params.email ? params.email.trim().toLowerCase() : current.email,
      password: params.newPassword ? params.newPassword.trim() : current.password,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_CREDENTIALS, JSON.stringify(updated));

      // Also update session user if active
      const session = this.getSession();
      if (session) {
        session.user.username = updated.username;
        session.user.email = updated.email;
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      }

      return { success: true };
    } catch (e) {
      console.error('Failed to save credentials', e);
      return { success: false, error: 'Failed to save new credentials to local storage.' };
    }
  },

  resetCredentialsToDefault(): { success: boolean } {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_CREDENTIALS);
      } catch (e) {
        console.error('Failed to reset credentials', e);
      }
    }
    return { success: true };
  },

  async login(credentials: LoginCredentials): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    // Simulate realistic network latency for smooth UI feedback
    await new Promise((resolve) => setTimeout(resolve, 500));

    const identifier = (credentials.identifier || credentials.email || '').trim().toLowerCase();
    const password = (credentials.password || '').trim();

    if (!identifier) {
      return { success: false, error: 'Please enter your username or email.' };
    }
    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const currentCreds = this.getCredentials();
    const isCustom = this.isCustomCredentialsSet();

    let isValid = false;

    if (isCustom) {
      // If user has set custom credentials, strictly check against them
      const isIdentifierMatch =
        identifier === currentCreds.username.toLowerCase() ||
        identifier === currentCreds.email.toLowerCase();
      const isPasswordMatch = password === currentCreds.password;

      isValid = isIdentifierMatch && isPasswordMatch;
    } else {
      // Default demo mode: allow admin aliases
      const validIdentifiers = [
        currentCreds.username.toLowerCase(),
        currentCreds.email.toLowerCase(),
        'admin',
        'meganathanarun101@gmail.com',
        'admin@example.com',
      ];
      const isIdentifierMatch = validIdentifiers.includes(identifier);
      const isPasswordMatch = password === currentCreds.password || password === 'admin';

      isValid = isIdentifierMatch && isPasswordMatch;
    }

    if (!isValid) {
      return {
        success: false,
        error: isCustom
          ? 'Invalid username/email or password.'
          : 'Invalid credentials. Default: username "meganathan" (or admin@meganathan.dev) and password "admin123".',
      };
    }

    const session: AuthSession = {
      token: `admin_jwt_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      user: {
        ...DEFAULT_ADMIN,
        username: currentCreds.username,
        email: currentCreds.email,
        lastLogin: new Date().toISOString(),
      },
      expiresAt: Date.now() + (credentials.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000),
      rememberMe: Boolean(credentials.rememberMe),
    };

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
      }
    } catch (e) {
      console.error('Failed to save session to storage', e);
    }

    return { success: true, session };
  },

  getSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;

    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSION);
      if (!data) return null;

      const session: AuthSession = JSON.parse(data);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }

      return session;
    } catch {
      return null;
    }
  },

  getCurrentUser(): AdminUser | null {
    return this.getSession()?.user ?? null;
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(STORAGE_KEY_SESSION);
      } catch (e) {
        console.error('Failed to clear session', e);
      }
    }
  },

  updateProfile(updates: Partial<AdminUser>): AdminUser | null {
    const session = this.getSession();
    if (!session) return null;

    session.user = {
      ...session.user,
      ...updates,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
    }

    return session.user;
  },

  getActiveSessions() {
    return [
      {
        id: 'sess-1',
        device: 'Chrome on Windows 11 (Current)',
        ip: '192.168.1.104',
        location: 'Tamil Nadu, India',
        lastActive: 'Just now',
        current: true,
      },
      {
        id: 'sess-2',
        device: 'Safari on iPhone 15 Pro',
        ip: '192.168.1.189',
        location: 'Tamil Nadu, India',
        lastActive: '2 days ago',
        current: false,
      },
    ];
  },
};

