import { CalendarDays, CheckSquare, Home, LogOut, Settings, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import Brand from './Brand';
type Props = { open: boolean; onClose: () => void };
const links = [{ to: '/', label: 'Dashboard', icon: Home }, { to: '/tasks', label: 'My Tasks', icon: CheckSquare }, { to: '/calendar', label: 'Calendar', icon: CalendarDays }, { to: '/settings', label: 'Settings', icon: Settings }];
export default function Sidebar({ open, onClose }: Props) {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('taskflow.user'); navigate('/login'); };
  return <><div onClick={onClose} className={`fixed inset-0 z-30 bg-black/30 transition md:hidden ${open ? 'visible opacity-100' : 'invisible opacity-0'}`} /><aside className={`fixed inset-y-0 left-0 z-40 flex w-[258px] flex-col bg-[#211d1a] px-5 py-6 text-white transition-transform md:static md:z-auto md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
    <div className="flex items-center justify-between px-1"><Brand light /><button onClick={onClose} className="rounded-lg p-2 text-white/70 hover:bg-white/10 md:hidden"><X /></button></div>
    <nav className="mt-12 space-y-2">{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === '/'} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-brand-500 text-white shadow-lg shadow-orange-950/20' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><Icon size={19} />{label}</NavLink>)}</nav>
    <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/10 p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#ffc47c] text-sm font-bold text-ink">N</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{localStorage.getItem('taskflow.user') || 'Namit Yadav'}</p><p className="text-xs text-white/50">Personal workspace</p></div><button title="Log out" onClick={logout} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white"><LogOut size={17} /></button></div>
  </aside></>;
}
