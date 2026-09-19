export type ProjectCategory = 'Full Stack' | 'Frontend' | 'Backend' | 'AI' | 'Mobile';
export type ProjectStatus = 'published' | 'draft' | 'archived';

export interface ProjectItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  galleryImages: string[];
  demoUrl: string;
  githubUrl: string;
  tags: string[];
  category: ProjectCategory;
  featured: boolean;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
  views: number;
  clicks: number;
  githubClicks: number;
  createdAt: string;
  updatedAt: string;
}

export type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'Programming' | 'Tools' | 'Other';

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0 - 100
  category: SkillCategory;
  icon?: string;
  sortOrder: number;
  featured: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  grade: string;
  description: string;
  location: string;
  sortOrder: number;
}

export type EmploymentType = 'Full-time' | 'Part-time' | 'Internship' | 'Freelance' | 'Contract';

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  location: string;
  description: string[];
  technologies: string[];
  companyLogo?: string;
  published: boolean;
  sortOrder: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  iconName: string;
  features: string[];
  startingPrice?: string;
  featured: boolean;
  published: boolean;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
  certificateImage?: string;
  description: string;
  featured: boolean;
  published: boolean;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date: string;
  organization: string;
  link?: string;
  iconType: 'medal' | 'trophy' | 'award' | 'star';
  featured: boolean;
  published: boolean;
}

export interface ResumeVersion {
  id: string;
  version: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
  isActive: boolean;
  summary: string;
}

export type BlogPostStatus = 'published' | 'draft' | 'scheduled';

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  seoTitle: string;
  seoDescription: string;
  readTime: string;
  publishedDate: string;
  status: BlogPostStatus;
  views: number;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  profileImage?: string;
  quote: string;
  rating: number; // 1-5
  linkedinUrl?: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
}

export interface ProfileData {
  fullName: string;
  professionalTitle: string;
  shortBio: string;
  aboutMe: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  availabilityStatus: 'available' | 'busy' | 'open_to_offers';
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    twitter?: string;
  };
  metrics: {
    projectsCompleted: number;
    certificatesCount: number;
    hackathonsCount: number;
    githubContributions: number;
  };
}

export interface CloudSyncConfig {
  provider: 'none' | 'vercel-kv' | 'jsonbin' | 'supabase';
  vercelKvUrl?: string;
  vercelKvToken?: string;
  jsonbinBinId?: string;
  jsonbinApiKey?: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  autoSync: boolean;
}

export interface SiteSettings {
  general: {
    websiteName: string;
    websiteTitle: string;
    websiteDescription: string;
    logoText: string;
    faviconUrl: string;
    contactEmail: string;
  };
  appearance: {
    theme: 'dark' | 'light' | 'system';
    accentColor: 'indigo' | 'cyan' | 'violet' | 'emerald' | 'amber';
    sidebarDefaultCollapsed: boolean;
  };
  social: {
    github: string;
    linkedin: string;
    instagram: string;
    email: string;
    phone: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    ogImage: string;
  };
  cloudSync?: CloudSyncConfig;
}
