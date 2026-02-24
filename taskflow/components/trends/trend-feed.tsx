'use client';

import { useState } from 'react';
import { Trend, TrendCategory, TrendLevel } from '@/lib/types';
import { TrendCard } from './trend-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { categories, trendLevels } from '@/lib/mock-data';
import { useTrends } from '@/lib/trend-store';
import { cn } from '@/lib/utils';
import { Filter, SortAsc } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrendFeedProps {
  onTrendClick?: (trend: Trend) => void;
}

export function TrendFeed({ onTrendClick }: TrendFeedProps) {
  const { getFilteredTrends, filters, setFilters, isLoaded } = useTrends();
  const [showFilters, setShowFilters] = useState(false);
  
  const trends = getFilteredTrends();

  const sortOptions = [
    { value: 'score', label: 'Score' },
    { value: 'mentions', label: 'Mentions' },
    { value: 'growth', label: 'Growth Rate' },
    { value: 'recent', label: 'Recent' },
  ] as const;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'gap-2 border-white/10 hover:bg-white/5',
              showFilters && 'bg-rose-500/20 border-rose-500/50'
            )}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          
          <div className="flex gap-1 px-1">
            <button
              onClick={() => setFilters({ ...filters, category: 'all' })}
              className={cn(
                'px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap',
                filters.category === 'all'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-muted-foreground hover:bg-white/5'
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilters({ ...filters, category: cat.value })}
                className={cn(
                  'px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5',
                  filters.category === cat.value
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'text-muted-foreground hover:bg-white/5'
                )}
              >
                <span>{cat.icon}</span>
                <span className="hidden md:inline">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4 text-muted-foreground" />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as typeof filters.sortBy })}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-sm text-muted-foreground focus:outline-none focus:border-rose-500/50"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Trend Level</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, level: 'all' })}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded-lg transition-all',
                      filters.level === 'all'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    )}
                  >
                    All Levels
                  </button>
                  {trendLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setFilters({ ...filters, level: level.value })}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-lg transition-all',
                        filters.level === level.value
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoaded ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : trends.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No trends found matching your filters</p>
          <Button
            variant="link"
            onClick={() => setFilters({ search: '', category: 'all', level: 'all', sortBy: 'score' })}
            className="text-rose-400"
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trends.map((trend, i) => (
            <TrendCard
              key={trend.id}
              trend={trend}
              delay={i * 0.05}
              onClick={() => onTrendClick?.(trend)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
