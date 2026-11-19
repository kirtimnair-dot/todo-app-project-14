import { CalendarDays, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { Priority, Task } from '../types';
type Props = { open: boolean; onClose: () => void; onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void; task?: Task | null };
const blank = { title: '', description: '', dueDate: '', priority: 'Medium' as Priority, completed: false };
export default function TaskModal({ open, onClose, onSave, task }: Props) {
  const [form, setForm] = useState(blank);
  useEffect(() => { setForm(task ? { title: task.title, description: task.description, dueDate: task.dueDate, priority: task.priority, completed: task.completed } : blank); }, [task, open]);
  if (!open) return null;
  const submit = (e: FormEvent) => { e.preventDefault(); if (!form.title.trim()) return; onSave(form); onClose(); };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><form onSubmit={submit} className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl sm:p-8"><div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">＋</span><h2 className="text-xl font-bold">{task ? 'Edit Task' : 'Add New Task'}</h2></div><button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-stone-100"><X size={20} /></button></div>
    <label className="label">Task title *</label><input autoFocus required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What do you need to do?" className="field mb-4 w-full" />
    <label className="label">Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Add a few details (optional)" className="field mb-4 w-full resize-none" />
    <label className="label">Priority</label><div className="mb-5 grid grid-cols-3 gap-2">{(['Low', 'Medium', 'High'] as Priority[]).map((p) => <button type="button" key={p} onClick={() => setForm({ ...form, priority: p })} className={`rounded-xl border px-3 py-2.5 text-sm font-semibold ${form.priority === p ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>{p}</button>)}</div>
    <label className="label">Due date</label><div className="relative mb-7"><CalendarDays size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" /><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="field w-full pl-11" /></div>
    <div className="flex justify-end gap-3"><button type="button" onClick={onClose} className="btn-secondary">Cancel</button><button type="submit" className="btn-primary">{task ? 'Save Changes' : 'Add Task'}</button></div></form></div>;
}
