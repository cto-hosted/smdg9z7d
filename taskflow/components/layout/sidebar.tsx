'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wand2, BarChart3, TrendingUp, Zap, Settings, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrends } from '@/lib/trend-store';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Feed', icon: LayoutDashboard },
  { href: '/creator', label: 'Creator', icon: Wand2 },
  { href: '/business', label: 'Business', icon: BarChart3 },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { userMode, setUserMode } = useTrends();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 shadow-lg shadow-rose-500/20">
          <Flame className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
          LocalTrend
        </span>
        <span className="text-xs font-bold bg-gradient-to-r from-rose-500 to-orange-500 bg-clip-text text-transparent ml-0.5">
          AI
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavClick}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-rose-500/20 via-orange-500/20 to-amber-500/20 text-rose-400 shadow-sm border border-rose-500/20'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive && 'text-rose-400')} />
              {label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-rose-400" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4">
        <div className="mb-3">
          <p className="px-3 text-xs font-medium text-muted-foreground mb-2">Mode</p>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setUserMode('creator')}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
                userMode === 'creator'
                  ? 'bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              )}
            >
              <Wand2 className={cn('h-4 w-4', userMode === 'creator' ? 'text-rose-400' : 'text-muted-foreground')} />
              <span className={cn('text-[10px] font-medium', userMode === 'creator' ? 'text-rose-400' : 'text-muted-foreground')}>
                Creator
              </span>
            </button>
            <button
              onClick={() => setUserMode('business')}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-all',
                userMode === 'business'
                  ? 'bg-gradient-to-br from-rose-500/20 to-orange-500/20 border border-rose-500/30'
                  : 'bg-white/5 hover:bg-white/10 border border-transparent'
              )}
            >
              <BarChart3 className={cn('h-4 w-4', userMode === 'business' ? 'text-rose-400' : 'text-muted-foreground')} />
              <span className={cn('text-[10px] font-medium', userMode === 'business' ? 'text-rose-400' : 'text-muted-foreground')}>
                Business
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-xl bg-gradient-to-br from-rose-500/10 via-orange-500/10 to-amber-500/10 border border-rose-500/20 p-3">
          <p className="text-xs font-semibold text-rose-400 mb-1 flex items-center gap-1.5">
            <Zap className="h-3 w-3" />
            Pro Tip
          </p>
          <p className="text-xs text-muted-foreground">
            Switch between Creator and Business modes to get personalized insights.
          </p>
        </div>
      </div>
    </div>
  );
}
