'use client';

import { useTasks } from '@/lib/task-store';
import { StatsCard } from '@/components/analytics/stats-card';
import { StatusChart } from '@/components/analytics/status-chart';
import { PriorityChart } from '@/components/analytics/priority-chart';
import { CategoryChart } from '@/components/analytics/category-chart';
import { CompletionTrend } from '@/components/analytics/completion-trend';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const { getStats, isLoaded, tasks } = useTasks();
  const stats = getStats();

  const statsData = [
    {
      title: 'Total Tasks',
      value: stats.total,
      description: 'All time',
      icon: ListTodo,
      gradient: 'from-violet-500 to-indigo-600',
    },
    {
      title: 'Completed',
      value: stats.completed,
      description: `${stats.completionRate}% rate`,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      description: 'Active work',
      icon: Clock,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      description: 'Needs attention',
      icon: AlertTriangle,
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl font-bold">Analytics</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Performance insights across {stats.total} tasks
        </p>
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
            <StatsCard key={s.title} {...s} delay={i * 0.05} />
          ))}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card rounded-xl border border-white/10 p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-semibold">Overall Completion Rate</h3>
          </div>
          <span className="text-2xl font-bold text-violet-400">{stats.completionRate}%</span>
        </div>
        <Progress value={stats.completionRate} className="h-3 bg-white/5" />
        <div className="mt-4 grid grid-cols-4 gap-4 text-center text-xs">
          <div className="space-y-1">
            <div className="text-lg font-bold">{stats.total}</div>
            <div className="text-muted-foreground">Total</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-emerald-400">{stats.completed}</div>
            <div className="text-muted-foreground">Done</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-blue-400">{stats.inProgress}</div>
            <div className="text-muted-foreground">Active</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-rose-400">{stats.overdue}</div>
            <div className="text-muted-foreground">Overdue</div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatusChart />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <PriorityChart />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CompletionTrend />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <CategoryChart />
      </motion.div>
    </div>
  );
}
