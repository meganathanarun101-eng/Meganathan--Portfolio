import { createFileRoute } from '@tanstack/react-router';
import { AnalyticsView } from '@/features/admin/views/AnalyticsView';

export const Route = createFileRoute('/admin/analytics')({
  head: () => ({
    meta: [{ title: 'Analytics — Admin Console' }],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return <AnalyticsView />;
}
