import React, { useState } from 'react';
import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import {
  ChevronRight,
  Command,
  ExternalLink,
  Laptop,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Smartphone,
  Sun,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../../context/AuthContext';
import { useAdminData } from '../../context/AdminDataContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { CommandPalette } from './CommandPalette';
import { MobileSyncModal } from './MobileSyncModal';
import { cn } from '@/lib/utils';

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { user, logout } = useAuth();
  const { syncStatus } = useAdminData();
  const navigate = useNavigate();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [mobileSyncModalOpen, setMobileSyncModalOpen] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('dark');

  // Compute page title from path
  const getPageTitle = (path: string) => {
    const clean = path.replace('/admin', '').replace('/', '');
    if (!clean || clean === 'dashboard') return 'Dashboard';
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const pageTitle = getPageTitle(currentPath);

  const handleLogout = () => {
    logout();
    navigate({ to: '/admin/login' });
  };

  const handleThemeChange = (mode: 'dark' | 'light' | 'system') => {
    setThemeMode(mode);
    if (typeof document !== 'undefined') {
      if (mode === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-white/10 bg-background/80 px-4 md:px-8 backdrop-blur-xl">
        {/* Left: Mobile hamburger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link
              to="/admin/dashboard"
              className="transition-colors hover:text-foreground font-medium"
            >
              Admin
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="font-semibold text-foreground">{pageTitle}</span>
          </nav>
        </div>

        {/* Right: Search, Live Portfolio, Notifications, Theme, Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Search Trigger */}
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className="group flex h-10 items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-xs text-muted-foreground transition-all hover:border-primary/40 hover:bg-white/[0.06] hover:text-foreground"
          >
            <Search className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
            <span className="hidden sm:inline">Search anything...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground">
              <Command className="h-2.5 w-2.5" /> K
            </kbd>
          </button>

          {/* Mobile & Live Site Sync Button */}
          <button
            type="button"
            onClick={() => setMobileSyncModalOpen(true)}
            title="Sync changes to live site and mobile"
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition-all hover:bg-emerald-500/20 hover:border-emerald-500/50"
          >
            <span className="relative flex h-2 w-2">
              {syncStatus === 'syncing' ? (
                <span className="h-full w-full rounded-full bg-amber-400 animate-pulse" />
              ) : (
                <>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </>
              )}
            </span>
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile Sync</span>
          </button>

          {/* View Live Portfolio Link */}
          <Link
            to="/"
            target="_blank"
            className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-semibold text-muted-foreground transition-all hover:bg-white/[0.06] hover:text-foreground hover:border-white/20"
          >
            <ExternalLink className="h-3.5 w-3.5 text-primary" /> Live Site
          </Link>

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Theme Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Toggle theme mode"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {themeMode === 'light' ? (
                  <Sun className="h-4.5 w-4.5 text-amber-400" />
                ) : themeMode === 'dark' ? (
                  <Moon className="h-4.5 w-4.5 text-primary" />
                ) : (
                  <Laptop className="h-4.5 w-4.5 text-muted-foreground" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-2xl border-white/10 bg-card/95 backdrop-blur-2xl">
              <DropdownMenuItem onClick={() => handleThemeChange('dark')} className="cursor-pointer gap-2">
                <Moon className="h-4 w-4 text-primary" /> Dark Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('light')} className="cursor-pointer gap-2">
                <Sun className="h-4 w-4 text-amber-400" /> Light Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange('system')} className="cursor-pointer gap-2">
                <Laptop className="h-4 w-4" /> System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Open user profile menu"
                className="flex items-center gap-2 rounded-xl border border-white/10 p-1 transition-all hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <Avatar className="h-8 w-8 rounded-lg border border-white/10">
                  <AvatarImage src={user?.avatarUrl ?? '/assets/profile.jpg'} alt={user?.name ?? 'Admin'} />
                  <AvatarFallback className="rounded-lg bg-primary/20 text-xs font-bold text-primary">
                    {user?.name?.slice(0, 2).toUpperCase() ?? 'MR'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 rounded-2xl border-white/10 bg-card/95 p-1.5 backdrop-blur-2xl shadow-2xl"
            >
              <DropdownMenuLabel className="p-2">
                <p className="font-display text-xs font-bold text-foreground">{user?.name ?? 'Meganathan R'}</p>
                <p className="truncate font-mono text-[0.65rem] text-muted-foreground">{user?.email ?? 'admin@meganathan.dev'}</p>
                <span className="mt-1 inline-block rounded-md bg-primary/15 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-primary">
                  {user?.role ?? 'Superadmin'}
                </span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                onClick={() => navigate({ to: '/admin/profile' })}
                className="cursor-pointer gap-2 rounded-xl py-2 text-xs"
              >
                <User className="h-4 w-4 text-muted-foreground" /> Profile &amp; Bio
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate({ to: '/admin/settings' })}
                className="cursor-pointer gap-2 rounded-xl py-2 text-xs"
              >
                <Settings className="h-4 w-4 text-muted-foreground" /> Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2 rounded-xl py-2 text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-400"
              >
                <LogOut className="h-4 w-4" /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Command Palette Dialog */}
      <CommandPalette open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />

      {/* Mobile & Live Site Fast Sync Modal */}
      <MobileSyncModal open={mobileSyncModalOpen} onOpenChange={setMobileSyncModalOpen} />
    </>
  );
}
