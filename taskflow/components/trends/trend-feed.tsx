'use client';

import { useTrends } from '@/lib/trend-store';
import { TrendCard } from './trend-card';
import { Skeleton } from '@/components/ui/skeleton';
import { categories } from '@/lib/mock-data';
import { TrendCategory } from '@/lib/types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TrendFeed() {
  const { filteredTrends, selectedCategory, setSelectedCategory, isLoaded, searchQuery } = useTrends();

  if (!isLoaded) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setSelectedCategory('all')}
          className={cn(
            'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25'
              : 'bg-white/5 border border-white/10 hover:bg-white/10'
          )}
        >
          All Trends
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value as TrendCategory)}
            className={cn(
              'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5',
              selectedCategory === cat.value
                ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            )}
          >
            <span>{cat.emoji}</span>
            <span className="hidden sm:inline">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTrends.length} {filteredTrends.length === 1 ? 'trend' : 'trends'}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>
      </div>

      {/* Trend List */}
      {filteredTrends.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-xl border border-white/10 p-8 text-center"
        >
          <p className="text-muted-foreground">No trends found for this category.</p>
        </motion.div>
      ) : (
        <div className="grid gap-4">
          {filteredTrends.map((trend, index) => (
            <TrendCard key={trend.id} trend={trend} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
