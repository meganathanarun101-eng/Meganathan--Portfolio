import { createFileRoute } from '@tanstack/react-router';
import { ProjectsView } from '@/features/admin/views/ProjectsView';

export const Route = createFileRoute('/admin/projects')({
  head: () => ({
    meta: [{ title: 'Projects Management — Admin Console' }],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return <ProjectsView />;
}
