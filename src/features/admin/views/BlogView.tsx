import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Eye,
  Pencil,
  Plus,
  Search,
  Sparkles,
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
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { RichTextEditor } from '../components/common/RichTextEditor';
import { ImageUploader } from '../components/common/ImageUploader';
import { useAdminData } from '../context/AdminDataContext';
import { BlogPostItem, BlogPostStatus } from '../types/portfolio';

const blogSchema = z.object({
  title: z.string().min(2, 'Post title is required'),
  slug: z.string().min(2, 'Slug is required'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  tagsString: z.string().min(2, 'Enter at least one tag'),
  author: z.string().min(2, 'Author name is required'),
  status: z.enum(['published', 'draft', 'scheduled']),
  publishedDate: z.string().min(2, 'Published date is required'),
  readTime: z.string().min(2, 'Read time is required'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  coverImage: z.string().min(1, 'Cover image is required'),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export function BlogView() {
  const { blogPosts, saveBlogPost, deleteBlogPost } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPostItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [contentBody, setContentBody] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      category: 'Engineering',
      tagsString: 'React, TypeScript',
      author: 'Meganathan R',
      status: 'published',
      publishedDate: '2026-09-10',
      readTime: '5 min',
      seoTitle: '',
      seoDescription: '',
      coverImage: '/assets/p2.jpg',
    },
  });

  const watchedTitle = watch('title');
  const watchedCoverImage = watch('coverImage');

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [blogPosts, statusFilter, searchQuery]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue('title', val);
    if (!editingPost) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setValue('slug', generatedSlug);
    }
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setContentBody('# Write your post title here\n\nIntroduction paragraph goes here...');
    reset({
      title: '',
      slug: '',
      excerpt: '',
      category: 'Engineering',
      tagsString: 'React, Architecture, Web Dev',
      author: 'Meganathan R',
      status: 'published',
      publishedDate: new Date().toISOString().split('T')[0] ?? '2026-09-10',
      readTime: '6 min',
      seoTitle: '',
      seoDescription: '',
      coverImage: '/assets/p2.jpg',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPostItem) => {
    setEditingPost(post);
    setContentBody(post.content);
    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      category: post.category,
      tagsString: post.tags.join(', '),
      author: post.author,
      status: post.status,
      publishedDate: post.publishedDate,
      readTime: post.readTime,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      coverImage: post.coverImage,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: BlogFormValues) => {
    const tags = data.tagsString
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const saved: BlogPostItem = {
      id: editingPost?.id ?? `post-${Date.now()}`,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: contentBody,
      coverImage: data.coverImage,
      category: data.category,
      tags,
      author: data.author,
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.excerpt,
      readTime: data.readTime,
      publishedDate: data.publishedDate,
      status: data.status as BlogPostStatus,
      views: editingPost?.views ?? 0,
    };

    saveBlogPost(saved);
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Blog &amp; Technical Articles
          </h1>
          <p className="text-sm text-muted-foreground">
            Author and publish engineering insights, architecture breakdowns, and tutorial notes.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Write New Post
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {['all', 'published', 'draft', 'scheduled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="h-9 rounded-xl border-white/10 bg-white/[0.03] pl-9 text-xs"
          />
        </div>
      </div>

      {/* Blog Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
          >
            <div>
              <div className="relative aspect-[16/9] overflow-hidden bg-black/40">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase text-white backdrop-blur-md">
                  {post.category}
                </span>
                <span
                  className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 font-mono text-[0.6rem] font-bold uppercase backdrop-blur-md ${
                    post.status === 'published'
                      ? 'bg-emerald-500/80 text-white'
                      : post.status === 'draft'
                      ? 'bg-amber-500/80 text-white'
                      : 'bg-cyan-500/80 text-white'
                  }`}
                >
                  {post.status}
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 font-mono text-[0.65rem] text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {post.publishedDate}
                  <span>·</span>
                  <Clock className="h-3 w-3" /> {post.readTime}
                </div>

                <h3 className="mt-2 font-display text-base font-bold text-foreground leading-snug line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {post.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-0.5 font-mono text-[0.6rem] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 p-4 bg-white/[0.02]">
              <span className="font-mono text-[0.65rem] text-muted-foreground">
                {post.views} readers
              </span>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenEdit(post)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                  title="Edit Post"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setItemToDelete(post.id)}
                  className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
                  title="Delete Post"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto border-white/10 bg-card/95 backdrop-blur-2xl p-6 md:p-8">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">
              {editingPost ? 'Edit Blog Article' : 'Compose Technical Article'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-xs">Post Title</Label>
                <Input
                  id="title"
                  value={watchedTitle}
                  onChange={handleTitleChange}
                  placeholder="e.g. Why I stopped fighting the React re-render"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-xs">Post Slug</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="why-i-stopped-fighting-react-re-render"
                  className="rounded-xl border-white/10 bg-white/[0.03] font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-xs">Category</Label>
                <Input
                  id="category"
                  {...register('category')}
                  placeholder="e.g. Engineering / AI"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs">Status</Label>
                <select
                  id="status"
                  {...register('status')}
                  className="w-full rounded-xl border border-white/10 bg-card p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="readTime" className="text-xs">Read Time</Label>
                <Input
                  id="readTime"
                  {...register('readTime')}
                  placeholder="e.g. 6 min"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-xs">Short Excerpt (Summary for Cards &amp; SEO)</Label>
              <Textarea
                id="excerpt"
                rows={2}
                {...register('excerpt')}
                placeholder="A quick summary of this engineering note..."
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
              />
            </div>

            {/* Rich Markdown Editor */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Post Content (Markdown &amp; Rich Formatting)</Label>
              <RichTextEditor
                value={contentBody}
                onChange={setContentBody}
                minHeight="min-h-[320px]"
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label className="text-xs">Cover Image</Label>
              <ImageUploader
                value={watchedCoverImage}
                onChange={(url) => setValue('coverImage', url, { shouldDirty: true })}
                label="Article Cover"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tagsString" className="text-xs">Tags (Comma separated)</Label>
                <Input
                  id="tagsString"
                  {...register('tagsString')}
                  placeholder="React, Architecture, Systems"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-xs">Author Name</Label>
                <Input
                  id="author"
                  {...register('author')}
                  placeholder="Meganathan R"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
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
                {editingPost ? 'Save Changes' : 'Publish Article'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Blog Post?"
        description="Are you sure you want to permanently delete this article?"
        onConfirm={() => {
          if (itemToDelete) {
            deleteBlogPost(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
