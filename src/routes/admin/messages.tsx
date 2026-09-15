import { createFileRoute } from '@tanstack/react-router';
import { MessagesView } from '@/features/admin/views/MessagesView';

export const Route = createFileRoute('/admin/messages')({
  head: () => ({
    meta: [{ title: 'Messages Inbox — Admin Console' }],
  }),
  component: MessagesPage,
});

function MessagesPage() {
  return <MessagesView />;
}
