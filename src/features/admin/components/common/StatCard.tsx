import React from 'react';
import { LucideIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number; // percentage, e.g. 12.5
  comparisonText?: string;
  badge?: string;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  comparisonText = 'vs last month',
  badge,
  iconColor,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-primary/5',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        <div
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-transform duration-300 group-hover:scale-110',
            iconColor,
          )}
        >
          <Icon className="h-5 w-5 text-foreground" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-display text-3xl font-extrabold tracking-tight text-foreground">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        {badge && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {badge}
          </span>
        )}
      </div>

      {change !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              'inline-flex items-center gap-0.5 font-semibold',
              isPositive ? 'text-emerald-400' : 'text-rose-400',
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {isPositive ? `+${change}%` : `${change}%`}
          </span>
          <span className="text-muted-foreground">{comparisonText}</span>
        </div>
      )}

      {/* Subtle bottom glow highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-16 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: 'var(--neon)' }}
      />
    </motion.div>
  );
}
