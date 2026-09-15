import { createFileRoute } from '@tanstack/react-router';
import { BlogView } from '@/features/admin/views/BlogView';

export const Route = createFileRoute('/admin/blog')({
  head: () => ({
    meta: [{ title: 'Blog Management — Admin Console' }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return <BlogView />;
}
