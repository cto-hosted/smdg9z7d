'use client';

import { useState } from 'react';
import { useTasks } from '@/lib/task-store';
import { StatsCard } from '@/components/analytics/stats-card';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskForm } from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  AlertTriangle,
  Plus,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format, parseISO, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { tasks, getStats, isLoaded } = useTasks();
  const [createOpen, setCreateOpen] = useState(false);

  const stats = getStats();
  const recentTasks = tasks.slice(0, 6);
  const upcomingTasks = tasks
    .filter(
      (t) =>
        t.status !== 'completed' &&
        t.dueDate &&
        isAfter(parseISO(t.dueDate), new Date())
    )
    .sort((a, b) => parseISO(a.dueDate!).getTime() - parseISO(b.dueDate!).getTime())
    .slice(0, 3);

  const statsData = [
    {
      title: 'Total Tasks',
      value: stats.total,
      description: 'All tasks in your workspace',
      icon: ListTodo,
      gradient: 'from-violet-500 to-indigo-600',
    },
    {
      title: 'Completed',
      value: stats.completed,
      description: `${stats.completionRate}% completion rate`,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      description: 'Currently being worked on',
      icon: Clock,
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      description: 'Need immediate attention',
      icon: AlertTriangle,
      gradient: 'from-rose-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Overview</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0 shadow-lg shadow-violet-500/20"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>
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
            <h3 className="text-sm font-semibold">Progress Overview</h3>
          </div>
          <span className="text-sm font-bold text-violet-400">{stats.completionRate}%</span>
        </div>
        <Progress
          value={stats.completionRate}
          className="h-2 bg-white/5"
        />
        <div className="mt-3 grid grid-cols-3 gap-4 text-center text-xs">
          <div>
            <div className="font-semibold text-emerald-400">{stats.completed}</div>
            <div className="text-muted-foreground">Completed</div>
          </div>
          <div>
            <div className="font-semibold text-blue-400">{stats.inProgress}</div>
            <div className="text-muted-foreground">In Progress</div>
          </div>
          <div>
            <div className="font-semibold text-slate-400">{stats.todo}</div>
            <div className="text-muted-foreground">To Do</div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Tasks</h3>
            <a href="/tasks" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              View all →
            </a>
          </div>
          {!isLoaded ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-28 rounded-xl" />
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="glass-card rounded-xl border border-white/10 p-8 text-center">
              <Zap className="h-8 w-8 text-violet-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No tasks yet. Create your first task!</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {recentTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Upcoming Deadlines</h3>
          {!isLoaded ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : upcomingTasks.length === 0 ? (
            <div className="glass-card rounded-xl border border-white/10 p-6 text-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="glass-card rounded-xl border border-white/10 p-3.5 hover:border-violet-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'mt-0.5 h-2 w-2 rounded-full flex-shrink-0',
                        task.priority === 'high'
                          ? 'bg-rose-500'
                          : task.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{task.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Due {format(parseISO(task.dueDate!), 'MMM d')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TaskForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
