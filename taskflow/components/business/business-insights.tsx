'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Users, Clock, Target, Lightbulb, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTrends } from '@/lib/trend-store';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

interface BusinessInsightsProps {
  trendId?: string;
}

export function BusinessInsights({ trendId }: BusinessInsightsProps) {
  const { getFilteredTrends, getBusinessInsight, selectedLocation } = useTrends();
  const [selectedMetric, setSelectedMetric] = useState<'mentions' | 'growth'>('mentions');
  
  const trends = getFilteredTrends().slice(0, 10);
  const insight = trendId ? getBusinessInsight(trendId) : getBusinessInsight('1');

  const stats = [
    {
      title: 'Total Mentions',
      value: trends.reduce((sum, t) => sum + t.mentions, 0).toLocaleString(),
      change: '+23%',
      trend: 'up' as const,
      icon: Users,
      gradient: 'from-rose-500 to-orange-500',
    },
    {
      title: 'Avg. Growth Rate',
      value: `${Math.round(trends.reduce((sum, t) => sum + t.growthRate, 0) / trends.length)}%`,
      change: '+12%',
      trend: 'up' as const,
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Peak Hours',
      value: '18:00',
      change: '+2h',
      trend: 'up' as const,
      icon: Clock,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Active Trends',
      value: trends.length.toString(),
      change: '+3',
      trend: 'up' as const,
      icon: Target,
      gradient: 'from-violet-500 to-purple-500',
    },
  ];

  const chartData = insight?.peakTimes.map((pt) => ({
    name: `${pt.day.slice(0, 3)} ${pt.hour}:00`,
    value: pt.value,
  })) || [
    { name: 'Mon 12:00', value: 75 },
    { name: 'Mon 19:00', value: 90 },
    { name: 'Tue 12:00', value: 70 },
    { name: 'Tue 19:00', value: 85 },
    { name: 'Wed 12:00', value: 78 },
    { name: 'Wed 19:00', value: 92 },
    { name: 'Thu 12:00', value: 82 },
    { name: 'Thu 19:00', value: 96 },
    { name: 'Fri 18:00', value: 98 },
    { name: 'Fri 19:00', value: 100 },
    { name: 'Sat 12:00', value: 95 },
    { name: 'Sat 13:00', value: 100 },
  ];

  const trendComparisonData = insight?.competitorTrends.map((ct) => ({
    name: ct.trendName.length > 15 ? ct.trendName.slice(0, 15) + '...' : ct.trendName,
    score: ct.score,
    growth: ct.growthRate,
  })) || [
    { name: 'Rooftop Yoga', score: 78, growth: 32 },
    { name: 'Art Gallery', score: 65, growth: 28 },
    { name: 'Tech Meetup', score: 58, growth: 22 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 hover:border-rose-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('p-2 rounded-lg bg-gradient-to-br', stat.gradient)}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs">
                  {stat.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 text-emerald-400" />
                  ) : stat.trend === 'down' ? (
                    <ArrowDown className="h-3 w-3 text-rose-400" />
                  ) : (
                    <Minus className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-rose-400' : 'text-muted-foreground'}>
                    {stat.change}
                  </span>
                  <span className="text-muted-foreground">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-rose-400" />
              Peak Hours Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <YAxis
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 12, 30, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Peak activity typically occurs between 18:00 - 20:00 on weekdays
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              Trend Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendComparisonData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: '#9ca3af', fontSize: 10 }}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 12, 30, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="score" fill="#f97316" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {insight && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-amber-400" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insight.recommendations.map((rec, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground">{rec}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
