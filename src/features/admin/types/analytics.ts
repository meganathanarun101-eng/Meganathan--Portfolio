export type AnalyticsTimeframe = '7d' | '30d' | '90d' | '1y';

export interface TrafficDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
  uniqueVisitors: number;
  returningVisitors: number;
}

export interface ReferrerSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface DeviceBreakdown {
  device: 'Desktop' | 'Mobile' | 'Tablet';
  percentage: number;
  count: number;
}

export interface ProjectAnalyticsItem {
  id: string;
  title: string;
  views: number;
  clicks: number;
  demoClicks: number;
  githubClicks: number;
  conversionRate: number;
}

export interface ContactAnalytics {
  totalMessages: number;
  unreadMessages: number;
  repliedMessages: number;
  archivedMessages: number;
  responseRate: number;
  avgResponseTimeHours: number;
}

export interface DashboardStats {
  totalProjects: number;
  projectsDelta: number;
  publishedProjects: number;
  publishedDelta: number;
  certificates: number;
  certificatesDelta: number;
  blogPosts: number;
  blogPostsDelta: number;
  messages: number;
  messagesDelta: number;
  visitors: number;
  visitorsDelta: number;
}
