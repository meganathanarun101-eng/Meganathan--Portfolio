import React, { useState, useMemo } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Laptop,
  QrCode,
  RefreshCw,
  Send,
  Smartphone,
  Sparkles,
  Wifi,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAdminData } from '../../context/AdminDataContext';

interface MobileSyncModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSyncModal({ open, onOpenChange }: MobileSyncModalProps) {
  const {
    syncStatus,
    lastSyncTime,
    forcePushToServer,
    forcePullFromServer,
    generateMobileSyncUrl,
  } = useAdminData();

  const [pushing, setPushing] = useState(false);
  const [pulling, setPulling] = useState(false);
  const [copied, setCopied] = useState(false);

  const siteUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return window.location.origin;
  }, []);

  const syncUrl = useMemo(() => {
    if (!open) return '';
    return generateMobileSyncUrl();
  }, [open, generateMobileSyncUrl]);

  // Generate QR code URL via free standard QR image service
  const qrCodeUrl = useMemo(() => {
    const target = siteUrl || 'https://localhost:3000';
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(target)}&color=63-63-191&bgcolor=15-17-23`;
  }, [siteUrl]);

  const handlePush = async () => {
    setPushing(true);
    await forcePushToServer();
    setPushing(false);
  };

  const handlePull = async () => {
    setPulling(true);
    await forcePullFromServer();
    setPulling(false);
  };

  const handleCopyLink = () => {
    if (!siteUrl) return;
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    toast.success('Website link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-white/10 bg-[#0c0e14]/95 backdrop-blur-2xl text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                Mobile & Live Site Sync
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Instant synchronization between Admin Panel and mobile devices
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Status Indicator */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2.5 w-2.5">
                {syncStatus === 'syncing' ? (
                  <span className="h-full w-full rounded-full bg-amber-400 animate-pulse" />
                ) : syncStatus === 'error' ? (
                  <span className="h-full w-full rounded-full bg-rose-500" />
                ) : (
                  <>
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </>
                )}
              </span>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  {syncStatus === 'syncing'
                    ? 'Syncing with Server & Mobile...'
                    : syncStatus === 'error'
                      ? 'Server connection issue'
                      : 'Live & Mobile Auto-Sync Active'}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {lastSyncTime ? `Last synced at ${lastSyncTime}` : 'Background real-time sync enabled'}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={handlePull}
              disabled={pulling || pushing}
              className="h-8 gap-1.5 border-white/10 text-xs hover:bg-white/10"
            >
              <RefreshCw className={`h-3 w-3 ${pulling ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>

          {/* QR Code Section for Fast Phone Scan */}
          <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-black/40 p-5 text-center shadow-inner">
            <p className="text-xs font-medium text-foreground mb-3 flex items-center gap-1.5">
              <QrCode className="h-3.5 w-3.5 text-primary" />
              Scan with your Phone Camera to open
            </p>
            <div className="relative overflow-hidden rounded-xl border border-primary/30 p-2 shadow-[0_0_25px_rgba(99,102,241,0.2)] bg-[#0f1117]">
              <img
                src={qrCodeUrl}
                alt="Scan to open on mobile"
                width={160}
                height={160}
                className="rounded-lg"
              />
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Scan this code on your mobile to view live updates instantly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handlePush}
              disabled={pushing || pulling}
              className="w-full gap-2 bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg shadow-primary/25 hover:opacity-95"
            >
              {pushing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>Push All Changes to Live Site & Mobile</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleCopyLink}
                className="flex-1 gap-1.5 border-white/10 text-xs hover:bg-white/10"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied Link!' : 'Copy Website Link'}</span>
              </Button>

              <Button
                variant="outline"
                asChild
                className="gap-1.5 border-white/10 text-xs hover:bg-white/10"
              >
                <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Preview</span>
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-primary/10 border border-primary/20 p-2.5 text-[11px] text-muted-foreground flex items-start gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span>
              <strong>Tip:</strong> Any project, skill, profile, or photo edited in this Admin Panel automatically pushes to the server and updates all connected devices and phones within seconds.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
