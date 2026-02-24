'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { MobileNav } from './mobile-nav';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTrends } from '@/lib/trend-store';
import { LocationSearch } from '@/components/location/location-search';
import { MapPin, Bell } from 'lucide-react';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Local Feed', description: 'Discover trending topics in your city' },
  '/creator': { title: 'Creator Studio', description: 'AI-powered content generation' },
  '/business': { title: 'Business Insights', description: 'Analytics and trend analysis' },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: 'LocalTrend AI', description: '' };
  const { selectedLocation, userMode } = useTrends();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 backdrop-blur-md px-4 md:px-6">
      <MobileNav />

      <div className="flex-1 flex items-center gap-4">
        <div className="hidden md:block flex-1 max-w-xs">
          <LocationSearch />
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {selectedLocation && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
              <MapPin className="h-3 w-3 text-rose-400" />
              <span className="text-xs font-medium text-rose-400">
                {selectedLocation.name}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full" />
        </button>
        
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
          <span className="text-xs font-medium text-orange-400 capitalize">
            {userMode}
          </span>
        </div>
        
        <ThemeToggle />
        <Avatar className="h-8 w-8 border border-rose-500/30">
          <AvatarFallback className="bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 text-white text-xs font-bold">
            LT
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
