import React, { useMemo } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Download,
  FolderGit2,
  Mail,
  PlusCircle,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '../components/common/StatCard';
import { useAdminData } from '../context/AdminDataContext';
import { useAuth } from '../context/AuthContext';
import { analyticsService } from '../services/analyticsService';

export function DashboardView() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projects, blogPosts, messages, certificates, exportJSON } = useAdminData();

  const stats = useMemo(() => analyticsService.getDashboardStats(), []);
  const chartData = useMemo(() => analyticsService.getTrafficData('7d'), []);

  const recentProjects = projects.slice(0, 4);
  const recentMessages = messages.slice(0, 3);

  const handleExportBackup = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-card/80 via-card/50 to-primary/10 p-6 md:p-8 backdrop-blur-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Welcome back, {user?.name ?? 'Meganathan'}
            </div>
            <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Portfolio Overview &amp; Health
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              All your portfolio metrics, content assets, and enquiries at a glance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              onClick={() => navigate({ to: '/admin/projects' })}
              className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <PlusCircle className="h-4 w-4" /> New Project
            </Button>
            <Button
              variant="outline"
              onClick={handleExportBackup}
              className="gap-2 rounded-xl border-white/10 bg-white/[0.03] hover:bg-white/[0.08]"
            >
              <Download className="h-4 w-4 text-primary" /> Export Data
            </Button>
          </div>
        </div>

        {/* Ambient background accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-25 blur-3xl"
          style={{ background: 'var(--violet)' }}
        />
      </div>

      {/* 6 Metric Statistics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Projects"
          value={projects.length}
          icon={FolderGit2}
          change={stats.projectsDelta}
          iconColor="text-cyan-400"
        />
        <StatCard
          title="Published"
          value={projects.filter((p) => p.status === 'published').length}
          icon={FolderGit2}
          change={stats.publishedDelta}
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Certificates"
          value={certificates.length}
          icon={BadgeCheck}
          change={stats.certificatesDelta}
          iconColor="text-primary"
        />
        <StatCard
          title="Blog Posts"
          value={blogPosts.length}
          icon={BookOpen}
          change={stats.blogPostsDelta}
          iconColor="text-amber-400"
        />
        <StatCard
          title="Messages"
          value={messages.length}
          icon={Mail}
          badge={messages.filter((m) => m.status === 'unread').length > 0 ? `${messages.filter((m) => m.status === 'unread').length} new` : undefined}
          change={stats.messagesDelta}
          iconColor="text-rose-400"
        />
        <StatCard
          title="Visitors (30D)"
          value={stats.visitors}
          icon={Users}
          change={stats.visitorsDelta}
          iconColor="text-violet-400"
        />
      </div>

      {/* Analytics Chart Preview & Quick Inbox */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Visitor Trend Chart (2 Cols) */}
        <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">
                Visitor Traffic (Last 7 Days)
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time pageviews and unique sessions
              </p>
            </div>
            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Full Analytics <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="pageviewGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(18, 18, 28, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    backdropFilter: 'blur(16px)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  name="Page Views"
                  stroke="var(--cyan)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#pageviewGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Visitors"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#visitorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Recent Messages (1 Col) */}
        <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">Recent Enquiries</h2>
              <p className="text-xs text-muted-foreground">Direct messages from portfolio</p>
            </div>
            <Link
              to="/admin/messages"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View Inbox
            </Link>
          </div>

          <div className="mt-4 divide-y divide-white/5">
            {recentMessages.length === 0 ? (
              <p className="py-8 text-center text-xs text-muted-foreground">No recent messages</p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="py-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground truncate max-w-[140px]">
                      {msg.senderName}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[0.6rem] font-bold uppercase ${
                        msg.status === 'unread'
                          ? 'bg-primary/20 text-primary'
                          : msg.status === 'replied'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/10 text-muted-foreground'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{msg.subject}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 pt-2">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/admin/messages' })}
              className="w-full rounded-xl border-white/10 text-xs"
            >
              Open Message Center
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Projects Table & Activity Stream */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects Preview (2 Cols) */}
        <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <h2 className="font-display text-base font-bold text-foreground">Featured Builds</h2>
              <p className="text-xs text-muted-foreground">Top projects currently in showcase</p>
            </div>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              Manage All ({projects.length}) <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-white/5">
            {recentProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-10 w-14 rounded-lg object-cover border border-white/10"
                  />
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">{p.title}</h3>
                    <p className="font-mono text-[0.65rem] text-muted-foreground">{p.category} · {p.views} views</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                      p.status === 'published'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-amber-500/15 text-amber-400'
                    }`}
                  >
                    {p.status}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate({ to: '/admin/projects' })}
                    className="h-8 rounded-lg text-xs"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick System & Portfolio Info (1 Col) */}
        <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-foreground">System Status</h2>
            <p className="text-xs text-muted-foreground">Portfolio engine &amp; hosting health</p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <span className="text-muted-foreground">Public Website</span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Operational
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <span className="text-muted-foreground">Vite SSR Engine</span>
                <span className="font-mono text-foreground font-semibold">Active (Cloudflare)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <span className="text-muted-foreground">Data Storage</span>
                <span className="font-mono text-foreground font-semibold">LocalStorage (Synced)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs">
                <span className="text-muted-foreground">SSL Certificate</span>
                <span className="font-mono text-emerald-400 font-semibold">Valid (HTTPS)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10">
            <Link
              to="/admin/settings"
              className="flex items-center justify-between text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span>Security &amp; Backup Settings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
