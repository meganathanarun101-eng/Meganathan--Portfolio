import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AdminUser, AuthSession, LoginCredentials } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  user: AdminUser | null;
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<AdminUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check existing session on mount
    const existing = authService.getSession();
    if (existing) {
      setSession(existing);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    const result = await authService.login(credentials);
    setIsLoading(false);

    if (result.success && result.session) {
      setSession(result.session);
      return { success: true };
    }

    return { success: false, error: result.error ?? 'Authentication failed' };
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  const updateProfile = (updates: Partial<AdminUser>) => {
    const updatedUser = authService.updateProfile(updates);
    if (updatedUser && session) {
      setSession({ ...session, user: updatedUser });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        isAuthenticated: session !== null,
        isLoading,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
