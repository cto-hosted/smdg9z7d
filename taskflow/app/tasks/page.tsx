'use client';

import { useState } from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { TaskFilters } from '@/components/tasks/task-filters';
import { TaskForm } from '@/components/tasks/task-form';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/lib/task-store';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TasksPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const { getFilteredTasks, tasks } = useTasks();
  const filtered = getFilteredTasks();

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">All Tasks</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {filtered.length} of {tasks.length} tasks
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

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-xl border border-white/10 p-4"
      >
        <TaskFilters />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <TaskList />
      </motion.div>

      <TaskForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  );
}
