'use client';

import { TrendFeed } from '@/components/trends/trend-feed';
import { LocationSearch } from '@/components/location/location-search';
import { useTrends } from '@/lib/trend-store';
import { motion } from 'framer-motion';
import { TrendingUp, Filter, Grid, List } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function TrendsPage() {
  const { selectedLocation } = useTrends();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-orange-400" />
            All Trends
          </h1>
          <p className="text-muted-foreground">
            Browse all trending topics in {selectedLocation?.city || 'your city'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LocationSearch />
          <div className="flex items-center border border-white/10 rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Filters Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Showing all trends for {selectedLocation?.city || 'your location'}</span>
      </div>

      {/* Trend Feed */}
      <TrendFeed />
    </div>
  );
}
