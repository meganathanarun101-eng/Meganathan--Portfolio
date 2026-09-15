import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import {
  BadgeCheck,
  BarChart3,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  FileText,
  FolderGit2,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Settings,
  Shield,
  Trophy,
  User,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useAdminData } from '../../context/AdminDataContext';
import { cn } from '@/lib/utils';

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

export function AdminSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileOpenChange,
}: AdminSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { messages } = useAdminData();

  const unreadMessages = messages.filter((m) => m.status === 'unread').length;

  const NAV_ITEMS: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Profile', href: '/admin/profile', icon: User },
    { title: 'Education', href: '/admin/education', icon: GraduationCap },
    { title: 'Skills', href: '/admin/skills', icon: Code2 },
    { title: 'Experience', href: '/admin/experience', icon: Briefcase },
    { title: 'Services', href: '/admin/services', icon: Layers },
    { title: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { title: 'Certificates', href: '/admin/certificates', icon: BadgeCheck },
    { title: 'Achievements', href: '/admin/achievements', icon: Trophy },
    { title: 'Resume', href: '/admin/resume', icon: FileText },
    { title: 'Blog', href: '/admin/blog', icon: BookOpen },
    { title: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    {
      title: 'Messages',
      href: '/admin/messages',
      icon: Mail,
      badgeCount: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const renderNavLinks = (isMobile: boolean = false) => (
    <div className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
      <div className={cn('px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted-foreground', collapsed && !isMobile ? 'hidden' : 'block')}>
        Management
      </div>

      <TooltipProvider delayDuration={150}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            currentPath === item.href ||
            (item.href !== '/admin/dashboard' && currentPath.startsWith(item.href));

          const LinkContent = (
            <Link
              to={item.href}
              onClick={() => {
                if (isMobile) onMobileOpenChange(false);
              }}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-bold'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground',
                collapsed && !isMobile ? 'justify-center px-2' : '',
              )}
            >
              <item.icon
                className={cn(
                  'h-4.5 w-4.5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-primary-foreground' : 'text-foreground/70 group-hover:text-foreground',
                )}
              />

              {(!collapsed || isMobile) && (
                <span className="flex-1 truncate">{item.title}</span>
              )}

              {item.badgeCount !== undefined && (!collapsed || isMobile) && (
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 font-mono text-[0.65rem] font-bold',
                    isActive
                      ? 'bg-primary-foreground text-primary'
                      : 'bg-primary/20 text-primary',
                  )}
                >
                  {item.badgeCount}
                </span>
              )}

              {item.badgeCount !== undefined && collapsed && !isMobile && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              )}
            </Link>
          );

          if (collapsed && !isMobile) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={12} className="flex items-center gap-2">
                  <span>{item.title}</span>
                  {item.badgeCount !== undefined && (
                    <span className="rounded-full bg-primary-foreground/20 px-1.5 py-0.2 text-[0.65rem]">
                      {item.badgeCount}
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <React.Fragment key={item.href}>{LinkContent}</React.Fragment>;
        })}
      </TooltipProvider>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside
        className={cn(
          'hidden lg:flex h-screen flex-col border-r border-white/10 bg-card/75 backdrop-blur-2xl transition-all duration-300 z-30',
          collapsed ? 'w-[76px]' : 'w-[260px]',
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <Link
            to="/admin/dashboard"
            className={cn('flex items-center gap-3 transition-opacity overflow-hidden', collapsed ? 'justify-center' : '')}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-neon text-primary-foreground shadow-lg shadow-primary/25 font-display font-extrabold text-base">
              M
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-display text-sm font-bold tracking-tight text-foreground">
                  Meganathan R
                </span>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary flex items-center gap-1">
                  <Shield className="h-2.5 w-2.5" /> Admin Console
                </span>
              </div>
            )}
          </Link>

          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Links */}
        {renderNavLinks(false)}

        {/* Footer info & collapse toggle button when collapsed */}
        <div className="border-t border-white/10 p-3">
          {collapsed ? (
            <button
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              className="flex h-10 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[0.7rem] font-medium text-muted-foreground">Portfolio Live</span>
              </div>
              <Link
                to="/"
                target="_blank"
                className="font-mono text-[0.65rem] text-primary hover:underline"
              >
                View Site
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Sheet */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 border-r border-white/10 bg-card/95 p-0 backdrop-blur-2xl flex flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-neon text-primary-foreground shadow-lg font-display font-extrabold text-base">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm font-bold tracking-tight text-foreground">
                Meganathan R
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-primary flex items-center gap-1">
                <Shield className="h-2.5 w-2.5" /> Admin Console
              </span>
            </div>
          </div>
          {renderNavLinks(true)}
        </SheetContent>
      </Sheet>
    </>
  );
}
