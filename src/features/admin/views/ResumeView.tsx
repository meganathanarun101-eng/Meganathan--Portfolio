import React, { useRef, useState } from 'react';
import {
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  FileUp,
  Loader2,
  Plus,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
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
import { ResumeVersion } from '../types/portfolio';

export function ResumeView() {
  const { resume, saveResume, setActiveResume, deleteResume } = useAdminData();
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newVersion, setNewVersion] = useState('v1.3');
  const [newSummary, setNewSummary] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeResume = resume.find((r) => r.isActive) ?? resume[0];

  const handleUploadNewVersion = () => {
    if (!newVersion.trim()) {
      toast.error('Version label is required');
      return;
    }

    setUploading(true);
    setTimeout(() => {
      const entry: ResumeVersion = {
        id: `res-${Date.now()}`,
        version: newVersion,
        fileName: `Meganathan_R_FullStack_${newVersion}.pdf`,
        fileSize: `${Math.floor(220 + Math.random() * 40)} KB`,
        uploadDate: new Date().toISOString().split('T')[0] ?? '2026-09-10',
        downloadUrl: '/resume.pdf',
        isActive: true,
        summary: newSummary || 'Updated portfolio accomplishments and experience details.',
      };

      saveResume(entry);
      setUploading(false);
      setModalOpen(false);
      setNewSummary('');
      toast.success(`Resume ${newVersion} uploaded and marked as active`);
    }, 600);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Resume &amp; CV Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your official downloadable curriculum vitae, active versions, and archival releases.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <FileUp className="h-4 w-4" /> Upload New Version
        </Button>
      </div>

      {/* Active Resume Hero Document Card */}
      {activeResume && (
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card/80 via-card/50 to-primary/10 p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20 border border-primary/30 text-primary shadow-lg shadow-primary/20">
                <FileText className="h-8 w-8" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Active Public Resume
                  </span>
                  <span className="rounded-full bg-primary/20 px-2.5 py-0.5 font-mono text-xs font-bold text-primary">
                    {activeResume.version}
                  </span>
                </div>

                <h2 className="font-display text-xl font-bold text-foreground">
                  {activeResume.fileName}
                </h2>

                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span>File Size: {activeResume.fileSize}</span>
                  <span>·</span>
                  <span>Uploaded on: {activeResume.uploadDate}</span>
                </p>

                <p className="mt-2 text-xs leading-relaxed text-foreground/80 max-w-xl">
                  {activeResume.summary}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={activeResume.downloadUrl}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 shadow-lg shadow-primary/20"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
              <Button
                variant="outline"
                onClick={() => setModalOpen(true)}
                className="gap-2 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs"
              >
                <RefreshCw className="h-4 w-4 text-cyan-400" /> Replace File
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Version Archive History */}
      <div className="space-y-4 rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">Resume Version History</h3>
            <p className="text-xs text-muted-foreground">Historical revisions and changelog notes</p>
          </div>
          <span className="font-mono text-xs text-muted-foreground">{resume.length} revisions stored</span>
        </div>

        <div className="divide-y divide-white/5">
          {resume.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <FileText className={`mt-0.5 h-5 w-5 ${item.isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">{item.fileName}</span>
                    <span className="font-mono text-[0.65rem] text-primary font-bold">{item.version}</span>
                    {item.isActive && (
                      <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[0.6rem] font-bold text-emerald-400">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.summary}</p>
                  <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground/70">
                    {item.fileSize} · {item.uploadDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {!item.isActive && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveResume(item.id)}
                    className="h-8 rounded-xl border-white/10 text-xs hover:border-primary"
                  >
                    Set Active
                  </Button>
                )}
                <a
                  href={item.downloadUrl}
                  download
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  title="Download"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                </a>
                {!item.isActive && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setItemToDelete(item.id)}
                    className="h-8 w-8 p-0 text-rose-400 hover:bg-rose-500/10"
                    title="Delete Version"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload New Version Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md border-white/10 bg-card/95 backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              Upload New Resume Revision
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="version" className="text-xs">Version Label</Label>
              <Input
                id="version"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                placeholder="e.g. v1.3"
                className="rounded-xl border-white/10 bg-white/[0.03]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary" className="text-xs">Changelog / Summary Notes</Label>
              <Textarea
                id="summary"
                rows={3}
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                placeholder="Added latest project builds, new certification, updated CGPA..."
                className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
              />
            </div>

            {/* Simulated file selector zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-6 text-center hover:border-primary/50"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    toast.success(`Selected file: ${file.name}`);
                  }
                }}
              />
              <FileUp className="h-8 w-8 text-primary" />
              <p className="mt-2 text-xs font-semibold text-foreground">Select PDF document</p>
              <p className="text-[0.65rem] text-muted-foreground">PDF files up to 10MB</p>
            </div>

            <DialogFooter className="pt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                onClick={() => setModalOpen(false)}
                className="border-white/10"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadNewVersion}
                disabled={uploading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {uploading ? 'Uploading...' : 'Save & Publish'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={Boolean(itemToDelete)}
        onOpenChange={(open) => !open && setItemToDelete(null)}
        title="Delete Resume Version?"
        description="Are you sure you want to delete this historical resume record from your archive?"
        onConfirm={() => {
          if (itemToDelete) {
            deleteResume(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />
    </div>
  );
}
