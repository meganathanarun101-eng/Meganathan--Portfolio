import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
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
import { EducationItem } from '../types/portfolio';

const educationSchema = z.object({
  institution: z.string().min(2, 'Institution is required'),
  degree: z.string().min(2, 'Degree is required'),
  field: z.string().min(2, 'Field of study is required'),
  startDate: z.string().min(2, 'Start date is required'),
  endDate: z.string().min(2, 'End date is required'),
  grade: z.string().min(1, 'Grade or CGPA is required'),
  location: z.string().min(2, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type EducationFormValues = z.infer<typeof educationSchema>;

export function EducationView() {
  const { education, saveEducation, deleteEducation } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EducationItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
      location: '',
      description: '',
    },
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      grade: '',
      location: '',
      description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: EducationItem) => {
    setEditingItem(item);
    reset({
      institution: item.institution,
      degree: item.degree,
      field: item.field,
      startDate: item.startDate,
      endDate: item.endDate,
      grade: item.grade,
      location: item.location,
      description: item.description,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: EducationFormValues) => {
    const itemToSave: EducationItem = {
      id: editingItem?.id ?? `edu-${Date.now()}`,
      institution: data.institution,
      degree: data.degree,
      field: data.field,
      startDate: data.startDate,
      endDate: data.endDate,
      grade: data.grade,
      location: data.location,
      description: data.description,
      sortOrder: editingItem?.sortOrder ?? education.length + 1,
    };

    saveEducation(itemToSave);
    setModalOpen(false);
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= education.length) return;

    const currentItem = education[index];
    const targetItem = education[targetIndex];
    if (!currentItem || !targetItem) return;

    const currentOrder = currentItem.sortOrder;
    saveEducation({ ...currentItem, sortOrder: targetItem.sortOrder });
    saveEducation({ ...targetItem, sortOrder: currentOrder });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Education Milestones
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage academic qualifications, degrees, institutions, and timeline order.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Education
        </Button>
      </div>

      {/* Timeline Display */}
      <div className="relative pl-6 md:pl-8 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-cyan-400 before:to-transparent space-y-6">
        {education
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item, index) => (
            <div
              key={item.id}
              className="group relative rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20"
            >
              {/* Timeline marker */}
              <span className="absolute -left-[1.85rem] top-7 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-cyan-400 shadow-md shadow-cyan-500/50 ring-4 ring-background" />

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-primary font-bold">
                      <Calendar className="h-3.5 w-3.5" /> {item.startDate} — {item.endDate}
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-foreground">
                      {item.grade}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground">
                    {item.degree} in {item.field}
                  </h3>

                  <p className="text-sm font-semibold text-foreground/80 flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-cyan-400" /> {item.institution}
                  </p>

                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {item.location}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                {/* Actions & Reorder */}
                <div className="flex items-center gap-1 self-end sm:self-start">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => handleReorder(index, 'up')}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={index === education.length - 1}
                    onClick={() => handleReorder(index, 'down')}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenEdit(item)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setItemToDelete(item.id)}
                    className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl border-white/10 bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              {editingItem ? 'Edit Education Entry' : 'Add New Education Entry'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="institution" className="text-xs">Institution Name</Label>
              <Input
                id="institution"
                {...register('institution')}
                placeholder="e.g. Anna University / JKKN College"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.institution && (
                <p className="text-xs text-rose-400">{errors.institution.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="degree" className="text-xs">Degree</Label>
                <Input
                  id="degree"
                  {...register('degree')}
                  placeholder="e.g. B.Tech"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.degree && (
                  <p className="text-xs text-rose-400">{errors.degree.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="field" className="text-xs">Field of Study</Label>
                <Input
                  id="field"
                  {...register('field')}
                  placeholder="e.g. Information Technology"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.field && (
                  <p className="text-xs text-rose-400">{errors.field.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                <Input
                  id="startDate"
                  {...register('startDate')}
                  placeholder="e.g. 2024"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.startDate && (
                  <p className="text-xs text-rose-400">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs">End Date</Label>
                <Input
                  id="endDate"
                  {...register('endDate')}
                  placeholder="e.g. 2028 or Present"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.endDate && (
                  <p className="text-xs text-rose-400">{errors.endDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade" className="text-xs">Grade / CGPA</Label>
                <Input
                  id="grade"
                  {...register('grade')}
                  placeholder="e.g. CGPA 8.7 / 10"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.grade && (
                  <p className="text-xs text-rose-400">{errors.grade.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g. Tamil Nadu, India"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.location && (
                <p className="text-xs text-rose-400">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs">Description &amp; Highlights</Label>
              <Textarea
                id="description"
                rows={3}
                {...register('description')}
                placeholder="Key courses, projects, or honors..."
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.description && (
                <p className="text-xs text-rose-400">{errors.description.message}</p>
              )}
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
                {editingItem ? 'Save Changes' : 'Add Education'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Education Record?"
        description="Are you sure you want to remove this academic credential? It will be removed from your timeline."
        onConfirm={() => {
          if (itemToDelete) {
            deleteEducation(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
