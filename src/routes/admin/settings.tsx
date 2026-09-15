import { createFileRoute } from '@tanstack/react-router';
import { SettingsView } from '@/features/admin/views/SettingsView';

export const Route = createFileRoute('/admin/settings')({
  head: () => ({
    meta: [{ title: 'Settings — Admin Console' }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return <SettingsView />;
}
