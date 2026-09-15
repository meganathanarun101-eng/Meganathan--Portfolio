import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-md bg-white/10" />
        <Skeleton className="h-10 w-10 rounded-xl bg-white/10" />
      </div>
      <Skeleton className="mt-4 h-9 w-20 rounded-lg bg-white/10" />
      <Skeleton className="mt-3 h-3 w-32 rounded-md bg-white/10" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-4 rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-64 rounded-xl bg-white/10" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24 rounded-xl bg-white/10" />
          <Skeleton className="h-10 w-28 rounded-xl bg-white/10" />
        </div>
      </div>
      <div className="space-y-3 pt-4">
        <Skeleton className="h-12 w-full rounded-xl bg-white/10" />
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonChart({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-5 w-40 rounded-md bg-white/10" />
          <Skeleton className="mt-2 h-3 w-56 rounded-md bg-white/10" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl bg-white/10" />
      </div>
      <div className="mt-8 flex h-64 items-end gap-3 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t-lg bg-white/10"
            style={{ height: `${Math.floor(25 + Math.random() * 65)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-card/60 p-8 backdrop-blur-xl">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 rounded-md bg-white/10" />
        <Skeleton className="h-4 w-72 rounded-md bg-white/10" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-md bg-white/10" />
          <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-md bg-white/10" />
          <Skeleton className="h-11 w-full rounded-xl bg-white/10" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 rounded-md bg-white/10" />
        <Skeleton className="h-32 w-full rounded-2xl bg-white/10" />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Skeleton className="h-10 w-24 rounded-xl bg-white/10" />
        <Skeleton className="h-10 w-32 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}
