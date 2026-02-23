'use client';

import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { MobileNav } from './mobile-nav';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTasks } from '@/lib/task-store';

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Welcome back! Here\'s what\'s happening.' },
  '/tasks': { title: 'Tasks', description: 'Manage and track all your tasks.' },
  '/analytics': { title: 'Analytics', description: 'Insights and performance metrics.' },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] ?? { title: 'TaskFlow', description: '' };
  const { getStats } = useTasks();
  const stats = getStats();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 backdrop-blur-md px-4 md:px-6">
      <MobileNav />

      <div className="flex-1">
        <h1 className="text-base font-semibold md:text-lg">{page.title}</h1>
        <p className="hidden text-xs text-muted-foreground md:block">{page.description}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-3 py-1">
          <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-violet-400">
            {stats.completionRate}% done
          </span>
        </div>
        <ThemeToggle />
        <Avatar className="h-8 w-8 border border-violet-500/30">
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white text-xs font-bold">
            TF
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
