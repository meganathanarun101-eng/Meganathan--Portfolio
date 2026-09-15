import { createFileRoute } from '@tanstack/react-router';
import { ExperienceView } from '@/features/admin/views/ExperienceView';

export const Route = createFileRoute('/admin/experience')({
  head: () => ({
    meta: [{ title: 'Experience Management — Admin Console' }],
  }),
  component: ExperiencePage,
});

function ExperiencePage() {
  return <ExperienceView />;
}
