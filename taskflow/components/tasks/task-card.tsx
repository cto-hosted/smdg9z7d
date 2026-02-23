'use client';

import { useState } from 'react';
import { Task } from '@/lib/types';
import { useTasks } from '@/lib/task-store';
import { format, parseISO, isAfter, isPast } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
} from 'lucide-react';
import { TaskForm } from './task-form';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const priorityConfig = {
  low: { label: 'Low', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  medium: { label: 'Medium', className: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  high: { label: 'High', className: 'bg-rose-500/10 text-rose-500 border-rose-500/20' },
};

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, className: 'bg-slate-500/10 text-slate-500 border-slate-500/20' },
  'in-progress': { label: 'In Progress', icon: Clock, className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  completed: { label: 'Completed', icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
};

const categoryColors: Record<string, string> = {
  Design: 'from-pink-500 to-rose-500',
  Development: 'from-violet-500 to-indigo-500',
  Documentation: 'from-blue-500 to-cyan-500',
  DevOps: 'from-orange-500 to-amber-500',
  Research: 'from-teal-500 to-green-500',
  Testing: 'from-purple-500 to-violet-500',
  Legal: 'from-red-500 to-rose-500',
  Marketing: 'from-fuchsia-500 to-pink-500',
  Other: 'from-gray-500 to-slate-500',
};

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask } = useTasks();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const statusCfg = statusConfig[task.status];
  const StatusIcon = statusCfg.icon;
  const priorityCfg = priorityConfig[task.priority];
  const catColor = categoryColors[task.category] ?? 'from-gray-500 to-slate-500';

  const isOverdue =
    task.status !== 'completed' &&
    task.dueDate &&
    isPast(parseISO(task.dueDate));

  const handleToggleComplete = () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    updateTask(task.id, { status: newStatus });
    toast.success(newStatus === 'completed' ? 'Task completed! 🎉' : 'Task reopened');
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setDeleteOpen(false);
    toast.success('Task deleted');
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="glass-card rounded-xl border border-white/10 p-4 group hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5"
      >
        <div className="flex items-start gap-3">
          <button
            onClick={handleToggleComplete}
            className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
            aria-label={task.status === 'completed' ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground/50 hover:text-violet-400 transition-colors" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={cn(
                  'text-sm font-medium leading-snug truncate',
                  task.status === 'completed' && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-card border-white/10">
                  <DropdownMenuItem onClick={() => setEditOpen(true)}>
                    <Pencil className="mr-2 h-3.5 w-3.5" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleToggleComplete}>
                    <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
                    {task.status === 'completed' ? 'Reopen' : 'Complete'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setDeleteOpen(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {task.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${catColor} flex-shrink-0`} />
              <span className="text-xs text-muted-foreground">{task.category}</span>
              <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', statusCfg.className)}>
                <StatusIcon className="mr-1 h-2.5 w-2.5" />
                {statusCfg.label}
              </Badge>
              <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', priorityCfg.className)}>
                {priorityCfg.label}
              </Badge>
            </div>

            {task.dueDate && (
              <div className={cn('mt-2 flex items-center gap-1 text-xs', isOverdue ? 'text-rose-500' : 'text-muted-foreground')}>
                {isOverdue ? (
                  <AlertCircle className="h-3 w-3" />
                ) : (
                  <Calendar className="h-3 w-3" />
                )}
                {isOverdue ? 'Overdue · ' : 'Due '}
                {format(parseISO(task.dueDate), 'MMM d, yyyy')}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <TaskForm open={editOpen} onOpenChange={setEditOpen} editTask={task} />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="glass-card border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{task.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
