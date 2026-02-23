'use client';

import { useTasks } from '@/lib/task-store';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMounted } from '@/hooks/use-mounted';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = {
  todo: '#6366f1',
  'in-progress': '#3b82f6',
  completed: '#10b981',
};

const LABELS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  completed: 'Completed',
};

export function StatusChart() {
  const { tasks } = useTasks();
  const mounted = useMounted();

  const data = [
    { name: LABELS.todo, value: tasks.filter((t) => t.status === 'todo').length, key: 'todo' },
    { name: LABELS['in-progress'], value: tasks.filter((t) => t.status === 'in-progress').length, key: 'in-progress' },
    { name: LABELS.completed, value: tasks.filter((t) => t.status === 'completed').length, key: 'completed' },
  ].filter((d) => d.value > 0);

  if (!mounted) return <Skeleton className="h-[280px] rounded-xl" />;

  return (
    <div className="glass-card rounded-xl border border-white/10 p-5">
      <h3 className="mb-4 text-sm font-semibold">Tasks by Status</h3>
      {data.length === 0 ? (
        <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={COLORS[entry.key as keyof typeof COLORS]}
                  strokeWidth={0}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'rgba(15,15,20,0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: '12px', color: 'var(--muted-foreground)' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
