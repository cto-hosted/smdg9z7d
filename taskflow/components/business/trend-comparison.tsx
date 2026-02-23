'use client';

import { useTrends } from '@/lib/trend-store';
import { Card } from '@/components/ui/card';
import { 
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Minus
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getTrendLevelColor, getCategoryEmoji, getTrendLevelBgColor } from '@/lib/trend-algorithm';

export function TrendComparison() {
  const { trends, userMode } = useTrends();

  if (userMode !== 'business') return null;

  // Get top trends for comparison
  const comparisonTrends = [...trends]
    .sort((a, b) => b.score.normalized - a.score.normalized)
    .slice(0, 6);

  if (comparisonTrends.length < 2) return null;

  const maxScore = Math.max(...comparisonTrends.map(t => t.score.normalized));

  return (
    <Card className="bg-white/5 border-white/10 p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 className="h-4 w-4 text-orange-400" />
        <h4 className="text-sm font-medium">Trend Comparison</h4>
      </div>

      <div className="space-y-3">
        {comparisonTrends.map((trend, index) => {
          const width = (trend.score.normalized / maxScore) * 100;
          
          return (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span>{getCategoryEmoji(trend.category)}</span>
                  <span className="truncate">{trend.name.split(' in ')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('font-bold', getTrendLevelColor(trend.score.level))}>
                    {trend.score.normalized}
                  </span>
                  <span className="text-xs text-emerald-400">
                    +{trend.score.growthRate}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${width}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className={cn(
                    'h-full rounded-full',
                    trend.score.level === 'explosive' ? 'bg-gradient-to-r from-rose-500 to-orange-500' :
                    trend.score.level === 'viral' ? 'bg-gradient-to-r from-orange-500 to-amber-500' :
                    trend.score.level === 'rising' ? 'bg-gradient-to-r from-amber-500 to-yellow-500' :
                    'bg-white/30'
                  )}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Explosive</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span>Viral</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Rising</span>
        </div>
      </div>
    </Card>
  );
}
