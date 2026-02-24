'use client';

import { useState } from 'react';
import { Trend } from '@/lib/types';
import { useTrends } from '@/lib/trend-store';
import { TrendFeed } from '@/components/trends/trend-feed';
import { LocationSearch } from '@/components/location/location-search';
import { TrendScore } from '@/components/trends/trend-score';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, TrendingUp, MapPin, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { getTrendStats, selectedLocation, getFilteredTrends, isLoaded, userMode, setUserMode } = useTrends();
  const router = useRouter();
  const stats = getTrendStats();
  const topTrends = getFilteredTrends().slice(0, 3);

  const statsData = [
    {
      title: 'Active Trends',
      value: stats.totalTrends,
      description: `trending in ${selectedLocation?.name || 'your area'}`,
      icon: Flame,
      gradient: 'from-rose-500 via-orange-500 to-amber-500',
    },
    {
      title: 'Viral & Explosive',
      value: stats.viralTrends,
      description: 'trends with high growth',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-rose-500',
    },
    {
      title: 'Rising Stars',
      value: stats.risingTrends,
      description: 'trends gaining momentum',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Avg Score',
      value: stats.avgScore,
      description: 'trend score across all',
      icon: Sparkles,
      gradient: 'from-violet-500 to-rose-500',
    },
  ];

  const handleTrendClick = (trend: Trend) => {
    router.push(`/trend/${trend.id}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Trending Now</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Discover what's hot in {selectedLocation?.name || 'your city'}
          </p>
        </div>
        <div className="w-full md:w-72">
          <LocationSearch />
        </div>
      </div>

      {!isLoaded ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {statsData.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 hover:border-rose-500/30 transition-all group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">{s.title}</p>
                      <p className="text-3xl font-bold mt-1 bg-gradient-to-r bg-clip-text text-transparent {s.gradient}">
                        {s.value}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {s.description}
                      </p>
                    </div>
                    <div className={cn('p-2 rounded-lg bg-gradient-to-br', s.gradient)}>
                      <s.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {topTrends.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-rose-400" />
              <h3 className="text-sm font-semibold">Top 3 Trends</h3>
            </div>
            <Button
              variant="link"
              className="text-xs text-rose-400"
              onClick={() => router.push('/trending')}
            >
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            {topTrends.map((trend, i) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => handleTrendClick(trend)}
              >
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-rose-500/30">
                  <div className={cn(
                    'flex-shrink-0 text-2xl font-bold bg-gradient-to-br bg-clip-text text-transparent',
                    i === 0 ? 'from-rose-500 to-orange-500' :
                    i === 1 ? 'from-orange-500 to-amber-500' :
                    'from-amber-500 to-yellow-500'
                  )}>
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate group-hover:text-rose-400 transition-colors">
                      {trend.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {trend.category} • {trend.level}
                    </p>
                  </div>
                  <TrendScore score={trend.score} level={trend.level} size="sm" showLabel={false} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">All Trends</h3>
        <div className="flex items-center gap-2">
          <Button
            variant={userMode === 'creator' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUserMode('creator')}
            className={userMode === 'creator' ? 'bg-rose-500 hover:bg-rose-600' : 'border-white/10'}
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Creator
          </Button>
          <Button
            variant={userMode === 'business' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setUserMode('business')}
            className={userMode === 'business' ? 'bg-orange-500 hover:bg-orange-600' : 'border-white/10'}
          >
            <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
            Business
          </Button>
        </div>
      </div>

      <TrendFeed onTrendClick={handleTrendClick} />
    </div>
  );
}
