import {
  AnalyticsTimeframe,
  ContactAnalytics,
  DashboardStats,
  DeviceBreakdown,
  ProjectAnalyticsItem,
  ReferrerSource,
  TrafficDataPoint,
} from '../types/analytics';
import { portfolioDataService } from './portfolioDataService';

export const analyticsService = {
  getTrafficData(timeframe: AnalyticsTimeframe): TrafficDataPoint[] {
    const points: TrafficDataPoint[] = [];
    const count = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 12 : 12;
    const now = new Date();

    if (timeframe === '7d' || timeframe === '30d') {
      for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        // Base traffic with weekend variation
        const dayOfWeek = d.getDay();
        const weekendFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.75 : 1.15;
        const base = Math.floor((65 + Math.sin(i * 0.4) * 20 + Math.random() * 15) * weekendFactor);

        points.push({
          date: dayStr,
          visitors: base,
          pageViews: Math.floor(base * (2.8 + Math.random() * 0.6)),
          uniqueVisitors: Math.floor(base * 0.72),
          returningVisitors: Math.floor(base * 0.28),
        });
      }
    } else {
      // 90d or 1y represented weekly or monthly
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        const label = months[d.getMonth()] ?? 'Month';
        const base = Math.floor(950 + i * 45 + Math.random() * 120);

        points.push({
          date: label,
          visitors: base,
          pageViews: Math.floor(base * 3.2),
          uniqueVisitors: Math.floor(base * 0.76),
          returningVisitors: Math.floor(base * 0.24),
        });
      }
    }

    return points;
  },

  getReferrerSources(): ReferrerSource[] {
    return [
      { source: 'GitHub Repositories', visitors: 620, percentage: 38 },
      { source: 'LinkedIn Feed & Profile', visitors: 440, percentage: 27 },
      { source: 'Direct / URL Shares', visitors: 260, percentage: 16 },
      { source: 'Google Search', visitors: 195, percentage: 12 },
      { source: 'Twitter / X Tech', visitors: 115, percentage: 7 },
    ];
  },

  getDeviceBreakdown(): DeviceBreakdown[] {
    return [
      { device: 'Desktop', percentage: 68, count: 1108 },
      { device: 'Mobile', percentage: 28, count: 456 },
      { device: 'Tablet', percentage: 4, count: 65 },
    ];
  },

  getProjectAnalytics(): ProjectAnalyticsItem[] {
    const projects = portfolioDataService.getProjects();
    return projects.map((p) => {
      const views = p.views || 500;
      const clicks = p.clicks || 120;
      const conversionRate = Math.round((clicks / views) * 1000) / 10;
      return {
        id: p.id,
        title: p.title,
        views,
        clicks,
        demoClicks: Math.floor(clicks * 0.65),
        githubClicks: p.githubClicks || Math.floor(clicks * 0.35),
        conversionRate,
      };
    });
  },

  getContactAnalytics(): ContactAnalytics {
    const store = portfolioDataService.loadStore();
    const total = store.messages.length;
    const unread = store.messages.filter((m) => m.status === 'unread').length;
    const replied = store.messages.filter((m) => m.status === 'replied').length;
    const archived = store.messages.filter((m) => m.status === 'archived').length;

    return {
      totalMessages: total,
      unreadMessages: unread,
      repliedMessages: replied,
      archivedMessages: archived,
      responseRate: total > 0 ? Math.round((replied / total) * 100) : 0,
      avgResponseTimeHours: 4.2,
    };
  },

  getDashboardStats(): DashboardStats {
    const store = portfolioDataService.loadStore();
    const publishedProjects = store.projects.filter((p) => p.status === 'published').length;

    return {
      totalProjects: store.projects.length,
      projectsDelta: 12.5,
      publishedProjects: publishedProjects,
      publishedDelta: 8.3,
      certificates: store.certificates.length,
      certificatesDelta: 33.3,
      blogPosts: store.blogPosts.length,
      blogPostsDelta: 50.0,
      messages: store.messages.length,
      messagesDelta: 15.4,
      visitors: 1630,
      visitorsDelta: 24.8,
    };
  },
};
