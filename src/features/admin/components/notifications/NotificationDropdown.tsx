import React, { useState } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useAdminData } from '../../context/AdminDataContext';
import { cn } from '@/lib/utils';

export function NotificationDropdown() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useAdminData();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="View notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted-foreground transition-all hover:bg-white/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Bell className="h-4.5 w-4.5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground shadow-lg shadow-primary/40 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 rounded-2xl border-white/10 bg-card/95 p-0 backdrop-blur-2xl shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            <h4 className="font-display text-sm font-bold text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-primary">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 border-b border-white/5 px-4 py-2 bg-white/[0.02]">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              filter === 'all'
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
              filter === 'unread'
                ? 'bg-white/10 text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No {filter === 'unread' ? 'unread ' : ''}notifications
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) markNotificationRead(n.id);
                }}
                className={cn(
                  'flex items-start gap-3 p-4 transition-colors hover:bg-white/5 cursor-pointer',
                  !n.read ? 'bg-primary/[0.04]' : '',
                )}
              >
                <div
                  className={cn(
                    'mt-1 h-2 w-2 shrink-0 rounded-full',
                    !n.read ? 'bg-primary shadow-sm shadow-primary' : 'bg-transparent',
                  )}
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground">{n.title}</p>
                    <span className="inline-flex items-center gap-1 font-mono text-[0.65rem] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {n.timestamp}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{n.message}</p>
                  {n.link && (
                    <div className="pt-1">
                      <Link
                        to={n.link}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 text-[0.7rem] font-medium text-primary hover:underline"
                      >
                        View details <ExternalLink className="h-2.5 w-2.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
