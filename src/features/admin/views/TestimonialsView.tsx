import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowDown,
  ArrowUp,
  Building2,
  ExternalLink,
  Eye,
  EyeOff,
  Linkedin,
  MessageSquareQuote,
  Pencil,
  Plus,
  Quote,
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
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useAdminData } from '../context/AdminDataContext';
import { TestimonialItem } from '../types/portfolio';

const testimonialSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  company: z.string().min(2, 'Company is required'),
  quote: z.string().min(10, 'Testimonial quote must be at least 10 characters'),
  rating: z.number().min(1).max(5),
  linkedinUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  featured: z.boolean(),
  published: z.boolean(),
});

type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export function TestimonialsView() {
  const { testimonials, saveTestimonial, deleteTestimonial } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      role: '',
      company: '',
      quote: '',
      rating: 5,
      linkedinUrl: '',
      featured: true,
      published: true,
    },
  });

  const watchedRating = watch('rating');

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({
      name: '',
      role: '',
      company: '',
      quote: '',
      rating: 5,
      linkedinUrl: '',
      featured: true,
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: TestimonialItem) => {
    setEditingItem(item);
    reset({
      name: item.name,
      role: item.role,
      company: item.company,
      quote: item.quote,
      rating: item.rating,
      linkedinUrl: item.linkedinUrl ?? '',
      featured: item.featured,
      published: item.published,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: TestimonialFormValues) => {
    const saved: TestimonialItem = {
      id: editingItem?.id ?? `tst-${Date.now()}`,
      name: data.name,
      role: data.role,
      company: data.company,
      quote: data.quote,
      rating: data.rating,
      linkedinUrl: data.linkedinUrl || undefined,
      featured: data.featured,
      published: data.published,
      sortOrder: editingItem?.sortOrder ?? testimonials.length + 1,
    };
    saveTestimonial(saved);
    setModalOpen(false);
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const currentItem = testimonials[index];
    const targetItem = testimonials[targetIndex];
    if (!currentItem || !targetItem) return;

    const currentOrder = currentItem.sortOrder;
    saveTestimonial({ ...currentItem, sortOrder: targetItem.sortOrder });
    saveTestimonial({ ...targetItem, sortOrder: currentOrder });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Client &amp; Peer Testimonials
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage endorsements, recommendations, colleague reviews, and ratings.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </Button>
      </div>

      {/* Testimonials Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item, index) => (
            <div
              key={item.id}
              className={`group flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 ${
                item.published
                  ? 'border-white/10 bg-card/60 hover:border-primary/40'
                  : 'border-white/5 bg-card/30 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < item.rating ? 'fill-amber-400' : 'opacity-20'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        saveTestimonial({ ...item, published: !item.published })
                      }
                      className="h-7 w-7 p-0 text-muted-foreground"
                    >
                      {item.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-amber-400" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={index === 0}
                      onClick={() => handleReorder(index, 'up')}
                      className="h-7 w-7 p-0 text-muted-foreground disabled:opacity-20"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={index === testimonials.length - 1}
                      onClick={() => handleReorder(index, 'down')}
                      className="h-7 w-7 p-0 text-muted-foreground disabled:opacity-20"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenEdit(item)}
                      className="h-7 w-7 p-0 text-muted-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setItemToDelete(item.id)}
                      className="h-7 w-7 p-0 text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <Quote className="h-6 w-6 shrink-0 text-primary/60" />
                  <p className="text-xs leading-relaxed text-foreground/90 italic">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">{item.name}</h4>
                  <p className="text-[0.65rem] text-muted-foreground">
                    {item.role}, {item.company}
                  </p>
                </div>

                {item.linkedinUrl && (
                  <a
                    href={item.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-primary"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md border-white/10 bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              {editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs">Client / Colleague Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g. Priya Sundaram"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-xs">Professional Role</Label>
                <Input
                  id="role"
                  {...register('role')}
                  placeholder="e.g. Product Manager"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs">Company</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="e.g. Nexora"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quote" className="text-xs">Testimonial Quote</Label>
              <Textarea
                id="quote"
                rows={3}
                {...register('quote')}
                placeholder="What did they say about working with you..."
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
              />
              {errors.quote && <p className="text-xs text-rose-400">{errors.quote.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-xs">Rating (1 to 5 Stars)</Label>
                <select
                  id="rating"
                  value={watchedRating}
                  onChange={(e) => setValue('rating', Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-card p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3/5 Stars)</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedinUrl" className="text-xs">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  {...register('linkedinUrl')}
                  placeholder="https://linkedin.com/in/..."
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="h-4 w-4 rounded border-white/20 text-primary"
                />
                <span>Featured Testimonial</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="h-4 w-4 rounded border-white/20 text-primary"
                />
                <span>Published</span>
              </label>
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
                {editingItem ? 'Save Changes' : 'Add Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Testimonial?"
        description="Are you sure you want to remove this client review?"
        onConfirm={() => {
          if (itemToDelete) {
            deleteTestimonial(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
