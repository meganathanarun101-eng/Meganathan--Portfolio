import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Copy,
  ExternalLink,
  Eye,
  FolderGit2,
  Github,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ColumnDef, DataTable } from '../components/common/DataTable';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { ImageUploader } from '../components/common/ImageUploader';
import { useAdminData } from '../context/AdminDataContext';
import { ProjectCategory, ProjectItem, ProjectStatus } from '../types/portfolio';

const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().min(2, 'Slug is required'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDescription: z.string().min(20, 'Full description must be at least 20 characters'),
  category: z.enum(['Full Stack', 'Frontend', 'Backend', 'AI', 'Mobile']),
  status: z.enum(['published', 'draft', 'archived']),
  demoUrl: z.string().url('Enter a valid demo URL').or(z.literal('')),
  githubUrl: z.string().url('Enter a valid GitHub URL').or(z.literal('')),
  tagsString: z.string().min(2, 'Enter at least one technology tag'),
  startDate: z.string().min(2, 'Start date is required'),
  endDate: z.string().min(2, 'End date is required'),
  featured: z.boolean(),
  image: z.string().min(1, 'Project preview image is required'),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectsView() {
  const {
    projects,
    saveProject,
    deleteProject,
    duplicateProject,
  } = useAdminData();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [previewProject, setPreviewProject] = useState<ProjectItem | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      category: 'Full Stack',
      status: 'published',
      demoUrl: 'https://example.com',
      githubUrl: 'https://github.com/meganathan-r',
      tagsString: 'React, Node.js, MongoDB',
      startDate: '2025-01-01',
      endDate: '2025-03-15',
      featured: false,
      image: '',
    },
  });

  const watchedTitle = watch('title');
  const watchedImage = watch('image');

  // Auto-generate slug when title changes in add mode
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!editingProject) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setGalleryImages([]);
    reset({
      title: '',
      slug: '',
      shortDescription: '',
      fullDescription: '',
      category: 'Full Stack',
      status: 'published',
      demoUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/meganathan-r',
      tagsString: 'React, Vite, Tailwind CSS',
      startDate: '2026-01-01',
      endDate: '2026-02-15',
      featured: false,
      image: '/assets/p1.jpg',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (project: ProjectItem) => {
    setEditingProject(project);
    setGalleryImages(project.galleryImages || []);
    reset({
      title: project.title,
      slug: project.slug,
      shortDescription: project.shortDescription,
      fullDescription: project.fullDescription,
      category: project.category,
      status: project.status,
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      tagsString: project.tags.join(', '),
      startDate: project.startDate,
      endDate: project.endDate,
      featured: project.featured,
      image: project.image,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: ProjectFormValues) => {
    const tags = data.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const saved: ProjectItem = {
      id: editingProject?.id ?? `proj-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      shortDescription: data.shortDescription,
      fullDescription: data.fullDescription,
      category: data.category as ProjectCategory,
      status: data.status as ProjectStatus,
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      tags,
      startDate: data.startDate,
      endDate: data.endDate,
      featured: data.featured,
      image: data.image,
      galleryImages: galleryImages.length > 0 ? galleryImages : [data.image],
      views: editingProject?.views ?? 120,
      clicks: editingProject?.clicks ?? 35,
      githubClicks: editingProject?.githubClicks ?? 18,
      createdAt: editingProject?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveProject(saved);
    setModalOpen(false);
  };

  const columns: ColumnDef<ProjectItem>[] = [
    {
      id: 'thumbnail',
      header: 'Project',
      cell: (p) => (
        <div className="flex items-center gap-3">
          <img
            src={p.image}
            alt={p.title}
            className="h-11 w-16 shrink-0 rounded-xl object-cover border border-white/10"
          />
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">{p.title}</span>
              {p.featured && (
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              )}
            </div>
            <p className="font-mono text-[0.65rem] text-muted-foreground">{p.slug}</p>
          </div>
        </div>
      ),
      sortable: true,
      accessorKey: 'title',
    },
    {
      id: 'category',
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      cell: (p) => (
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[0.65rem] text-foreground font-medium">
          {p.category}
        </span>
      ),
    },
    {
      id: 'tags',
      header: 'Technologies',
      cell: (p) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {p.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/5 bg-white/[0.02] px-1.5 py-0.5 text-[0.6rem] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {p.tags.length > 3 && (
            <span className="text-[0.6rem] text-muted-foreground">
              +{p.tags.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (p) => (
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase ${
            p.status === 'published'
              ? 'bg-emerald-500/15 text-emerald-400'
              : p.status === 'draft'
              ? 'bg-amber-500/15 text-amber-400'
              : 'bg-white/10 text-muted-foreground'
          }`}
        >
          {p.status}
        </span>
      ),
    },
    {
      id: 'engagement',
      header: 'Views / Clicks',
      sortable: true,
      accessorKey: 'views',
      cell: (p) => (
        <span className="font-mono text-[0.7rem] text-muted-foreground">
          {p.views.toLocaleString()} / <span className="text-primary font-semibold">{p.clicks}</span>
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (p) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setPreviewProject(p)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Preview"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => duplicateProject(p.id)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenEdit(p)}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setItemToDelete(p.id)}
            className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Project Showcase &amp; Builds
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your flagship portfolio builds, descriptions, live demo links, repositories, and media.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Create New Project
        </Button>
      </div>

      {/* Main Data Table */}
      <DataTable
        data={projects}
        columns={columns}
        getItemId={(p) => p.id}
        searchPlaceholder="Search projects by title, category, or tags..."
        filterKey="category"
        filterOptions={[
          { label: 'Full Stack', value: 'Full Stack' },
          { label: 'Frontend', value: 'Frontend' },
          { label: 'AI', value: 'AI' },
          { label: 'Backend', value: 'Backend' },
        ]}
        onBulkDelete={(ids) => {
          ids.forEach((id) => deleteProject(id));
        }}
        onBulkPublish={(ids) => {
          ids.forEach((id) => {
            const p = projects.find((proj) => proj.id === id);
            if (p) saveProject({ ...p, status: 'published' });
          });
        }}
        emptyTitle="No projects found"
        emptyDescription="Create your first project build to showcase on your portfolio."
        emptyActionLabel="Add Project"
        onEmptyAction={handleOpenAdd}
      />

      {/* CMS Project Add/Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-white/10 bg-card/95 backdrop-blur-2xl p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              {editingProject ? 'Edit Project' : 'Add New Portfolio Project'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            {/* Title & Slug */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs">Project Title</Label>
                <Input
                  id="title"
                  value={watchedTitle}
                  onChange={handleTitleChange}
                  placeholder="e.g. Student Job Finder"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-xs">URL Slug</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="student-job-finder"
                  className="rounded-xl border-white/10 bg-white/[0.03] font-mono text-xs"
                />
                {errors.slug && <p className="text-xs text-rose-400">{errors.slug.message}</p>}
              </div>
            </div>

            {/* Category & Status */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs">Category</Label>
                <select
                  id="category"
                  {...register('category')}
                  className="w-full rounded-xl border border-white/10 bg-card p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI">AI</option>
                  <option value="Mobile">Mobile</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs">Publication Status</Label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full rounded-xl border border-white/10 bg-card p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Short & Full Description */}
            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-xs">
                Short Description / Blurb (Appears on card)
              </Label>
              <Input
                id="shortDescription"
                {...register('shortDescription')}
                placeholder="Job discovery platform matching students to internships..."
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.shortDescription && (
                <p className="text-xs text-rose-400">{errors.shortDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription" className="text-xs">
                Full Description &amp; Technical Architecture
              </Label>
              <Textarea
                id="fullDescription"
                rows={4}
                {...register('fullDescription')}
                placeholder="Detailed explanation of features, database schema, and challenges solved..."
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
              />
              {errors.fullDescription && (
                <p className="text-xs text-rose-400">{errors.fullDescription.message}</p>
              )}
            </div>

            {/* URLs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demoUrl" className="text-xs flex items-center gap-1.5">
                  <ExternalLink className="h-3.5 w-3.5 text-primary" /> Live Demo URL
                </Label>
                <Input
                  id="demoUrl"
                  {...register('demoUrl')}
                  placeholder="https://example.com/demo"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl" className="text-xs flex items-center gap-1.5">
                  <Github className="h-3.5 w-3.5 text-primary" /> GitHub Repository URL
                </Label>
                <Input
                  id="githubUrl"
                  {...register('githubUrl')}
                  placeholder="https://github.com/meganathan-r/repo"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <Label htmlFor="tagsString" className="text-xs">Technologies (Comma separated)</Label>
              <Input
                id="tagsString"
                {...register('tagsString')}
                placeholder="React, Node.js, MongoDB, Express, Tailwind CSS"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
            </div>

            {/* Dates & Featured toggle */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                <Input
                  id="startDate"
                  {...register('startDate')}
                  placeholder="2025-01-10"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs">End Date</Label>
                <Input
                  id="endDate"
                  {...register('endDate')}
                  placeholder="2025-03-15"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="h-4 w-4 rounded border-white/20 text-primary"
                  />
                  <span>Mark as Featured Project</span>
                </label>
              </div>
            </div>

            {/* Image Uploader */}
            <div className="space-y-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Project Cover &amp; Gallery
              </Label>
              <ImageUploader
                value={watchedImage}
                onChange={(url) => setValue('image', url, { shouldDirty: true })}
                label="Primary Thumbnail"
              />
              {errors.image && <p className="text-xs text-rose-400">{errors.image.message}</p>}

              <ImageUploader
                multiple
                galleryValues={galleryImages}
                onGalleryChange={setGalleryImages}
                label="Additional Gallery Images"
              />
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="border-white/10"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {editingProject ? 'Save Changes' : 'Create Project'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Live Preview Modal */}
      {previewProject && (
        <Dialog open={Boolean(previewProject)} onOpenChange={() => setPreviewProject(null)}>
          <DialogContent className="max-w-xl border-white/10 bg-card/95 backdrop-blur-2xl p-6">
            <DialogHeader>
              <DialogTitle className="font-display text-lg font-bold">
                Project Card Preview
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={previewProject.image}
                  alt={previewProject.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-wider text-white backdrop-blur-md">
                  {previewProject.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-foreground">
                  {previewProject.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {previewProject.shortDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {previewProject.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <a
                    href={previewProject.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                  </a>
                  <a
                    href={previewProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-foreground hover:bg-white/10"
                  >
                    <Github className="h-3.5 w-3.5" /> GitHub
                  </a>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Project?"
        description="Are you sure you want to permanently delete this project? All associated metrics and media references will be removed."
        onConfirm={() => {
          if (itemToDelete) {
            deleteProject(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
