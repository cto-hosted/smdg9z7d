'use client';

import { useTrends } from '@/lib/trend-store';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getTrendLevelColor, getCategoryEmoji } from '@/lib/trend-algorithm';

export function BusinessInsights() {
  const { trends, topTrends, userMode, selectedLocation } = useTrends();

  if (userMode !== 'business') return null;

  // Calculate aggregated statistics
  const totalMentions = trends.reduce((sum, t) => sum + t.score.mentions, 0);
  const avgGrowth = trends.reduce((sum, t) => sum + t.score.growthRate, 0) / trends.length || 0;
  const avgScore = trends.reduce((sum, t) => sum + t.score.normalized, 0) / trends.length || 0;
  const viralTrends = trends.filter(t => t.score.level === 'viral' || t.score.level === 'explosive').length;

  const stats = [
    {
      title: 'Total Mentions',
      value: totalMentions.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Avg. Growth Rate',
      value: `${avgGrowth.toFixed(1)}%`,
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Avg. Trend Score',
      value: avgScore.toFixed(0),
      change: '+5.3',
      trend: 'up',
      icon: Activity,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    },
    {
      title: 'Viral Trends',
      value: viralTrends.toString(),
      change: '+2',
      trend: 'up',
      icon: Target,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
    },
  ];

  // Peak hours analysis
  const hourCounts = new Array(24).fill(0);
  trends.forEach(trend => {
    trend.peakHours.forEach(hour => {
      hourCounts[hour]++;
    });
  });

  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-orange-400" />
          <h3 className="text-sm font-semibold">Business Insights</h3>
        </div>
        <Badge variant="secondary" className="text-xs">
          {selectedLocation?.city || 'Select location'}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="bg-white/5 border-white/10 p-4 hover:border-orange-500/30 transition-colors">
              <div className="flex items-start justify-between">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stat.bg)}>
                  <stat.icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div className={cn(
                  'flex items-center gap-0.5 text-xs font-medium',
                  stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                )}>
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Peak Hours */}
      <Card className="bg-white/5 border-white/10 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Peak Activity Hours</h4>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Busiest hour</span>
            <span className="font-medium text-orange-400">{peakHour}:00 - {peakHour + 1}:00</span>
          </div>
          
          <div className="h-16 flex items-end gap-1">
            {hourCounts.slice(12, 22).map((count, i) => {
              const height = Math.max(10, (count / Math.max(...hourCounts)) * 100);
              const hour = i + 12;
              return (
                <div
                  key={hour}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div 
                    className={cn(
                      'w-full rounded-t-sm transition-all',
                      hour === peakHour 
                        ? 'bg-gradient-to-t from-orange-500 to-rose-500' 
                        : 'bg-white/10'
                    )}
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{hour}</span>
                </div>
              );
            })}
          </div>
          
          <p className="text-xs text-muted-foreground text-center">
            Peak activity between {peakHour}:00 and {peakHour + 1}:00
          </p>
        </div>
      </Card>

      {/* Top Opportunities */}
      <Card className="bg-white/5 border-white/10 p-4">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-muted-foreground" />
          <h4 className="text-sm font-medium">Top Opportunities</h4>
        </div>

        <div className="space-y-2">
          {topTrends.slice(0, 3).map((trend, index) => (
            <motion.div
              key={trend.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-xl">{getCategoryEmoji(trend.category)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{trend.name}</p>
                <p className="text-xs text-muted-foreground">
                  {trend.score.growthRate}% growth • {trend.score.mentions.toLocaleString()} mentions
                </p>
              </div>
              <span className={cn('text-lg font-bold', getTrendLevelColor(trend.score.level))}>
                {trend.score.normalized}
              </span>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
