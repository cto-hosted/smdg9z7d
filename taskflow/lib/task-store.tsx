'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { Task, TaskFilters, TaskStats } from './types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { sampleTasks } from './sample-data';
import { isAfter, parseISO } from 'date-fns';

interface TaskContextValue {
  tasks: Task[];
  filters: TaskFilters;
  isLoaded: boolean;
  setFilters: (filters: TaskFilters) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  getFilteredTasks: () => Task[];
  getStats: () => TaskStats;
  categories: string[];
}

const TaskContext = createContext<TaskContextValue | null>(null);

const DEFAULT_FILTERS: TaskFilters = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
};

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks, isLoaded] = useLocalStorage<Task[]>('taskflow-tasks', sampleTasks);
  const [filters, setFilters] = useLocalStorage<TaskFilters>('taskflow-filters', DEFAULT_FILTERS);

  const addTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const newTask: Task = {
        ...taskData,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    [setTasks]
  );

  const updateTask = useCallback(
    (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? { ...task, ...updates, updatedAt: new Date().toISOString() }
            : task
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [setTasks]
  );

  const getFilteredTasks = useCallback((): Task[] => {
    return tasks.filter((task) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        if (
          !task.title.toLowerCase().includes(query) &&
          !task.description?.toLowerCase().includes(query) &&
          !task.category.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      if (filters.status !== 'all' && task.status !== filters.status) return false;
      if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
      if (filters.category !== 'all' && task.category !== filters.category) return false;
      return true;
    });
  }, [tasks, filters]);

  const getStats = useCallback((): TaskStats => {
    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const todo = tasks.filter((t) => t.status === 'todo').length;
    const overdue = tasks.filter(
      (t) =>
        t.status !== 'completed' &&
        t.dueDate &&
        isAfter(now, parseISO(t.dueDate))
    ).length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, todo, overdue, completionRate };
  }, [tasks]);

  const categories = React.useMemo(() => {
    const cats = [...new Set(tasks.map((t) => t.category))].sort();
    return cats;
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filters,
        isLoaded,
        setFilters,
        addTask,
        updateTask,
        deleteTask,
        getFilteredTasks,
        getStats,
        categories,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
}
