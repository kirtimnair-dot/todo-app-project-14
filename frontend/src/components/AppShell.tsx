import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Calendar as CalendarIcon, Check, Menu, Moon, Plus, Search, Sun, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Sidebar } from './Sidebar';
import { TaskModal } from './TaskModal';
import { AlarmOverlay } from './AlarmOverlay';
import { Brand } from './Brand';
import { useTasks } from '../context/TaskContext';
import { formatDueLabel, isOverdue, toISODate } from '../lib/date';

export function AppShell() {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    theme,
    toggleTheme,
    toggleTask,
    openAddModal,
  } = useTasks();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isTasksPage = location.pathname === '/tasks';

  const todayFormatted = useMemo(
    () =>
      new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
    []
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dueSoonTasks = useMemo(() => {
    const todayIso = toISODate(new Date());
    return tasks
      .filter((t) => !t.completed && t.dueDate <= todayIso)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  const quickSearchMatches = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || isTasksPage) return [];
    return tasks.filter((t) => t.title.toLowerCase().includes(q)).slice(0, 5);
  }, [tasks, searchQuery, isTasksPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFocused(false);
    if (!isTasksPage) {
      navigate('/tasks');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfbf9] dark:bg-[#141210] text-[#211d1a] dark:text-[#f5f2ef] transition-colors duration-150">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Top Header */}
        <header className="sticky top-0 z-20 bg-[#fdfbf9]/90 dark:bg-[#141210]/90 backdrop-blur-md border-b border-[#f2ebe4]/70 dark:border-[#24201c]">
          <div className="max-w-[1160px] mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Mobile Menu + Brand OR Search / Date */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
                className="lg:hidden h-10 w-10 -ml-1 inline-flex items-center justify-center rounded-xl text-[#211d1a] dark:text-[#f5f2ef] hover:bg-[#f5eee7] dark:hover:bg-[#24201d] transition-colors shrink-0"
              >
                <Menu size={22} />
              </button>

              <div className="lg:hidden shrink-0">
                <Brand variant="dark" size="sm" />
              </div>

              {isTasksPage ? (
                <div className="hidden lg:inline-flex items-center gap-2 text-xs font-medium text-[#7c7269] dark:text-[#a69d95]">
                  <CalendarIcon size={14} className="text-[#ff6b00]" />
                  <span>{todayFormatted}</span>
                </div>
              ) : (
                <div ref={searchRef} className="relative hidden sm:block flex-1 max-w-sm">
                  <form onSubmit={handleSearchSubmit}>
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f857b] pointer-events-none"
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onFocus={() => setSearchFocused(true)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchFocused(true);
                      }}
                      placeholder="Search tasks..."
                      aria-label="Search tasks"
                      className="w-full h-9 pl-9 pr-8 rounded-full border border-[#ebe3da] dark:border-[#2d2824] bg-white dark:bg-[#1e1b18] text-xs sm:text-sm text-[#211d1a] dark:text-[#f5f2ef] placeholder:text-[#8f857b] focus:border-[#ff6b00] focus:outline-none transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 inline-flex items-center justify-center rounded-full text-[#8f857b] hover:text-[#211d1a] dark:hover:text-white"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </form>

                  {searchFocused && quickSearchMatches.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#ebe3da] dark:border-[#302b27] shadow-xl py-1.5 z-40">
                      {quickSearchMatches.map((task) => (
                        <button
                          key={task.id}
                          type="button"
                          onClick={() => {
                            setSearchFocused(false);
                            navigate('/tasks');
                          }}
                          className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-[#fffaf5] dark:hover:bg-[#28231f] transition-colors"
                        >
                          <span className="text-sm font-medium text-[#211d1a] dark:text-[#f5f2ef] truncate">
                            {task.title}
                          </span>
                          <span className="text-xs text-[#7c7269] dark:text-[#a69d95] shrink-0">
                            {formatDueLabel(task.dueDate, task.dueTime)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#ebe3da] dark:border-[#2d2824] bg-white dark:bg-[#1e1b18] text-[#4d453f] dark:text-[#d5cdc5] hover:border-[#ff6b00]/40 hover:text-[#ff6b00] transition-colors cursor-pointer"
              >
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {/* Notifications Popover */}
              <div ref={notifRef} className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen((prev) => !prev)}
                  aria-label="Notifications"
                  aria-expanded={notifOpen}
                  className="relative h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#ebe3da] dark:border-[#2d2824] bg-white dark:bg-[#1e1b18] text-[#4d453f] dark:text-[#d5cdc5] hover:border-[#ff6b00]/40 hover:text-[#ff6b00] transition-colors cursor-pointer"
                >
                  <Bell size={16} />
                  {dueSoonTasks.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-[#ff6b00] text-white text-[10px] font-bold flex items-center justify-center tabular-nums">
                      {dueSoonTasks.length}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#ebe3da] dark:border-[#302b27] shadow-xl overflow-hidden z-40">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[#f0e9e2] dark:border-[#2d2824]">
                      <span className="text-sm font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
                        Due Today &amp; Overdue
                      </span>
                      <span className="text-xs font-medium text-[#7c7269] tabular-nums">
                        {dueSoonTasks.length} pending
                      </span>
                    </div>

                    {dueSoonTasks.length === 0 ? (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm font-medium text-[#211d1a] dark:text-[#f5f2ef]">
                          You are all caught up
                        </p>
                        <p className="text-xs text-[#7c7269] dark:text-[#a69d95] mt-1">
                          No pending tasks due today.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#f4ede6] dark:divide-[#2a2521] max-h-64 overflow-y-auto">
                        {dueSoonTasks.map((task) => {
                          const overdue = isOverdue(task.dueDate, task.completed, task.dueTime);
                          return (
                            <div
                              key={task.id}
                              className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-[#fffaf5] dark:hover:bg-[#25211e]"
                            >
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-[#211d1a] dark:text-[#f5f2ef] truncate">
                                  {task.title}
                                </p>
                                <p
                                  className={`text-xs mt-0.5 ${
                                    overdue
                                      ? 'text-[#dc2626] dark:text-[#f87171]'
                                      : 'text-[#7c7269] dark:text-[#a69d95]'
                                  }`}
                                >
                                  {formatDueLabel(task.dueDate, task.dueTime)} · {task.priority}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleTask(task.id)}
                                aria-label={`Complete "${task.title}"`}
                                className="h-8 w-8 rounded-full border border-[#d5cdc5] dark:border-[#4b453f] inline-flex items-center justify-center text-[#16a34a] hover:bg-[#f0fdf4] dark:hover:bg-[#173020] transition-colors shrink-0 cursor-pointer"
                              >
                                <Check size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!isTasksPage && (
                <button
                  type="button"
                  onClick={() => openAddModal()}
                  className="h-9 px-4 rounded-full bg-[#ff6b00] hover:bg-[#e85d04] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span className="hidden sm:inline">Add Task</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Viewport with subtle transition */}
        <main className="flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[1160px] mx-auto px-4 sm:px-8 pt-5 pb-10"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      <TaskModal />
      <AlarmOverlay />
    </div>
  );
}
