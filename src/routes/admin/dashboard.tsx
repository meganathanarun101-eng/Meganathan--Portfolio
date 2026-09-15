import { createFileRoute } from '@tanstack/react-router';
import { DashboardView } from '@/features/admin/views/DashboardView';

export const Route = createFileRoute('/admin/dashboard')({
  head: () => ({
    meta: [{ title: 'Dashboard — Admin Console' }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  return <DashboardView />;
}
