import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Award,
  BadgeCheck,
  Calendar,
  ExternalLink,
  Pencil,
  Plus,
  Search,
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
import { CertificateItem } from '../types/portfolio';

const certSchema = z.object({
  name: z.string().min(2, 'Certificate name is required'),
  issuingOrganization: z.string().min(2, 'Organization is required'),
  issueDate: z.string().min(2, 'Issue date or year is required'),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url('Enter a valid URL').optional().or(z.literal('')),
  description: z.string().min(5, 'Description is required'),
  featured: z.boolean(),
  published: z.boolean(),
});

type CertFormValues = z.infer<typeof certSchema>;

export function CertificatesView() {
  const { certificates, saveCertificate, deleteCertificate } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CertificateItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertFormValues>({
    resolver: zodResolver(certSchema),
    defaultValues: {
      name: '',
      issuingOrganization: '',
      issueDate: '2025',
      credentialId: '',
      credentialUrl: '',
      description: '',
      featured: true,
      published: true,
    },
  });

  const filteredCerts = useMemo(() => {
    return certificates.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.issuingOrganization.toLowerCase().includes(q) ||
        (c.credentialId && c.credentialId.toLowerCase().includes(q))
      );
    });
  }, [certificates, searchQuery]);

  const handleOpenAdd = () => {
    setEditingItem(null);
    reset({
      name: '',
      issuingOrganization: '',
      issueDate: '2025',
      credentialId: '',
      credentialUrl: '',
      description: '',
      featured: true,
      published: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (item: CertificateItem) => {
    setEditingItem(item);
    reset({
      name: item.name,
      issuingOrganization: item.issuingOrganization,
      issueDate: item.issueDate,
      credentialId: item.credentialId ?? '',
      credentialUrl: item.credentialUrl ?? '',
      description: item.description,
      featured: item.featured,
      published: item.published,
    });
    setModalOpen(true);
  };

  const onSubmit = (data: CertFormValues) => {
    const saved: CertificateItem = {
      id: editingItem?.id ?? `cert-${Date.now()}`,
      name: data.name,
      issuingOrganization: data.issuingOrganization,
      issueDate: data.issueDate,
      credentialId: data.credentialId || undefined,
      credentialUrl: data.credentialUrl || undefined,
      description: data.description,
      featured: data.featured,
      published: data.published,
    };
    saveCertificate(saved);
    setModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Certificates &amp; Credentials
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your verified certifications, issuing bodies, credential IDs, and proof links.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Certificate
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search certificates or issuers..."
          className="h-10 rounded-xl border-white/10 bg-white/[0.03] pl-9 text-xs"
        />
      </div>

      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCerts.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                  <BadgeCheck className="h-6 w-6" />
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

              <h3 className="mt-4 font-display text-base font-bold text-foreground">
                {item.name}
              </h3>
              <p className="mt-1 text-xs font-semibold text-primary">
                {item.issuingOrganization}
              </p>

              <div className="mt-3 flex items-center gap-2 font-mono text-[0.65rem] text-muted-foreground">
                <Calendar className="h-3 w-3" /> Issued: {item.issueDate}
                {item.credentialId && (
                  <>
                    <span>·</span>
                    <span>ID: {item.credentialId}</span>
                  </>
                )}
              </div>

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
              {item.credentialUrl ? (
                <a
                  href={item.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-cyan-400 hover:underline"
                >
                  Verify <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-[0.65rem] text-muted-foreground">No verification link</span>
              )}

              <div className="flex items-center gap-1">
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
        <DialogContent className="max-w-lg border-white/10 bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              {editingItem ? 'Edit Certificate' : 'Add New Certificate'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs">Certificate Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g. Full Stack Web Development"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
              {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="issuingOrganization" className="text-xs">Issuer</Label>
                <Input
                  id="issuingOrganization"
                  {...register('issuingOrganization')}
                  placeholder="e.g. Meta / Coursera"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
                {errors.issuingOrganization && (
                  <p className="text-xs text-rose-400">{errors.issuingOrganization.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="issueDate" className="text-xs">Issue Date</Label>
                <Input
                  id="issueDate"
                  {...register('issueDate')}
                  placeholder="e.g. 2025"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="credentialId" className="text-xs">Credential ID</Label>
                <Input
                  id="credentialId"
                  {...register('credentialId')}
                  placeholder="e.g. META-FS-984210"
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="credentialUrl" className="text-xs">Verification URL</Label>
                <Input
                  id="credentialUrl"
                  {...register('credentialUrl')}
                  placeholder="https://coursera.org/verify/..."
                  className="rounded-xl border-white/10 bg-white/[0.03]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs">Description</Label>
              <Textarea
                id="description"
                rows={3}
                {...register('description')}
                placeholder="Key competencies covered in this certification..."
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="h-4 w-4 rounded border-white/20 text-primary"
                />
                <span>Featured Credential</span>
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
                {editingItem ? 'Save Changes' : 'Add Certificate'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Certificate?"
        description="Are you sure you want to remove this verified credential from your portfolio?"
        onConfirm={() => {
          if (itemToDelete) {
            deleteCertificate(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
