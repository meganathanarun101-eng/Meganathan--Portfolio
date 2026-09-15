import React, { useEffect, ReactNode } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminAuthGuardProps {
  children: ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({
        to: '/admin/login',
        search: {
          redirect: currentPath,
        } as any,
      });
    }
  }, [isAuthenticated, isLoading, navigate, currentPath]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <p className="font-display text-base font-semibold text-foreground">
            Authenticating Session...
          </p>
          <p className="max-w-xs font-mono text-xs text-muted-foreground">
            Validating security credentials for Meganathan R Admin
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShieldAlert className="h-10 w-10 text-rose-400" />
          <p className="text-sm text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
