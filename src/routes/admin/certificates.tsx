import { createFileRoute } from '@tanstack/react-router';
import { CertificatesView } from '@/features/admin/views/CertificatesView';

export const Route = createFileRoute('/admin/certificates')({
  head: () => ({
    meta: [{ title: 'Certificates Management — Admin Console' }],
  }),
  component: CertificatesPage,
});

function CertificatesPage() {
  return <CertificatesView />;
}
