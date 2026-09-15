import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router';
import { AuthProvider } from '@/features/admin/context/AuthContext';
import { AdminAuthGuard } from '@/features/admin/components/layout/AdminAuthGuard';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';

export const Route = createFileRoute('/admin')({
  component: AdminRoot,
});

function AdminRoot() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const isLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      {isLoginPage ? (
        <Outlet />
      ) : (
        <AdminAuthGuard>
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        </AdminAuthGuard>
      )}
    </AuthProvider>
  );
}
