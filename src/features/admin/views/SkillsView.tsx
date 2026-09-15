import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Code2,
  Filter,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Star,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useAdminData } from '../context/AdminDataContext';
import { SkillCategory, SkillItem } from '../types/portfolio';
import { cn } from '@/lib/utils';

const CATEGORIES: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Database',
  'Programming',
  'Tools',
  'Other',
];

const skillSchema = z.object({
  name: z.string().min(2, 'Skill name is required'),
  level: z.number().min(1).max(100),
  category: z.enum(['Frontend', 'Backend', 'Database', 'Programming', 'Tools', 'Other']),
  sortOrder: z.number(),
  featured: z.boolean(),
});

type SkillFormValues = z.infer<typeof skillSchema>;

export function SkillsView() {
  const { skills, saveSkill, deleteSkill } = useAdminData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState<'gauge' | 'bar'>('gauge');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      level: 85,
      category: 'Frontend',
      sortOrder: 1,
      featured: true,
    },
  });

  const watchedLevel = watch('level');
  const watchedFeatured = watch('featured');

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesCategory =
        selectedCategory === 'all' || s.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  const handleOpenAdd = () => {
    setEditingSkill(null);
    reset({
      name: '',
      level: 85,
      category: 'Frontend',
      sortOrder: skills.length + 1,
      featured: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (skill: SkillItem) => {
    setEditingSkill(skill);
    reset({
      name: skill.name,
      level: skill.level,
      category: skill.category,
      sortOrder: skill.sortOrder,
      featured: skill.featured,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: SkillFormValues) => {
    const item: SkillItem = {
      id: editingSkill?.id ?? `sk-${Date.now()}`,
      name: data.name,
      level: data.level,
      category: data.category,
      sortOrder: data.sortOrder,
      featured: data.featured,
    };
    saveSkill(item);
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Skills &amp; Technical Stack
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure technical proficiencies, skill meters, categories, and portfolio highlights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Display Mode Switcher */}
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setDisplayMode('gauge')}
              className={cn(
                'rounded-lg px-3 py-1 text-xs font-semibold transition-colors',
                displayMode === 'gauge'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Circular
            </button>
            <button
              onClick={() => setDisplayMode('bar')}
              className={cn(
                'rounded-lg px-3 py-1 text-xs font-semibold transition-colors',
                displayMode === 'bar'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              Bars
            </button>
          </div>

          <Button
            onClick={handleOpenAdd}
            className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> Add Skill
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={cn(
              'rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors',
              selectedCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground',
            )}
          >
            All Stack ({skills.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = skills.filter((s) => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap',
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground',
                )}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skill..."
            className="h-9 rounded-xl border-white/10 bg-white/[0.03] pl-9 text-xs"
          />
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center text-sm text-muted-foreground">
          No skills found matching your query.
        </div>
      ) : displayMode === 'gauge' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filteredSkills.map((skill) => {
            const r = 36;
            const c = 2 * Math.PI * r;
            const offset = c - (c * skill.level) / 100;

            return (
              <div
                key={skill.id}
                className="group relative flex flex-col items-center rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              >
                {skill.featured && (
                  <span className="absolute left-2.5 top-2.5 text-amber-400" title="Featured Skill">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                  </span>
                )}

                {/* Quick actions top right */}
                <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    title="Edit"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setSkillToDelete(skill.id)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                    title="Delete"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                {/* SVG Gauge */}
                <div className="relative mt-2 h-20 w-20">
                  <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r={r}
                      fill="none"
                      stroke="rgba(255,255,255,0.08)"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={r}
                      fill="none"
                      stroke="var(--neon)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={c}
                      strokeDashoffset={offset}
                      style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-display text-sm font-bold text-foreground">
                    {skill.level}%
                  </div>
                </div>

                <h3 className="mt-3 text-center text-xs font-bold text-foreground truncate max-w-full">
                  {skill.name}
                </h3>
                <span className="mt-1 font-mono text-[0.65rem] text-muted-foreground">
                  {skill.category}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        /* Progress Bar View */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl space-y-3 transition-all hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{skill.name}</span>
                  {skill.featured && (
                    <span className="rounded bg-amber-400/15 px-1.5 py-0.2 text-[0.6rem] font-bold text-amber-400">
                      Featured
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">{skill.level}%</span>
                  <button
                    onClick={() => handleOpenEdit(skill)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => setSkillToDelete(skill.id)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400 transition-all duration-500"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <p className="font-mono text-[0.65rem] text-muted-foreground">{skill.category}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md border-white/10 bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs">Skill Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g. React, Node.js, Python"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="level" className="text-xs">Proficiency Level</Label>
                <span className="font-mono text-xs font-bold text-primary">{watchedLevel}%</span>
              </div>
              <input
                id="level"
                type="range"
                min="10"
                max="100"
                step="1"
                {...register('level', { valueAsNumber: true })}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs">Category</Label>
              <select
                id="category"
                {...register('category')}
                className="w-full rounded-xl border border-white/10 bg-card p-2.5 text-xs text-foreground outline-none focus:border-primary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-card text-foreground">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sortOrder" className="text-xs">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  {...register('sortOrder', { valueAsNumber: true })}
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="flex flex-col justify-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('featured')}
                    className="h-4 w-4 rounded border-white/20 text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-semibold text-foreground">Feature on Hero/Skills</span>
                </label>
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
                {editingSkill ? 'Save Changes' : 'Add Skill'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(skillToDelete)}
        onOpenChange={(open) => !open && setSkillToDelete(null)}
        title="Delete Skill?"
        description="Are you sure you want to remove this skill from your tech stack?"
        onConfirm={() => {
          if (skillToDelete) {
            deleteSkill(skillToDelete);
            setSkillToDelete(null);
          }
        }}
      />
    </div>
  );
}
