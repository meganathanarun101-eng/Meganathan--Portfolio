import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock,
  ExternalLink,
  Github,
  Globe,
  Laptop,
  Mail,
  Smartphone,
  Tablet,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsTimeframe } from '../types/analytics';
import { cn } from '@/lib/utils';

export function AnalyticsView() {
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>('30d');
  const [chartType, setChartType] = useState<'area' | 'line' | 'bar'>('area');

  const trafficData = useMemo(() => {
    return analyticsService.getTrafficData(timeframe);
  }, [timeframe]);

  const referrers = useMemo(() => analyticsService.getReferrerSources(), []);
  const devices = useMemo(() => analyticsService.getDeviceBreakdown(), []);
  const projectStats = useMemo(() => analyticsService.getProjectAnalytics(), []);
  const contactStats = useMemo(() => analyticsService.getContactAnalytics(), []);

  // Summary aggregates
  const totalPageViews = useMemo(() => {
    return trafficData.reduce((acc, curr) => acc + curr.pageViews, 0);
  }, [trafficData]);

  const totalVisitors = useMemo(() => {
    return trafficData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [trafficData]);

  const totalUnique = useMemo(() => {
    return trafficData.reduce((acc, curr) => acc + curr.uniqueVisitors, 0);
  }, [trafficData]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Portfolio Analytics &amp; Telemetry
          </h1>
          <p className="text-sm text-muted-foreground">
            Detailed insights on traffic volume, visitor geography, project engagement, and enquiry conversions.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center rounded-2xl border border-white/10 bg-card/60 p-1 backdrop-blur-xl">
          {(['7d', '30d', '90d', '1y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                'rounded-xl px-3 py-1.5 font-mono text-xs font-bold uppercase transition-colors',
                timeframe === tf
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '90d' ? '3 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Summary Stat Mini-Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Pageviews</span>
          <p className="font-display text-2xl font-extrabold text-foreground">{totalPageViews.toLocaleString()}</p>
          <p className="flex items-center gap-1 text-[0.7rem] font-semibold text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" /> +28.4% vs previous period
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Total Sessions</span>
          <p className="font-display text-2xl font-extrabold text-cyan-400">{totalVisitors.toLocaleString()}</p>
          <p className="flex items-center gap-1 text-[0.7rem] font-semibold text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" /> +19.2% vs previous period
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Unique Visitors</span>
          <p className="font-display text-2xl font-extrabold text-primary">{totalUnique.toLocaleString()}</p>
          <p className="text-[0.7rem] text-muted-foreground">
            {Math.round((totalUnique / (totalVisitors || 1)) * 100)}% new visitor share
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur-xl space-y-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Enquiry Conversion</span>
          <p className="font-display text-2xl font-extrabold text-amber-400">{contactStats.responseRate}%</p>
          <p className="text-[0.7rem] text-muted-foreground">
            Avg reply time: ~{contactStats.avgResponseTimeHours} hours
          </p>
        </div>
      </div>

      {/* Main Interactive Visitor Chart */}
      <div className="rounded-3xl border border-white/10 bg-card/60 p-6 md:p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">
              Visitor Growth Over Time
            </h2>
            <p className="text-xs text-muted-foreground">
              Comparison of page impressions, total sessions, and unique discovery
            </p>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
            {(['area', 'line', 'bar'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-colors',
                  chartType === type
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'area' ? (
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="anPageViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--cyan)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--cyan)" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="anVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(18, 18, 28, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    backdropFilter: 'blur(16px)',
                  }}
                />
                <Area type="monotone" dataKey="pageViews" name="Page Views" stroke="var(--cyan)" strokeWidth={2} fill="url(#anPageViews)" />
                <Area type="monotone" dataKey="visitors" name="Sessions" stroke="var(--primary)" strokeWidth={2} fill="url(#anVisitors)" />
              </AreaChart>
            ) : chartType === 'line' ? (
              <LineChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(18, 18, 28, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    backdropFilter: 'blur(16px)',
                  }}
                />
                <Line type="monotone" dataKey="pageViews" name="Page Views" stroke="var(--cyan)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="visitors" name="Sessions" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="uniqueVisitors" name="Unique Visitors" stroke="var(--violet)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            ) : (
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(18, 18, 28, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px',
                    backdropFilter: 'blur(16px)',
                  }}
                />
                <Bar dataKey="visitors" name="Sessions" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pageViews" name="Page Views" fill="var(--cyan)" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Referrers & Device Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Referrer Sources */}
        <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-400" /> Top Referrer Channels
            </h3>
            <span className="font-mono text-xs text-muted-foreground">Traffic Share</span>
          </div>

          <div className="space-y-3">
            {referrers.map((ref) => (
              <div key={ref.source} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">{ref.source}</span>
                  <span className="font-mono font-bold text-muted-foreground">
                    {ref.visitors} visits ({ref.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${ref.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
              <Laptop className="h-4 w-4 text-primary" /> Device Breakdown
            </h3>
            <span className="font-mono text-xs text-muted-foreground">Platform distribution</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {devices.map((dev) => {
              const Icon = dev.device === 'Desktop' ? Laptop : dev.device === 'Mobile' ? Smartphone : Tablet;
              return (
                <div
                  key={dev.device}
                  className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <span className="mt-2 font-display text-xl font-bold text-foreground">
                    {dev.percentage}%
                  </span>
                  <span className="text-[0.65rem] text-muted-foreground uppercase tracking-wider">
                    {dev.device}
                  </span>
                  <span className="font-mono text-[0.6rem] text-muted-foreground/70">
                    {dev.count} sessions
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Engagement Analytics Table */}
      <div className="rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Project Engagement &amp; Conversion
            </h3>
            <p className="text-xs text-muted-foreground">
              Detailed tracking of clicks on Live Demos, GitHub repositories, and total views
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 font-mono text-[0.65rem] uppercase text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Impressions</th>
                <th className="py-3 px-4">Total Clicks</th>
                <th className="py-3 px-4">Demo Clicks</th>
                <th className="py-3 px-4">GitHub Clicks</th>
                <th className="py-3 px-4 text-right">CTR / Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projectStats.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-semibold text-foreground">{p.title}</td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">{p.views.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono font-bold text-foreground">{p.clicks.toLocaleString()}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{p.demoClicks}</td>
                  <td className="py-3 px-4 font-mono text-violet-400">{p.githubClicks}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    {p.conversionRate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
