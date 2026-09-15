import { createFileRoute } from '@tanstack/react-router';
import { ProfileView } from '@/features/admin/views/ProfileView';

export const Route = createFileRoute('/admin/profile')({
  head: () => ({
    meta: [{ title: 'Profile Management — Admin Console' }],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return <ProfileView />;
}
