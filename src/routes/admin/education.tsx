import { createFileRoute } from '@tanstack/react-router';
import { EducationView } from '@/features/admin/views/EducationView';

export const Route = createFileRoute('/admin/education')({
  head: () => ({
    meta: [{ title: 'Education Management — Admin Console' }],
  }),
  component: EducationPage,
});

function EducationPage() {
  return <EducationView />;
}
