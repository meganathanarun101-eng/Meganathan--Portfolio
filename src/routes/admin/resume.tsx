import { createFileRoute } from '@tanstack/react-router';
import { ResumeView } from '@/features/admin/views/ResumeView';

export const Route = createFileRoute('/admin/resume')({
  head: () => ({
    meta: [{ title: 'Resume Management — Admin Console' }],
  }),
  component: ResumePage,
});

function ResumePage() {
  return <ResumeView />;
}
