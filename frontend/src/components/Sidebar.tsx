import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Calendar,
  CheckSquare,
  ChevronUp,
  Home,
  LogOut,
  Moon,
  Settings,
  ShieldCheck,
  Sun,
  X,
} from 'lucide-react';
import { Brand } from './Brand';
import { useTasks } from '../context/TaskContext';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const BASE_NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/tasks', label: 'My Tasks', icon: CheckSquare },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const { user, stats, theme, toggleTheme, logout } = useTasks();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navItems =
    user?.role === 'admin'
      ? [
          ...BASE_NAV_ITEMS.slice(0, 3),
          { to: '/admin', label: 'Admin Panel', icon: ShieldCheck },
          BASE_NAV_ITEMS[3],
        ]
      : BASE_NAV_ITEMS;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    onCloseMobile();
    logout();
    navigate('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#171513] text-[#f5f2ef] w-[244px] select-none border-r border-[#26221f]">
      {/* Brand header */}
      <div className="flex items-center justify-between px-5 pt-6 pb-7">
        <NavLink
          to="/dashboard"
          onClick={onCloseMobile}
          className="focus-visible:outline-2 focus-visible:outline-[#ff6b00] rounded-lg"
        >
          <Brand variant="light" size="md" />
        </NavLink>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl text-[#a69d95] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3.5 space-y-1.5" aria-label="Primary navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onCloseMobile}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-4 h-11 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff7d1a] text-white font-semibold shadow-[0_6px_18px_rgba(255,107,0,0.28)]'
                  : 'text-[#b5ada6] hover:text-white hover:bg-white/6'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={isActive ? 2.25 : 1.9} className="shrink-0" />
                  <span>{label}</span>
                </span>
                {to === '/tasks' && stats.pending > 0 && (
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      isActive ? 'text-white/90' : 'text-[#8f857b]'
                    }`}
                  >
                    {stats.pending}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom User Profile */}
      <div ref={menuRef} className="relative px-3.5 pb-5 pt-3 border-t border-white/8">
        {menuOpen && (
          <div className="absolute bottom-20 left-3.5 right-3.5 rounded-2xl bg-[#221f1c] border border-[#35302b] shadow-2xl p-1.5 z-30">
            <div className="px-3 py-2 border-b border-white/8 mb-1">
              <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-[#9b9187] truncate">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onCloseMobile();
                navigate('/settings');
              }}
              className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-xs font-medium text-[#e3dcd5] hover:bg-white/8 transition-colors cursor-pointer"
            >
              <Settings size={14} />
              <span>Account Settings</span>
            </button>
            <button
              type="button"
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-xs font-medium text-[#e3dcd5] hover:bg-white/8 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
              <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 h-9 rounded-lg text-xs font-medium text-[#f87171] hover:bg-[#3a1d1d] transition-colors mt-0.5 cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          className="w-full flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/6 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-[#ff8a32] to-[#e85d04] ring-2 ring-white/10 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {user?.avatarInitials || 'NY'}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate leading-tight">
                {user?.name || 'Namit Yadav'}
              </p>
              <p className="text-[11px] text-[#8f857b] truncate mt-0.5 capitalize">
                {user?.role === 'admin' ? 'Admin' : 'Personal'}
              </p>
            </div>
          </div>
          <ChevronUp
            size={16}
            className={`text-[#9b9187] shrink-0 transition-transform duration-150 ${
              menuOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden lg:block shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full">{sidebarContent}</aside>
        </div>
      )}
    </>
  );
}
