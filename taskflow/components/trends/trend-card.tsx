'use client';

import { Trend } from '@/lib/types';
import { getTrendLevelColor, getTrendLevelBgColor, getCategoryEmoji } from '@/lib/trend-algorithm';
import { useTrends } from '@/lib/trend-store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  MoreHorizontal,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TrendCardProps {
  trend: Trend;
  index?: number;
}

export function TrendCard({ trend, index = 0 }: TrendCardProps) {
  const { toggleSaveTrend, isTrendSaved, userMode } = useTrends();
  const [showMenu, setShowMenu] = useState(false);
  const isSaved = isTrendSaved(trend.id);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        'group relative glass-card rounded-xl border p-4 hover:border-orange-500/30 transition-all duration-300',
        getTrendLevelBgColor(trend.score.level)
      )}
    >
      <div className="flex items-start gap-3">
        {/* Trend Level Indicator */}
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
          getTrendLevelBgColor(trend.score.level)
        )}>
          {getCategoryEmoji(trend.category)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm truncate group-hover:text-orange-400 transition-colors">
                {trend.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge 
                  variant="secondary" 
                  className="text-[10px] px-1.5 py-0 h-5 bg-white/5 border-white/10"
                >
                  {trend.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn(
                    'text-[10px] px-1.5 py-0 h-5 border',
                    getTrendLevelColor(trend.score.level),
                    'border-current/20'
                  )}
                >
                  {trend.score.level.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className={cn(
                'text-2xl font-bold',
                getTrendLevelColor(trend.score.level)
              )}>
                {trend.score.normalized}
              </div>
              <div className="text-[10px] text-muted-foreground">Trend Score</div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">+{trend.score.growthRate}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{formatNumber(trend.score.mentions)}</span>
              <span>mentions</span>
            </div>
            {trend.peakHours.length > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{trend.peakHours[0]}:00 - {trend.peakHours[trend.peakHours.length - 1] + 1}:00</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/10"
            onClick={() => toggleSaveTrend(trend.id)}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4 text-orange-400" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/10"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: trend.name,
                  text: `Check out this trending topic: ${trend.name}`,
                });
              }
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Keywords */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {trend.keywords.slice(0, 3).map((keyword) => (
          <span
            key={keyword}
            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground"
          >
            #{keyword}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
