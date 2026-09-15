import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Eye,
  EyeOff,
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
import { EmploymentType, ExperienceItem } from '../types/portfolio';

const experienceSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  position: z.string().min(2, 'Position is required'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Internship', 'Freelance', 'Contract']),
  startDate: z.string().min(2, 'Start date is required'),
  endDate: z.string().min(2, 'End date is required'),
  currentlyWorking: z.boolean(),
  location: z.string().min(2, 'Location is required'),
  descriptionText: z.string().min(10, 'At least one description bullet is required'),
  techTags: z.string().min(2, 'Comma-separated technologies are required'),
  published: z.boolean(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;

export function ExperienceView() {
  const { experience, saveExperience, deleteExperience } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      position: '',
      employmentType: 'Internship',
      startDate: '',
      endDate: 'Present',
      currentlyWorking: true,
      location: 'Remote',
      descriptionText: '',
      techTags: 'React, Node.js, MongoDB',
      published: true,
    },
  });

  const watchedCurrentlyWorking = watch('currentlyWorking');

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({
      company: '',
      position: '',
      employmentType: 'Internship',
      startDate: '',
      endDate: 'Present',
      currentlyWorking: true,
      location: 'Remote',
      descriptionText: '',
      techTags: 'React, Node.js, MongoDB',
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ExperienceItem) => {
    setEditingItem(item);
    reset({
      company: item.company,
      position: item.position,
      employmentType: item.employmentType,
      startDate: item.startDate,
      endDate: item.endDate,
      currentlyWorking: item.currentlyWorking,
      location: item.location,
      descriptionText: item.description.join('\n'),
      techTags: item.technologies.join(', '),
      published: item.published,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: ExperienceFormValues) => {
    const descBullets = data.descriptionText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const techArray = data.techTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const saved: ExperienceItem = {
      id: editingItem?.id ?? `exp-${Date.now()}`,
      company: data.company,
      position: data.position,
      employmentType: data.employmentType as EmploymentType,
      startDate: data.startDate,
      endDate: data.currentlyWorking ? 'Present' : data.endDate,
      currentlyWorking: data.currentlyWorking,
      location: data.location,
      description: descBullets,
      technologies: techArray,
      published: data.published,
      sortOrder: editingItem?.sortOrder ?? experience.length + 1,
    };

    saveExperience(saved);
    setModalOpen(false);
  };

  const togglePublish = (item: ExperienceItem) => {
    saveExperience({
      ...item,
      published: !item.published,
    });
  };

  const handleReorder = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experience.length) return;

    const currentItem = experience[index];
    const targetItem = experience[targetIndex];
    if (!currentItem || !targetItem) return;

    const currentOrder = currentItem.sortOrder;
    saveExperience({ ...currentItem, sortOrder: targetItem.sortOrder });
    saveExperience({ ...targetItem, sortOrder: currentOrder });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Work Experience &amp; Positions
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage professional employment history, internships, freelance gigs, and project impacts.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Experience
        </Button>
      </div>

      {/* Experience List Cards */}
      <div className="space-y-4">
        {experience
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item, index) => (
            <div
              key={item.id}
              className={`rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 ${
                item.published
                  ? 'border-white/10 bg-card/60 hover:border-white/20'
                  : 'border-white/5 bg-card/30 opacity-75'
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold">
                      {item.startDate} — {item.endDate}
                    </span>
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-foreground">
                      {item.employmentType}
                    </span>
                    {item.currentlyWorking && (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Current
                      </span>
                    )}
                    {!item.published && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[0.65rem] font-bold text-amber-400">
                        Unpublished
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-foreground">
                    {item.position}
                  </h3>

                  <p className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-cyan-400" /> {item.company}
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {item.location}
                    </span>
                  </p>

                  <ul className="mt-3 space-y-1.5 pt-2 text-xs leading-relaxed text-muted-foreground">
                    {item.description.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right controls: Reorder, Publish toggle, Edit, Delete */}
                <div className="flex items-center gap-1 self-end md:self-start">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePublish(item)}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    title={item.published ? 'Unpublish' : 'Publish'}
                  >
                    {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-amber-400" />}
                  </Button>
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
                    disabled={index === experience.length - 1}
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
              {editingItem ? 'Edit Work Experience' : 'Add New Work Experience'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company" className="text-xs">Company / Organization</Label>
                <Input
                  id="company"
                  {...register('company')}
                  placeholder="e.g. Nexora Technologies"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.company && (
                  <p className="text-xs text-rose-400">{errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-xs">Position Title</Label>
                <Input
                  id="position"
                  {...register('position')}
                  placeholder="e.g. Full Stack Developer Intern"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.position && (
                  <p className="text-xs text-rose-400">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="employmentType" className="text-xs">Employment Type</Label>
                <select
                  id="employmentType"
                  {...register('employmentType')}
                  className="w-full rounded-xl border border-white/10 bg-card p-2.5 text-xs text-foreground outline-none focus:border-primary"
                >
                  <option value="Internship">Internship</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                <Input
                  id="startDate"
                  {...register('startDate')}
                  placeholder="e.g. 2025-01"
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
                  disabled={watchedCurrentlyWorking}
                  {...register('endDate')}
                  placeholder="e.g. Present"
                  className="rounded-xl border-white/10 bg-white/[0.03] disabled:opacity-50"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  {...register('currentlyWorking')}
                  className="h-4 w-4 rounded border-white/20 text-primary"
                />
                <span>I currently work here</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="h-4 w-4 rounded border-white/20 text-primary"
                />
                <span>Publish on portfolio</span>
              </label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-xs">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="e.g. Remote / Salem, Tamil Nadu"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.location && (
                <p className="text-xs text-rose-400">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descriptionText" className="text-xs">Bullet Points (One per line)</Label>
              <Textarea
                id="descriptionText"
                rows={4}
                {...register('descriptionText')}
                placeholder="Shipped multi-tenant dashboard in React...&#10;Cut API p95 latency by 62%..."
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
              />
              {errors.descriptionText && (
                <p className="text-xs text-rose-400">{errors.descriptionText.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="techTags" className="text-xs">Technologies (Comma separated)</Label>
              <Input
                id="techTags"
                {...register('techTags')}
                placeholder="React, Node.js, Express, MongoDB, Redis"
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
                {editingItem ? 'Save Changes' : 'Add Experience'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Experience Record?"
        description="Are you sure you want to delete this work experience entry? This cannot be undone."
        onConfirm={() => {
          if (itemToDelete) {
            deleteExperience(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
