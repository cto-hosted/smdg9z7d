'use client';

import { useTasks } from '@/lib/task-store';
import { TaskCard } from './task-card';
import { AnimatePresence, motion } from 'framer-motion';
import { ClipboardList } from 'lucide-react';

export function TaskList() {
  const { getFilteredTasks } = useTasks();
  const tasks = getFilteredTasks();

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
          <ClipboardList className="h-8 w-8 text-violet-400" />
        </div>
        <h3 className="text-base font-semibold">No tasks found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your filters or create a new task.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
}
