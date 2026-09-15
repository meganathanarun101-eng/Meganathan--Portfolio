import { createFileRoute } from '@tanstack/react-router';
import { SkillsView } from '@/features/admin/views/SkillsView';

export const Route = createFileRoute('/admin/skills')({
  head: () => ({
    meta: [{ title: 'Skills Management — Admin Console' }],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  return <SkillsView />;
}
