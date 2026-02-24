'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useTrends } from '@/lib/trend-store';
import { Input } from '@/components/ui/input';
import { Bell, Search } from 'lucide-react';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Trend Feed', description: 'Discover what\'s trending in your city' },
  '/creator': { title: 'Creator Studio', description: 'AI-powered content generation' },
  '/business': { title: 'Business Insights', description: 'Analytics and trend analysis' },
  '/trends': { title: 'All Trends', description: 'Browse all trending topics' },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: 'LocalTrend', description: '' };
  const { userMode, setSearchQuery, searchQuery } = useTrends();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 backdrop-blur-md px-4 md:px-6">
      <div className="flex-1">
        <h1 className="text-base font-semibold md:text-lg">{page.title}</h1>
        <p className="hidden text-xs text-muted-foreground md:block">{page.description}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search trends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 h-9 pl-9 bg-white/5 border-white/10 focus:border-orange-500/50"
          />
        </div>

        {/* Mode Badge */}
        <div className="hidden md:flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
          <span className="text-xs font-medium text-orange-400 capitalize">
            {userMode} Mode
          </span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500" />
        </Button>

        <ThemeToggle />
        
        <Avatar className="h-8 w-8 border border-orange-500/30">
          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-rose-600 text-white text-xs font-bold">
            LT
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
