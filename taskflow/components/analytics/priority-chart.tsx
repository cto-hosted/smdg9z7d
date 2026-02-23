'use client';

import { useTasks } from '@/lib/task-store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useMounted } from '@/hooks/use-mounted';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = {
  high: '#f43f5e',
  medium: '#f59e0b',
  low: '#10b981',
};

export function PriorityChart() {
  const { tasks } = useTasks();
  const mounted = useMounted();

  const data = [
    { name: 'High', value: tasks.filter((t) => t.priority === 'high').length, key: 'high' },
    { name: 'Medium', value: tasks.filter((t) => t.priority === 'medium').length, key: 'medium' },
    { name: 'Low', value: tasks.filter((t) => t.priority === 'low').length, key: 'low' },
  ];

  if (!mounted) return <Skeleton className="h-[280px] rounded-xl" />;

  return (
    <div className="glass-card rounded-xl border border-white/10 p-5">
      <h3 className="mb-4 text-sm font-semibold">Tasks by Priority</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={40} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
            contentStyle={{
              background: 'rgba(15,15,20,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={COLORS[entry.key as keyof typeof COLORS]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
