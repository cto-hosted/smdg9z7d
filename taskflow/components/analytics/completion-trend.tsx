'use client';

import { useTasks } from '@/lib/task-store';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useMounted } from '@/hooks/use-mounted';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, subDays, startOfDay } from 'date-fns';

export function CompletionTrend() {
  const { tasks } = useTasks();
  const mounted = useMounted();

  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const today = startOfDay(new Date());

  const data = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(today, 13 - i);
    const dayStart = date.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    const count = completedTasks.filter((t) => {
      const updatedAt = parseISO(t.updatedAt).getTime();
      return updatedAt >= dayStart && updatedAt < dayEnd;
    }).length;
    return {
      date: format(date, 'MMM d'),
      completed: count,
    };
  });

  if (!mounted) return <Skeleton className="h-[280px] rounded-xl" />;

  return (
    <div className="glass-card rounded-xl border border-white/10 p-5">
      <h3 className="mb-1 text-sm font-semibold">Completion Trend</h3>
      <p className="mb-4 text-xs text-muted-foreground">Tasks completed over the last 14 days</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            interval={2}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15,15,20,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#completionGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#7c3aed' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
