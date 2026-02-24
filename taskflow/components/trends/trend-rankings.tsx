'use client';

import { useTrends } from '@/lib/trend-store';
import { motion } from 'framer-motion';
import { Trophy, Flame, TrendingUp, ArrowUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTrendLevelColor, getCategoryEmoji } from '@/lib/trend-algorithm';
import Link from 'next/link';

export function TrendRankings() {
  const { topTrends } = useTrends();

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/40 text-amber-400';
    if (index === 1) return 'bg-gradient-to-r from-slate-400/20 to-slate-300/20 border-slate-400/40 text-slate-300';
    if (index === 2) return 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 border-orange-600/40 text-orange-500';
    return 'bg-white/5 border-white/10';
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-3.5 w-3.5" />;
    if (index === 1) return <Trophy className="h-3.5 w-3.5" />;
    if (index === 2) return <Trophy className="h-3.5 w-3.5" />;
    return <span className="text-xs font-mono">{index + 1}</span>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-500" />
        <h3 className="text-sm font-semibold">Top Trending</h3>
      </div>

      <div className="space-y-2">
        {topTrends.slice(0, 5).map((trend, index) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-2.5 rounded-xl border hover:border-orange-500/30 transition-colors group"
          >
            {/* Rank */}
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center border',
              getRankStyle(index)
            )}>
              {getRankIcon(index)}
            </div>

            {/* Trend Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getCategoryEmoji(trend.category)}</span>
                <p className="text-sm font-medium truncate group-hover:text-orange-400 transition-colors">
                  {trend.name}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={getTrendLevelColor(trend.score.level)}>
                  {trend.score.level.toUpperCase()}
                </span>
                <span>•</span>
                <span>+{trend.score.growthRate}% growth</span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className={cn('text-lg font-bold', getTrendLevelColor(trend.score.level))}>
                {trend.score.normalized}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {topTrends.length > 5 && (
        <Link
          href="/trends"
          className="flex items-center justify-center gap-1 text-xs text-orange-400 hover:text-orange-300 transition-colors"
        >
          View all trends <ArrowRight className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
