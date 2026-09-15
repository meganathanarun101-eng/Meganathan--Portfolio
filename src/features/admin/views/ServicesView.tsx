import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Bot,
  Boxes,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Gauge,
  Layers,
  LayoutTemplate,
  Pencil,
  Plus,
  Server,
  Smartphone,
  Sparkles,
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
import { ServiceItem } from '../types/portfolio';

const ICON_OPTIONS = [
  { name: 'LayoutTemplate', icon: LayoutTemplate, label: 'Web UI / Frontend' },
  { name: 'Server', icon: Server, label: 'Backend / APIs' },
  { name: 'Bot', icon: Bot, label: 'AI Integration' },
  { name: 'Smartphone', icon: Smartphone, label: 'Mobile & Responsive' },
  { name: 'Gauge', icon: Gauge, label: 'Performance / Speed' },
  { name: 'Boxes', icon: Boxes, label: 'Architecture & Packages' },
];

const serviceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  iconName: z.string(),
  featuresText: z.string().min(5, 'Enter at least one feature (one per line)'),
  startingPrice: z.string().optional(),
  featured: z.boolean(),
  published: z.boolean(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export function ServicesView() {
  const { services, saveService, deleteService } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      description: '',
      iconName: 'LayoutTemplate',
      featuresText: '',
      startingPrice: '$250',
      featured: true,
      published: true,
    },
  });

  const watchedIcon = watch('iconName');

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({
      name: '',
      description: '',
      iconName: 'LayoutTemplate',
      featuresText: 'High performance code\nClean responsive design\nSEO & Analytics setup',
      startingPrice: '$250',
      featured: true,
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: ServiceItem) => {
    setEditingItem(item);
    reset({
      name: item.name,
      description: item.description,
      iconName: item.iconName,
      featuresText: item.features.join('\n'),
      startingPrice: item.startingPrice ?? '',
      featured: item.featured,
      published: item.published,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: ServiceFormValues) => {
    const featuresList = data.featuresText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const saved: ServiceItem = {
      id: editingItem?.id ?? `srv-${Date.now()}`,
      name: data.name,
      description: data.description,
      iconName: data.iconName,
      features: featuresList,
      startingPrice: data.startingPrice || undefined,
      featured: data.featured,
      published: data.published,
    };

    saveService(saved);
    setModalOpen(false);
  };

  const getIconComponent = (iconName: string) => {
    const opt = ICON_OPTIONS.find((o) => o.name === iconName);
    return opt ? opt.icon : Layers;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Services &amp; Offerings
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your client consulting offerings, deliverables, pricing, and feature highlights.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((item) => {
          const IconComp = getIconComponent(item.iconName);

          return (
            <div
              key={item.id}
              className={`group relative flex flex-col justify-between rounded-3xl border p-6 backdrop-blur-xl transition-all duration-300 ${
                item.published
                  ? 'border-white/10 bg-card/60 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5'
                  : 'border-white/5 bg-card/30 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                    <IconComp className="h-6 w-6" />
                  </div>

                  <div className="flex items-center gap-1">
                    {item.featured && (
                      <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-mono text-[0.65rem] font-bold text-amber-400 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400" /> Featured
                      </span>
                    )}
                    {!item.published && (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-muted-foreground">
                        Draft
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-foreground">
                  {item.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                {/* Features list */}
                <ul className="mt-4 space-y-2 border-t border-white/5 pt-4">
                  {item.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-foreground/85">
                      <Check className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom footer: Price & action buttons */}
              <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <span className="text-[0.65rem] uppercase text-muted-foreground">Starting from</span>
                  <p className="font-mono text-sm font-bold text-primary">
                    {item.startingPrice ?? 'Inquire'}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => saveService({ ...item, published: !item.published })}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    title={item.published ? 'Unpublish' : 'Publish'}
                  >
                    {item.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-amber-400" />}
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
          );
        })}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl border-white/10 bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              {editingItem ? 'Edit Service' : 'Add New Service'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs">Service Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g. MERN Web Development"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startingPrice" className="text-xs">Starting Price</Label>
                <Input
                  id="startingPrice"
                  {...register('startingPrice')}
                  placeholder="e.g. $250 or $50/hr"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            {/* Icon picker */}
            <div className="space-y-2">
              <Label className="text-xs">Choose Icon</Label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {ICON_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      type="button"
                      key={opt.name}
                      onClick={() => setValue('iconName', opt.name)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
                        watchedIcon === opt.name
                          ? 'border-primary bg-primary/20 text-primary'
                          : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="truncate text-[0.6rem]">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs">Short Description</Label>
              <Input
                id="description"
                {...register('description')}
                placeholder="High-level summary of what you engineer..."
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.description && (
                <p className="text-xs text-rose-400">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="featuresText" className="text-xs">Features &amp; Deliverables (One per line)</Label>
              <Textarea
                id="featuresText"
                rows={3}
                {...register('featuresText')}
                placeholder="Pixel-perfect UI design&#10;Lighthouse 95+ performance&#10;Clean API integration"
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
              />
              {errors.featuresText && (
                <p className="text-xs text-rose-400">{errors.featuresText.message}</p>
              )}
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="h-4 w-4 rounded border-white/20 text-primary"
                />
                <span>Featured Service</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  {...register('published')}
                  className="h-4 w-4 rounded border-white/20 text-primary"
                />
                <span>Published on Portfolio</span>
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
                {editingItem ? 'Save Changes' : 'Add Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Service?"
        description="Are you sure you want to remove this service offering from your portfolio?"
        onConfirm={() => {
          if (itemToDelete) {
            deleteService(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
