import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Check,
  Database,
  Download,
  KeyRound,
  Laptop,
  Lock,
  LogOut,
  Palette,
  QrCode,
  RefreshCw,
  Save,
  Search,
  Send,
  Share2,
  Shield,
  Sliders,
  Smartphone,
  Sparkles,
  Upload,
  User,
  Wifi,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { MobileSyncModal } from '../components/layout/MobileSyncModal';
import { useAdminData } from '../context/AdminDataContext';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { portfolioDataService } from '../services/portfolioDataService';
import { autoCreateJsonBinFn } from '../services/serverPortfolioService';
import { SiteSettings } from '../types/portfolio';
import { cn } from '@/lib/utils';

export function SettingsView() {
  const {
    settings,
    updateSettings,
    exportJSON,
    importJSON,
    resetToDefaults,
    syncStatus,
    lastSyncTime,
    forcePushToServer,
    forcePullFromServer,
  } = useAdminData();
  const { logout, getCredentials, updateCredentials, resetCredentials } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'appearance' | 'social' | 'seo' | 'security' | 'backup'>('general');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [mobileSyncModalOpen, setMobileSyncModalOpen] = useState(false);
  const [syncingServer, setSyncingServer] = useState(false);
  const [credentials, setCredentials] = useState(() => getCredentials());
  const [adminUsername, setAdminUsername] = useState(() => credentials.username);
  const [adminEmail, setAdminEmail] = useState(() => credentials.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [generalForm, setGeneralForm] = useState(settings.general);
  const [appearanceForm, setAppearanceForm] = useState(settings.appearance);
  const [socialForm, setSocialForm] = useState(settings.social);
  const [seoForm, setSeoForm] = useState(settings.seo);
  const [cloudSyncForm, setCloudSyncForm] = useState<SiteSettings['cloudSync']>(
    () =>
      settings.cloudSync || {
        provider: 'none',
        autoSync: true,
      },
  );
  const [testingCloud, setTestingCloud] = useState(false);
  const [creatingBin, setCreatingBin] = useState(false);

  const handleAutoCreateBin = async () => {
    if (!cloudSyncForm?.jsonbinApiKey?.trim()) {
      toast.error('Please enter your Master API Key first');
      return;
    }

    setCreatingBin(true);
    try {
      const res = await autoCreateJsonBinFn({
        data: {
          apiKey: cloudSyncForm.jsonbinApiKey.trim(),
          store: portfolioDataService.loadStore(),
        },
      });

      if (res && res.success && res.binId) {
        const updatedForm = {
          ...cloudSyncForm,
          jsonbinBinId: res.binId,
        };
        setCloudSyncForm(updatedForm);
        const updatedSettings: SiteSettings = {
          ...settings,
          cloudSync: updatedForm,
        };
        updateSettings(updatedSettings);
        toast.success(`Cloud Bin auto-created! ID: ${res.binId}`);
        await forcePushToServer();
      } else {
        toast.error(res?.error || 'Failed to create bin. Please check your Master Key.');
      }
    } catch (err) {
      console.error('Auto create bin error:', err);
      toast.error('Could not connect to JSONBin.io');
    } finally {
      setCreatingBin(false);
    }
  };

  const handleSaveAll = () => {
    const updated: SiteSettings = {
      general: generalForm,
      appearance: appearanceForm,
      social: socialForm,
      seo: seoForm,
      cloudSync: cloudSyncForm,
    };
    updateSettings(updated);
  };

  const handleExport = () => {
    const jsonStr = exportJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Portfolio data exported successfully');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importJSON(content);
      if (success) {
        toast.success('Configuration and data imported successfully');
      }
    };
    reader.readAsText(file);
  };

  const handleChangeCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password to authorize changes.');
      return;
    }
    if (!adminUsername.trim()) {
      toast.error('Username cannot be empty.');
      return;
    }
    if (!adminEmail.trim()) {
      toast.error('Email cannot be empty.');
      return;
    }
    if (newPassword && newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    const res = updateCredentials({
      username: adminUsername,
      email: adminEmail,
      currentPassword,
      newPassword: newPassword || undefined,
    });

    if (res.success) {
      toast.success('Admin credentials updated successfully! Only your new credentials can access this panel.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      const updated = getCredentials();
      setCredentials(updated);
      setAdminUsername(updated.username);
      setAdminEmail(updated.email);
    } else {
      toast.error(res.error || 'Failed to update credentials.');
    }
  };

  const handleResetCredentials = () => {
    resetCredentials();
    const defaultCreds = getCredentials();
    setCredentials(defaultCreds);
    setAdminUsername(defaultCreds.username);
    setAdminEmail(defaultCreds.email);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Credentials reset to defaults (meganathan / admin123).');
  };

  const activeSessions = authService.getActiveSessions();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            System &amp; Workspace Settings
          </h1>
          <p className="text-sm text-muted-foreground">
            Customize branding, theme accents, SEO meta descriptors, security sessions, and JSON backups.
          </p>
        </div>

        <Button
          onClick={handleSaveAll}
          className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Save className="h-4 w-4" /> Save Settings
        </Button>
      </div>

      {/* Tabs Container */}
      <div className="rounded-3xl border border-white/10 bg-card/60 backdrop-blur-xl overflow-hidden">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-white/10 p-2 bg-white/[0.02]">
          {[
            { id: 'general', label: 'General', icon: Sliders },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'social', label: 'Social Links', icon: Share2 },
            { id: 'seo', label: 'SEO & Meta', icon: Search },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'backup', label: 'Mobile Sync & Backup', icon: Database },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="p-6 md:p-8">
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-display text-base font-bold text-foreground">General Configuration</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Website Title</Label>
                  <Input
                    value={generalForm.websiteTitle}
                    onChange={(e) => setGeneralForm({ ...generalForm, websiteTitle: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Logo Brand Text</Label>
                  <Input
                    value={generalForm.logoText}
                    onChange={(e) => setGeneralForm({ ...generalForm, logoText: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Public Contact Email</Label>
                  <Input
                    value={generalForm.contactEmail}
                    onChange={(e) => setGeneralForm({ ...generalForm, contactEmail: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Meta Description</Label>
                  <Textarea
                    rows={3}
                    value={generalForm.websiteDescription}
                    onChange={(e) => setGeneralForm({ ...generalForm, websiteDescription: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-display text-base font-bold text-foreground">Look &amp; Feel</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Default Admin Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dark', label: 'Dark Mode (Oklch)', desc: 'High-contrast neon aurora' },
                      { id: 'light', label: 'Light Mode', desc: 'Crisp clean interface' },
                      { id: 'system', label: 'System Default', desc: 'Sync with OS preference' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() =>
                          setAppearanceForm({
                            ...appearanceForm,
                            theme: mode.id as any,
                          })
                        }
                        className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                          appearanceForm.theme === mode.id
                            ? 'border-primary bg-primary/10'
                            : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="text-xs font-bold text-foreground">{mode.label}</span>
                        <span className="text-[0.65rem] text-muted-foreground mt-1">{mode.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <Label className="text-xs">Accent Color Hue</Label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'violet', label: 'Neon Violet', color: '#8b5cf6' },
                      { id: 'indigo', label: 'Electric Indigo', color: '#6366f1' },
                      { id: 'cyan', label: 'Cyber Cyan', color: '#06b6d4' },
                      { id: 'emerald', label: 'Emerald Mint', color: '#10b981' },
                      { id: 'amber', label: 'Solar Amber', color: '#f59e0b' },
                    ].map((accent) => (
                      <button
                        key={accent.id}
                        type="button"
                        onClick={() =>
                          setAppearanceForm({
                            ...appearanceForm,
                            accentColor: accent.id as any,
                          })
                        }
                        className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all ${
                          appearanceForm.accentColor === accent.id
                            ? 'border-white bg-white/10 text-foreground ring-2 ring-primary/40'
                            : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:bg-white/[0.05]'
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: accent.color }}
                        />
                        {accent.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={appearanceForm.sidebarDefaultCollapsed}
                      onChange={(e) =>
                        setAppearanceForm({
                          ...appearanceForm,
                          sidebarDefaultCollapsed: e.target.checked,
                        })
                      }
                      className="h-4 w-4 rounded border-white/20 text-primary"
                    />
                    <span>Default sidebar to collapsed mode on desktop</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SOCIAL LINKS TAB */}
          {activeTab === 'social' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-display text-base font-bold text-foreground">Connected Social Handles</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">GitHub Profile</Label>
                  <Input
                    value={socialForm.github}
                    onChange={(e) => setSocialForm({ ...socialForm, github: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">LinkedIn Profile</Label>
                  <Input
                    value={socialForm.linkedin}
                    onChange={(e) => setSocialForm({ ...socialForm, linkedin: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Instagram Profile</Label>
                  <Input
                    value={socialForm.instagram}
                    onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Public Phone Number</Label>
                  <Input
                    value={socialForm.phone}
                    onChange={(e) => setSocialForm({ ...socialForm, phone: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div className="space-y-6 max-w-2xl">
              <h3 className="font-display text-base font-bold text-foreground">SEO &amp; OpenGraph Metadata</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Global Meta Title</Label>
                  <Input
                    value={seoForm.metaTitle}
                    onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Meta Keywords (Comma separated)</Label>
                  <Input
                    value={seoForm.keywords}
                    onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Global Meta Description</Label>
                  <Textarea
                    rows={3}
                    value={seoForm.metaDescription}
                    onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03] text-xs leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Social Share Image (OG Image)</Label>
                  <Input
                    value={seoForm.ogImage}
                    onChange={(e) => setSeoForm({ ...seoForm, ogImage: e.target.value })}
                    className="rounded-xl border-white/10 bg-white/[0.03]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="space-y-8 max-w-2xl">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">Admin Credentials</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Set your personal username, email, and password so only you can access the admin panel.
                    </p>
                  </div>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide border',
                      authService.isCustomCredentialsSet()
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                    )}
                  >
                    {authService.isCustomCredentialsSet() ? 'Personalized & Protected' : 'Default Demo Mode'}
                  </span>
                </div>

                {/* Active credentials preview card */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Active Username</p>
                    <p className="font-semibold text-foreground font-mono mt-0.5">{credentials.username}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Active Admin Email</p>
                    <p className="font-semibold text-foreground font-mono mt-0.5">{credentials.email}</p>
                  </div>
                </div>

                <form onSubmit={handleChangeCredentials} className="mt-4 space-y-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Admin Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          type="text"
                          value={adminUsername}
                          onChange={(e) => setAdminUsername(e.target.value)}
                          placeholder="e.g. meganathan"
                          className="rounded-xl border-white/10 bg-white/[0.03] pl-9 text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Admin Email</Label>
                      <Input
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminEmail(e.target.value)}
                        placeholder="e.g. meganathanarun101@gmail.com"
                        className="rounded-xl border-white/10 bg-white/[0.03] text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-white/10 pt-3">
                    <Label className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" /> Current Password (Required to authorize changes)
                    </Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter your current password (default is admin123)"
                      className="rounded-xl border-white/10 bg-white/[0.03] text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">New Password (leave empty to keep current)</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="rounded-xl border-white/10 bg-white/[0.03] text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Confirm New Password</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="rounded-xl border-white/10 bg-white/[0.03] text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-semibold">
                      Save &amp; Update Credentials
                    </Button>

                    {authService.isCustomCredentialsSet() && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResetCredentials}
                        className="text-xs text-muted-foreground hover:text-rose-400"
                      >
                        Reset to Default Credentials
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* Active Sessions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground">Active Sessions</h4>
                    <p className="text-xs text-muted-foreground">Devices currently authenticated to this console</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      window.location.href = '/admin/login';
                    }}
                    className="h-8 border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1" /> Terminate All
                  </Button>
                </div>

                <div className="space-y-2">
                  {activeSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <Laptop className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-semibold text-foreground">{sess.device}</p>
                          <p className="font-mono text-[0.65rem] text-muted-foreground">
                            {sess.ip} · {sess.location}
                          </p>
                        </div>
                      </div>
                      <span className="font-mono text-[0.65rem] text-muted-foreground">{sess.lastActive}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* BACKUP & RESTORE TAB */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Mobile Sync & Backup</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Synchronize your portfolio changes to mobile devices in real time, or download an offline snapshot.
                </p>
              </div>

              {/* LIVE SITE & MOBILE REAL-TIME SYNC */}
              <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                        <span>Live Site & Mobile Real-Time Sync</span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {syncStatus === 'syncing' ? 'Syncing...' : 'Connected'}
                        </span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lastSyncTime ? `Last active sync at ${lastSyncTime}` : 'All admin edits automatically sync to live website and mobile phones'}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMobileSyncModalOpen(true)}
                    className="gap-1.5 border-primary/30 text-primary text-xs hover:bg-primary/10"
                  >
                    <QrCode className="h-3.5 w-3.5" /> Mobile QR Code
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button
                    size="sm"
                    disabled={syncingServer}
                    onClick={async () => {
                      setSyncingServer(true);
                      await forcePushToServer();
                      setSyncingServer(false);
                    }}
                    className="gap-2 rounded-xl bg-primary text-primary-foreground text-xs"
                  >
                    {syncingServer ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    <span>Push Changes to Live Site & Mobile Now</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={syncingServer}
                    onClick={async () => {
                      setSyncingServer(true);
                      await forcePullFromServer();
                      setSyncingServer(false);
                    }}
                    className="gap-1.5 rounded-xl border-white/10 text-xs hover:bg-white/10"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${syncingServer ? 'animate-spin' : ''}`} />
                    <span>Pull from Server</span>
                  </Button>
                </div>
              </div>

              {/* VERCEL CLOUD DATABASE SYNC SETUP */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-400">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-bold text-foreground">
                      Vercel Persistent Cloud Sync
                    </h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Keep your live Vercel domain and mobile website updated 24/7 with a persistent cloud database
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Select Cloud Provider</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        { id: 'none', label: 'Local Only', desc: 'Ephemeral' },
                        { id: 'vercel-kv', label: 'Vercel KV', desc: 'Upstash (Fast)' },
                        { id: 'jsonbin', label: 'JSONBin.io', desc: 'Free & Easy' },
                        { id: 'supabase', label: 'Supabase', desc: 'Postgres REST' },
                      ].map((prov) => (
                        <button
                          key={prov.id}
                          type="button"
                          onClick={() =>
                            setCloudSyncForm((prev) => ({
                              ...(prev || { autoSync: true }),
                              provider: prov.id as any,
                            }))
                          }
                          className={cn(
                            'flex flex-col items-start rounded-xl border p-2.5 text-left transition-all',
                            cloudSyncForm?.provider === prov.id
                              ? 'border-primary bg-primary/10 text-foreground'
                              : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20',
                          )}
                        >
                          <span className="text-xs font-bold text-foreground">{prov.label}</span>
                          <span className="text-[10px] text-muted-foreground">{prov.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vercel KV Inputs */}
                  {cloudSyncForm?.provider === 'vercel-kv' && (
                    <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 text-xs">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">KV_REST_API_URL</Label>
                        <Input
                          placeholder="https://...upstash.io"
                          value={cloudSyncForm.vercelKvUrl || ''}
                          onChange={(e) =>
                            setCloudSyncForm((prev) => ({ ...prev!, vercelKvUrl: e.target.value }))
                          }
                          className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">KV_REST_API_TOKEN</Label>
                        <Input
                          type="password"
                          placeholder="AV..."
                          value={cloudSyncForm.vercelKvToken || ''}
                          onChange={(e) =>
                            setCloudSyncForm((prev) => ({ ...prev!, vercelKvToken: e.target.value }))
                          }
                          className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-xs font-mono"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        💡 <strong>How to get:</strong> In your Vercel Dashboard, click <em>Storage &rarr; Create Database &rarr; KV</em>. Copy the REST API credentials here.
                      </p>
                    </div>
                  )}

                  {/* JSONBin Inputs */}
                  {cloudSyncForm?.provider === 'jsonbin' && (
                    <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 text-xs">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">JSONBin Bin ID</Label>
                        <Input
                          placeholder="e.g. 67ce..."
                          value={cloudSyncForm.jsonbinBinId || ''}
                          onChange={(e) =>
                            setCloudSyncForm((prev) => ({ ...prev!, jsonbinBinId: e.target.value }))
                          }
                          className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Master API Key</Label>
                        <Input
                          type="password"
                          placeholder="$2a$10$..."
                          value={cloudSyncForm.jsonbinApiKey || ''}
                          onChange={(e) =>
                            setCloudSyncForm((prev) => ({ ...prev!, jsonbinApiKey: e.target.value }))
                          }
                          className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-xs font-mono"
                        />
                      </div>
                      <div className="pt-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={creatingBin || !cloudSyncForm.jsonbinApiKey?.trim()}
                          onClick={handleAutoCreateBin}
                          className="w-full gap-1.5 border-primary/40 bg-primary/10 text-primary text-xs hover:bg-primary/20"
                        >
                          {creatingBin ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                          )}
                          <span>
                            {creatingBin ? 'Creating Cloud Bin...' : '✨ 1-Click Auto-Create Bin (Just enter Master Key)'}
                          </span>
                        </Button>
                      </div>

                      <p className="text-[10px] text-muted-foreground">
                        💡 <strong>Easy Setup:</strong> Go to <a href="https://jsonbin.io/app/api-keys" target="_blank" rel="noreferrer" className="text-primary underline">jsonbin.io/app/api-keys</a>, copy your <strong>Master Key</strong>, paste it above, and click <em>1-Click Auto-Create Bin</em>. You don't need to manually create or save any JSON!
                      </p>
                    </div>
                  )}

                  {/* Supabase Inputs */}
                  {cloudSyncForm?.provider === 'supabase' && (
                    <div className="space-y-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 text-xs">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Supabase Project URL</Label>
                        <Input
                          placeholder="https://xyz.supabase.co"
                          value={cloudSyncForm.supabaseUrl || ''}
                          onChange={(e) =>
                            setCloudSyncForm((prev) => ({ ...prev!, supabaseUrl: e.target.value }))
                          }
                          className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold">Anon Public Key</Label>
                        <Input
                          type="password"
                          placeholder="eyJhbG..."
                          value={cloudSyncForm.supabaseAnonKey || ''}
                          onChange={(e) =>
                            setCloudSyncForm((prev) => ({ ...prev!, supabaseAnonKey: e.target.value }))
                          }
                          className="h-8 rounded-lg border-white/10 bg-white/[0.03] text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      size="sm"
                      disabled={testingCloud}
                      onClick={async () => {
                        setTestingCloud(true);
                        const updated: SiteSettings = {
                          ...settings,
                          cloudSync: cloudSyncForm,
                        };
                        updateSettings(updated);
                        const ok = await forcePushToServer();
                        setTestingCloud(false);
                        if (ok) {
                          toast.success('Cloud Database connected & synced with live Vercel site!');
                        }
                      }}
                      className="gap-2 bg-gradient-to-r from-violet-600 to-primary text-white text-xs font-semibold"
                    >
                      {testingCloud ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                      <span>Save &amp; Connect Cloud Database</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                    <Download className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-foreground">Export JSON Backup</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Download a full JSON file containing all projects, skills, education, experience, and messages.
                  </p>
                  <Button
                    onClick={handleExport}
                    className="w-full gap-2 rounded-xl bg-primary text-primary-foreground text-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Portfolio JSON
                  </Button>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  <h4 className="font-display text-sm font-bold text-foreground">Restore From Backup</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Restore your portfolio from a previously saved JSON snapshot file.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={handleImportFile}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full gap-2 rounded-xl border-white/10 text-xs"
                  >
                    <Upload className="h-3.5 w-3.5" /> Select Backup File
                  </Button>
                </div>
              </div>

              {/* Reset Defaults */}
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5 space-y-2 mt-6">
                <h4 className="font-display text-sm font-bold text-rose-400">Reset Demo Data</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Clear all custom modifications and restore original seeded data (Student Job Finder, education, skills).
                </p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setResetConfirmOpen(true)}
                  className="rounded-xl mt-2 text-xs"
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Reset to Initial Defaults
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title="Reset Portfolio Data to Defaults?"
        description="This will overwrite your current edits with the original showcase seed data. Make sure you export a backup first if you want to keep your changes."
        confirmText="Reset Everything"
        onConfirm={() => {
          resetToDefaults();
          setResetConfirmOpen(false);
        }}
      />

      {/* Mobile & Live Site Fast Sync Modal */}
      <MobileSyncModal
        open={mobileSyncModalOpen}
        onOpenChange={setMobileSyncModalOpen}
      />
    </div>
  );
}
