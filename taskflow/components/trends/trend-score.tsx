'use client';

import { Trend } from '@/lib/types';
import { getTrendLevelColor, getTrendLevelBgColor, formatTrendScore } from '@/lib/trend-algorithm';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrendScoreDisplayProps {
  trend: Trend;
  showBreakdown?: boolean;
}

export function TrendScoreDisplay({ trend, showBreakdown = false }: TrendScoreDisplayProps) {
  const score = trend.score.normalized;
  const level = trend.score.level;

  const getScoreColor = () => {
    if (score >= 80) return 'from-rose-500 to-orange-500';
    if (score >= 60) return 'from-orange-500 to-amber-500';
    if (score >= 30) return 'from-amber-500 to-yellow-500';
    return 'from-slate-500 to-slate-400';
  };

  return (
    <div className="space-y-4">
      {/* Main Score Circle */}
      <div className="flex justify-center">
        <div className="relative">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className={cn(
              'w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br shadow-2xl',
              getScoreColor()
            )}
          >
            <div className="w-24 h-24 rounded-full bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className={cn('text-4xl font-bold', getTrendLevelColor(level))}
              >
                {score}
              </motion.span>
              <span className="text-xs text-muted-foreground">points</span>
            </div>
          </motion.div>

          {/* Level Badge */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={cn(
              'absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold border',
              getTrendLevelBgColor(level),
              getTrendLevelColor(level)
            )}
          >
            {level.toUpperCase()}
          </motion.div>
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <div className="glass-card rounded-xl border border-white/10 p-4 space-y-3">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Score Breakdown
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mentions</span>
                <span className="font-medium">{trend.score.mentions.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Growth Rate</span>
                <span className="font-medium text-emerald-400">+{trend.score.growthRate}%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Time Decay</span>
                <span className="font-medium">{trend.score.timeDecay}x</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Raw Score</span>
                <span className="font-mono text-xs">{formatTrendScore(trend.score.raw)}</span>
              </div>
            </div>
          </div>

          {/* Algorithm Explanation */}
          <div className="text-xs text-muted-foreground text-center">
            Score = (Mentions × Growth Rate) / Time Decay
          </div>
        </motion.div>
      )}
    </div>
  );
}
