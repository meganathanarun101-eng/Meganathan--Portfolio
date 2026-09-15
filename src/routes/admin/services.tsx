import { createFileRoute } from '@tanstack/react-router';
import { ServicesView } from '@/features/admin/views/ServicesView';

export const Route = createFileRoute('/admin/services')({
  head: () => ({
    meta: [{ title: 'Services Management — Admin Console' }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return <ServicesView />;
}
