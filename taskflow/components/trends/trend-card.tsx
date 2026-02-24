'use client';

import { Trend } from '@/lib/types';
import { TrendLevel } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Share2, MapPin, Clock } from 'lucide-react';
import { cn, getTrendLevelColor, getTrendLevelBgColor } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TrendCardProps {
  trend: Trend;
  delay?: number;
  onClick?: () => void;
}

export function TrendCard({ trend, delay = 0, onClick }: TrendCardProps) {
  const levelColors: Record<TrendLevel, string> = {
    low: 'from-slate-500 to-slate-600',
    rising: 'from-amber-500 to-orange-500',
    viral: 'from-orange-500 to-rose-500',
    explosive: 'from-rose-500 via-red-500 to-pink-500',
  };

  const levelGlow: Record<TrendLevel, string> = {
    low: '',
    rising: 'shadow-amber-500/20',
    viral: 'shadow-orange-500/20',
    explosive: 'shadow-rose-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card 
        className={cn(
          'group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]',
          'bg-white/5 border-white/10 hover:border-rose-500/30',
          'hover:shadow-lg hover:shadow-rose-500/10'
        )}
        onClick={onClick}
      >
        <div className={cn(
          'absolute top-0 left-0 right-0 h-1 bg-gradient-to-r',
          levelColors[trend.level],
          levelGlow[trend.level] ? `shadow-lg ${levelGlow[trend.level]}` : ''
        )} />
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge 
                  variant="secondary" 
                  className={cn(
                    'text-[10px] font-semibold uppercase tracking-wider',
                    getTrendLevelBgColor(trend.level),
                    getTrendLevelColor(trend.level)
                  )}
                >
                  {trend.level}
                </Badge>
                <span className="text-xs text-muted-foreground capitalize">
                  {trend.category}
                </span>
              </div>
              
              <h3 className="font-semibold text-sm truncate mb-1 group-hover:text-rose-400 transition-colors">
                {trend.name}
              </h3>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {trend.location.name}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className={cn(
                'text-2xl font-bold bg-gradient-to-br bg-clip-text text-transparent',
                levelColors[trend.level]
              )}>
                {trend.score}
              </div>
              
              <div className="flex items-center gap-1 text-xs">
                {trend.growthRate > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">+{trend.growthRate}%</span>
                  </>
                ) : trend.growthRate < 0 ? (
                  <>
                    <TrendingDown className="h-3 w-3 text-rose-400" />
                    <span className="text-rose-400">{trend.growthRate}%</span>
                  </>
                ) : (
                  <>
                    <Minus className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">0%</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                {trend.mentions.toLocaleString()} mentions
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share) {
                  navigator.share({
                    title: `${trend.name} - Trending in ${trend.location.name}`,
                    text: `Check out this trending topic: ${trend.name} (Score: ${trend.score})`,
                  });
                }
              }}
            >
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {trend.keywords && trend.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {trend.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="text-[10px] px-1.5 py-0.5 bg-white/5 rounded-full text-muted-foreground"
                >
                  #{keyword}
                </span>
              ))}
              {trend.keywords.length > 3 && (
                <span className="text-[10px] text-muted-foreground">
                  +{trend.keywords.length - 3}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
