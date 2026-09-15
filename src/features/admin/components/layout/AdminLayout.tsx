import React, { useState, ReactNode } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Toaster } from '@/components/ui/sonner';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-background text-foreground antialiased selection:bg-primary/30">
      {/* Ambient background glows */}
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 right-0 -z-10 h-96 w-96 rounded-full opacity-20 blur-[120px]"
        style={{ background: 'var(--violet)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-40 left-20 -z-10 h-96 w-96 rounded-full opacity-15 blur-[140px]"
        style={{ background: 'var(--neon)' }}
      />

      {/* Sidebar (Desktop + Mobile Sheet) */}
      <AdminSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      {/* Main Page Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <AdminHeader onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl space-y-8">{children}</div>
        </main>
      </div>

      <Toaster position="top-right" richColors />
    </div>
  );
}
