import React, { useMemo, useState } from 'react';
import { CheckSquare, Plus, Search, Trash2, X } from 'lucide-react';
import { PRIORITY_ORDER, useTasks } from '../context/TaskContext';
import { Priority, TaskFilter } from '../types';
import { TaskRow } from '../components/TaskRow';
import { toISODate } from '../lib/date';

type SortOption = 'dueDate' | 'priority' | 'recent';

export function Tasks() {
  const {
    user,
    tasks,
    stats,
    searchQuery,
    setSearchQuery,
    addTask,
    toggleTask,
    openEditModal,
    deleteTask,
    clearCompleted,
    openAddModal,
  } = useTasks();

  const [statusFilter, setStatusFilter] = useState<TaskFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<'All' | Priority>('All');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');
  const [quickTitle, setQuickTitle] = useState('');

  const filteredTasks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return tasks
      .filter((task) => {
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;
        if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
        if (q) {
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesNotes = task.notes?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesNotes) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const dueA = `${a.dueDate} ${a.dueTime || '23:59'}`;
        const dueB = `${b.dueDate} ${b.dueTime || '23:59'}`;
        if (sortBy === 'priority') {
          const diff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
          if (diff !== 0) return diff;
          return dueA.localeCompare(dueB);
        }
        if (sortBy === 'recent') {
          return b.createdAt.localeCompare(a.createdAt);
        }
        return dueA.localeCompare(dueB);
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, sortBy]);

  const filterTabs: { id: TaskFilter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'pending', label: 'Pending', count: stats.pending },
    { id: 'completed', label: 'Completed', count: stats.completed },
  ];

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || statusFilter !== 'all' || priorityFilter !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('All');
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed) return;
    addTask({
      title: trimmed,
      priority: user?.defaultPriority || 'Medium',
      dueDate: toISODate(new Date()),
    });
    setQuickTitle('');
    if (statusFilter === 'completed') {
      setStatusFilter('all');
    }
  };

  return (
    <div className="relative rounded-3xl bg-[#fffcf8] dark:bg-[#191613] border border-[#f2ebe3] dark:border-[#2a2521] p-5 sm:p-8 overflow-hidden shadow-xs">
      {/* Subtle warm radial corner highlights */}
      <div
        className="pointer-events-none -top-16 -right-12 absolute h-48 w-52 rounded-full bg-[#ffd24c]/25 dark:bg-[#ffb703]/8 blur-2xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none -bottom-16 -left-12 absolute h-44 w-56 rounded-full bg-[#ffaa52]/18 dark:bg-[#ff6b00]/8 blur-2xl"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-5">
        {/* Top Row: My Tasks + Search Bar + Add Task Pill */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-[32px] font-display font-bold tracking-tight text-[#211d1a] dark:text-[#f5f2ef]">
            My Tasks
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 md:max-w-lg md:justify-end">
            <div className="relative flex-1 sm:max-w-xs">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7c7269] pointer-events-none"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                aria-label="Search tasks"
                className="w-full h-11 pl-10 pr-9 rounded-full border border-[#ebe3da] dark:border-[#302b27] bg-white dark:bg-[#221e1a] text-sm text-[#211d1a] dark:text-[#f5f2ef] placeholder:text-[#7c7269] focus:border-[#ff6b00] focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 inline-flex items-center justify-center rounded-full text-[#7c7269] hover:text-[#211d1a] dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => openAddModal()}
              className="h-11 px-5 rounded-full bg-[#ff6b00] hover:bg-[#e85d04] text-white text-sm font-semibold inline-flex items-center justify-center gap-1.5 shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus size={17} strokeWidth={2.5} />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs + Priority/Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            className="flex items-center gap-2 flex-wrap"
            role="tablist"
            aria-label="Filter tasks by status"
          >
            {filterTabs.map((tab) => {
              const active = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`h-9 px-4 rounded-full text-sm font-semibold transition-colors whitespace-nowrap tabular-nums cursor-pointer ${
                    active
                      ? 'bg-[#181614] text-white dark:bg-[#ff6b00] dark:text-white shadow-xs'
                      : 'text-[#5c534c] dark:text-[#cfc6be] hover:bg-[#f4ede6] dark:hover:bg-[#26221e]'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-xs ${active ? 'opacity-80' : 'opacity-65'}`}>
                    ({tab.count})
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {statusFilter === 'completed' && stats.completed > 0 && (
              <button
                type="button"
                onClick={clearCompleted}
                className="h-9 px-3.5 rounded-full border border-[#fde4e4] dark:border-[#422323] text-xs font-semibold text-[#dc2626] dark:text-[#f87171] hover:bg-[#fef2f2] dark:hover:bg-[#3a1d1d] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Clear Completed</span>
              </button>
            )}

            <select
              aria-label="Filter by priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'All' | Priority)}
              className="h-9 px-3 rounded-full border border-[#ebe3da] dark:border-[#302b27] bg-white dark:bg-[#221e1a] text-xs font-medium text-[#4d453f] dark:text-[#d5cdc5] focus:border-[#ff6b00] focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>

            <select
              aria-label="Sort tasks"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 px-3 rounded-full border border-[#ebe3da] dark:border-[#302b27] bg-white dark:bg-[#221e1a] text-xs font-medium text-[#4d453f] dark:text-[#d5cdc5] focus:border-[#ff6b00] focus:outline-none"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>

        {/* Quick Inline Add Bar */}
        <form
          onSubmit={handleQuickAdd}
          className="flex items-center gap-2 rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] px-4 py-2 shadow-xs focus-within:border-[#ff6b00] transition-colors"
        >
          <Plus size={18} className="text-[#ff6b00] shrink-0" />
          <input
            type="text"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            placeholder="Quick add a task for today and press Enter..."
            aria-label="Quick add a task for today"
            className="flex-1 h-9 bg-transparent text-sm text-[#211d1a] dark:text-[#f5f2ef] placeholder:text-[#8f857b] focus:outline-none"
          />
          {quickTitle.trim() && (
            <button
              type="submit"
              className="h-8 px-3.5 rounded-full bg-[#ff6b00] hover:bg-[#e85d04] text-white text-xs font-semibold transition-colors cursor-pointer shrink-0"
            >
              Add
            </button>
          )}
        </form>

        {/* Crisp White Task List Card */}
        <div className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] shadow-[0_8px_30px_rgba(33,29,26,0.04)] overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-[#fff4e9] dark:bg-[#2c2017] text-[#ff6b00] flex items-center justify-center">
                <CheckSquare size={22} />
              </div>
              <h2 className="mt-4 text-base font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
                {hasActiveFilters ? 'No matching tasks found' : 'Your task list is empty'}
              </h2>
              <p className="mt-1 text-sm text-[#6e655d] dark:text-[#a69d95] max-w-sm mx-auto">
                {hasActiveFilters
                  ? 'Try clearing your search or switching status filters to see more tasks.'
                  : 'Add a task with a priority and due date to start organizing your day.'}
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="h-10 px-4 rounded-full border border-[#e3dad1] dark:border-[#36302b] text-sm font-semibold text-[#211d1a] dark:text-[#f5f2ef] hover:bg-[#fffaf5] dark:hover:bg-[#26221e] transition-colors"
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAddModal()}
                    className="h-10 px-5 rounded-full bg-[#ff6b00] hover:bg-[#e85d04] text-white text-sm font-semibold inline-flex items-center gap-1.5 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Task</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[#f3ede6] dark:divide-[#2a2521]">
              {filteredTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={openEditModal}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
