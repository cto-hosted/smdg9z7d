'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles, 
  BarChart3, 
  Zap, 
  TrendingUp,
  MapPin,
  Settings,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTrends } from '@/lib/trend-store';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: 'Feed', icon: LayoutDashboard },
  { href: '/creator', label: 'Creator', icon: Sparkles },
  { href: '/business', label: 'Business', icon: BarChart3 },
  { href: '/trends', label: 'All Trends', icon: TrendingUp },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { userMode, setUserMode, selectedLocation } = useTrends();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-5 border-b border-white/10">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 shadow-lg shadow-orange-500/20">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">
          LocalTrend
        </span>
      </div>

      {/* Location Indicator */}
      {selectedLocation && (
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <MapPin className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium text-orange-400">{selectedLocation.city}</span>
          </div>
        </div>
      )}

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
                  ? 'bg-gradient-to-r from-orange-500/20 to-rose-500/20 text-orange-400 shadow-sm border border-orange-500/20'
                  : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive && 'text-orange-400')} />
              {label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-orange-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Mode Switcher */}
      <div className="px-4 py-3 border-t border-white/10">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5">
          <button
            onClick={() => setUserMode('creator')}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              userMode === 'creator'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Creator
          </button>
          <button
            onClick={() => setUserMode('business')}
            className={cn(
              'flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all',
              userMode === 'business'
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            Business
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 p-4 space-y-2">
        <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors">
          <HelpCircle className="h-4 w-4" />
          Help
        </button>
      </div>
    </div>
  );
}
