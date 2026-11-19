import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Task } from '../types';
import { loadTasks, saveTasks } from '../lib/storage';
type NewTask = Omit<Task, 'id' | 'createdAt'>;
type TaskContextValue = { tasks: Task[]; addTask: (task: NewTask) => void; updateTask: (id: string, task: NewTask) => void; deleteTask: (id: string) => void; toggleTask: (id: string) => void };
const TaskContext = createContext<TaskContextValue | null>(null);
export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  useEffect(() => saveTasks(tasks), [tasks]);
  const value = useMemo<TaskContextValue>(() => ({
    tasks,
    addTask: (task) => setTasks((current) => [{ ...task, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current]),
    updateTask: (id, task) => setTasks((current) => current.map((item) => item.id === id ? { ...item, ...task } : item)),
    deleteTask: (id) => setTasks((current) => current.filter((item) => item.id !== id)),
    toggleTask: (id) => setTasks((current) => current.map((item) => item.id === id ? { ...item, completed: !item.completed } : item)),
  }), [tasks]);
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
export function useTasks() { const value = useContext(TaskContext); if (!value) throw new Error('useTasks must be used inside TaskProvider'); return value; }
