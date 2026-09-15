import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Award,
  Calendar,
  ExternalLink,
  Medal,
  Pencil,
  Plus,
  Star,
  Trash2,
  Trophy,
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
import { AchievementItem } from '../types/portfolio';

const achievementSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(5, 'Description is required'),
  date: z.string().min(2, 'Date or year is required'),
  organization: z.string().min(2, 'Organization is required'),
  link: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  iconType: z.enum(['trophy', 'medal', 'award', 'star']),
  featured: z.boolean(),
  published: z.boolean(),
});

type AchievementFormValues = z.infer<typeof achievementSchema>;

export function AchievementsView() {
  const { achievements, saveAchievement, deleteAchievement } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AchievementItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AchievementFormValues>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '2025',
      organization: '',
      link: '',
      iconType: 'trophy',
      featured: true,
      published: true,
    },
  });

  const watchedIconType = watch('iconType');

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({
      title: '',
      description: '',
      date: '2025',
      organization: '',
      link: '',
      iconType: 'trophy',
      featured: true,
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: AchievementItem) => {
    setEditingItem(item);
    reset({
      title: item.title,
      description: item.description,
      date: item.date,
      organization: item.organization,
      link: item.link ?? '',
      iconType: item.iconType,
      featured: item.featured,
      published: item.published,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: AchievementFormValues) => {
    const saved: AchievementItem = {
      id: editingItem?.id ?? `ach-${Date.now()}`,
      title: data.title,
      description: data.description,
      date: data.date,
      organization: data.organization,
      link: data.link || undefined,
      iconType: data.iconType,
      featured: data.featured,
      published: data.published,
    };
    saveAchievement(saved);
    setModalOpen(false);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'trophy':
        return <Trophy className="h-5 w-5 text-amber-400" />;
      case 'medal':
        return <Medal className="h-5 w-5 text-cyan-400" />;
      case 'award':
        return <Award className="h-5 w-5 text-primary" />;
      default:
        return <Star className="h-5 w-5 text-violet-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Achievements &amp; Honors
          </h1>
          <p className="text-sm text-muted-foreground">
            Highlight hackathon victories, competitive coding rankings, and dev community leadership.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Achievement
        </Button>
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {achievements.map((item) => (
          <div
            key={item.id}
            className="group relative flex items-start gap-4 rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              {renderIcon(item.iconType)}
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-primary font-bold">
                  {item.date} · {item.organization}
                </span>

                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setItemToDelete(item.id)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-display text-base font-bold text-foreground">
                {item.title}
              </h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>

              {item.link && (
                <div className="pt-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-cyan-400 hover:underline"
                  >
                    View proof link <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
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
              {editingItem ? 'Edit Achievement' : 'Add New Achievement'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs">Title</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="e.g. Winner — Smart Campus Hackathon"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.title && <p className="text-xs text-rose-400">{errors.title.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-xs">Organization / Event</Label>
                <Input
                  id="organization"
                  {...register('organization')}
                  placeholder="e.g. Anna University"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-xs">Year / Date</Label>
                <Input
                  id="date"
                  {...register('date')}
                  placeholder="e.g. 2025"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Icon Badge</Label>
              <div className="grid grid-cols-4 gap-2">
                {(['trophy', 'medal', 'award', 'star'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setValue('iconType', type)}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center capitalize transition-all ${
                      watchedIconType === type
                        ? 'border-primary bg-primary/20 text-primary'
                        : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05]'
                    }`}
                  >
                    {renderIcon(type)}
                    <span className="text-[0.65rem]">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs">Description</Label>
              <Textarea
                id="description"
                rows={3}
                {...register('description')}
                placeholder="Built an attendance automation system in 24 hours..."
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="text-xs">Link (Optional)</Label>
              <Input
                id="link"
                {...register('link')}
                placeholder="https://github.com/..."
                className="rounded-xl border-white/10 bg-white/[0.03]"
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
                {editingItem ? 'Save Changes' : 'Add Achievement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Achievement?"
        description="Are you sure you want to delete this achievement record?"
        onConfirm={() => {
          if (itemToDelete) {
            deleteAchievement(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
