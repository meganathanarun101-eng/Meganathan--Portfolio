import { createFileRoute } from '@tanstack/react-router';
import { AchievementsView } from '@/features/admin/views/AchievementsView';

export const Route = createFileRoute('/admin/achievements')({
  head: () => ({
    meta: [{ title: 'Achievements Management — Admin Console' }],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  return <AchievementsView />;
}
