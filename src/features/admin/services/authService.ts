import { AdminUser, AuthSession, LoginCredentials } from '../types/auth';

const STORAGE_KEY_SESSION = 'meganathan_admin_session';
const STORAGE_KEY_USERS = 'meganathan_admin_users';

/**
 * DEFAULT DEMO CREDENTIALS:
 * Email: admin@meganathan.dev (or meganathanarun101@gmail.com)
 * Password: admin123
 *
 * ARCHITECTURAL NOTE FOR REAL BACKEND:
 * To integrate a real authentication provider (e.g. Supabase, Firebase, NextAuth,
 * Node/Express JWT, Clerk, or Auth0):
 * 1. Replace the mock validation in `login()` with your backend API call.
 * 2. Store the JWT token or session cookie returned by the server.
 * 3. Verify the token with an HTTP interceptor or TanStack Query loader.
 * No UI components will need to change, as they all consume `useAuth()`.
 */

const DEFAULT_ADMIN: AdminUser = {
  id: 'usr-admin-01',
  name: 'Meganathan R',
  email: 'admin@meganathan.dev',
  role: 'superadmin',
  avatarUrl: '/assets/profile.jpg',
  title: 'Full Stack & MERN Developer',
  lastLogin: new Date().toISOString(),
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
    // Simulate realistic network latency for smooth UI feedback
    await new Promise((resolve) => setTimeout(resolve, 600));

    const email = credentials.email.trim().toLowerCase();
    const password = credentials.password;

    // Check against demo credentials or custom admin email
    const validEmails = ['admin@meganathan.dev', 'meganathanarun101@gmail.com', 'admin@example.com'];
    const isValidEmail = validEmails.includes(email);
    const isValidPassword = password === 'admin123' || password === 'admin';

    if (!isValidEmail || !isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials. Use admin@meganathan.dev / admin123 for demo access.',
      };
    }

    const session: AuthSession = {
      token: `demo_jwt_token_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      user: {
        ...DEFAULT_ADMIN,
        email: credentials.email,
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
