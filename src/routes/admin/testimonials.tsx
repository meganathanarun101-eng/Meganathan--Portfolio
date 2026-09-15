import { createFileRoute } from '@tanstack/react-router';
import { TestimonialsView } from '@/features/admin/views/TestimonialsView';

export const Route = createFileRoute('/admin/testimonials')({
  head: () => ({
    meta: [{ title: 'Testimonials Management — Admin Console' }],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return <TestimonialsView />;
}
