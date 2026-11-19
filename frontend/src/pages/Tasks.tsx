import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskModal from '../components/TaskModal';
import TaskRow from '../components/TaskRow';
import type { Task, TaskFilter } from '../types';
export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask, toggleTask } = useTasks(); const [filter,setFilter]=useState<TaskFilter>('All'); const [search,setSearch]=useState(''); const [modal,setModal]=useState(false); const [editing,setEditing]=useState<Task|null>(null);
  useEffect(()=>{const handler=(e:Event)=>setSearch((e as CustomEvent<string>).detail);window.addEventListener('taskflow-search',handler);return()=>window.removeEventListener('taskflow-search',handler)},[]);
  const visible=useMemo(()=>tasks.filter(t=>(filter==='All'||(filter==='Pending'?!t.completed:t.completed))&&`${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase())),[tasks,filter,search]);
  const save=(data:Omit<Task,'id'|'createdAt'>)=>editing?updateTask(editing.id,data):addTask(data);
  return <><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold text-brand-600">YOUR LIST</p><h1 className="mt-1 text-3xl font-extrabold">My Tasks</h1><p className="mt-1 text-sm text-stone-500">Keep everything in one place.</p></div><button onClick={()=>{setEditing(null);setModal(true)}} className="btn-primary"><Plus size={18}/> Add Task</button></div>
  <section className="panel"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 p-4 sm:p-5"><div className="flex gap-2">{(['All','Pending','Completed'] as TaskFilter[]).map(f=><button key={f} onClick={()=>setFilter(f)} className={`rounded-full px-4 py-2 text-sm font-semibold ${filter===f?'bg-ink text-white':'bg-stone-100 text-stone-600 hover:bg-orange-50'}`}>{f} <span className="ml-1 opacity-70">{f==='All'?tasks.length:f==='Pending'?tasks.filter(t=>!t.completed).length:tasks.filter(t=>t.completed).length}</span></button>)}</div><div className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-stone-400"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search tasks" className="w-32 bg-transparent text-sm text-ink outline-none sm:w-44"/><SlidersHorizontal size={16}/></div></div>
  {visible.length?visible.map(task=><TaskRow key={task.id} task={task} onToggle={()=>toggleTask(task.id)} onEdit={()=>{setEditing(task);setModal(true)}} onDelete={()=>deleteTask(task.id)}/>):<div className="p-12 text-center"><p className="font-semibold">No tasks found</p><p className="mt-1 text-sm text-stone-400">Try another filter or add a new task.</p></div>}</section>
  <TaskModal open={modal} onClose={()=>setModal(false)} onSave={save} task={editing}/></>;
}
