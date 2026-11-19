import type { Task } from '../types';
const KEY = 'taskflow.tasks.v1';
const starterTasks: Task[] = [
  { id: '1', title: 'Complete project report', description: 'Finish the final review and submit the report.', dueDate: new Date().toISOString().slice(0, 10), priority: 'High', completed: false, createdAt: new Date().toISOString() },
  { id: '2', title: 'Study DSA', description: 'Revise arrays, linked lists and stacks.', dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10), priority: 'Medium', completed: true, createdAt: new Date().toISOString() },
  { id: '3', title: 'Read a book', description: 'Read for at least 20 minutes.', dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), priority: 'Low', completed: false, createdAt: new Date().toISOString() },
];
export function loadTasks(): Task[] {
  try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) as Task[] : starterTasks; }
  catch { return starterTasks; }
}
export function saveTasks(tasks: Task[]) { localStorage.setItem(KEY, JSON.stringify(tasks)); }
