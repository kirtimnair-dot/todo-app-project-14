import { useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import {
  formatDueLabel,
  formatLongDate,
  formatTimeLabel,
  getCalendarCells,
  parseISODate,
  toISODate,
} from '../lib/date';
import { Task } from '../types';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar() {
  const { tasks, toggleTask, deleteTask, openAddModal, openEditModal } = useTasks();

  const today = new Date();
  const todayIso = toISODate(today);

  const [selectedIso, setSelectedIso] = useState(todayIso);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const cells = useMemo(() => getCalendarCells(viewYear, viewMonth), [viewYear, viewMonth]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    for (const task of tasks) {
      const existing = map.get(task.dueDate) || [];
      existing.push(task);
      map.set(task.dueDate, existing);
    }
    return map;
  }, [tasks]);

  const selectedTasks = useMemo(() => {
    return (tasksByDate.get(selectedIso) || []).sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return (a.dueTime || '23:59').localeCompare(b.dueTime || '23:59');
    });
  }, [tasksByDate, selectedIso]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.dueDate >= todayIso)
      .sort((a, b) => `${a.dueDate} ${a.dueTime || '23:59'}`.localeCompare(`${b.dueDate} ${b.dueTime || '23:59'}`))
      .slice(0, 5);
  }, [tasks, todayIso]);

  const monthTitle = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const jumpToToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedIso(toISODate(now));
  };

  const handleSelectCell = (iso: string, inCurrentMonth: boolean) => {
    setSelectedIso(iso);
    if (!inCurrentMonth) {
      const parsed = parseISODate(iso);
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-[32px] font-display font-bold tracking-tight text-[#211d1a] dark:text-[#f5f2ef]">
          Calendar
        </h1>
        <p className="mt-1 text-sm text-[#6e655d] dark:text-[#a69d95]">
          Schedule tasks by day and stay ahead of upcoming deadlines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Left: Month Calendar Grid */}
        <section className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] p-5 sm:p-6 shadow-xs">
          {/* Calendar Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goPrevMonth}
                aria-label="Previous month"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-[#ebe3da] dark:border-[#302b27] text-[#4d453f] dark:text-[#d5cdc5] hover:border-[#ff6b00]/40 hover:text-[#ff6b00] transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={goNextMonth}
                aria-label="Next month"
                className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-[#ebe3da] dark:border-[#302b27] text-[#4d453f] dark:text-[#d5cdc5] hover:border-[#ff6b00]/40 hover:text-[#ff6b00] transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
              <h2 className="ml-2 text-lg font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
                {monthTitle}
              </h2>
            </div>

            <button
              type="button"
              onClick={jumpToToday}
              className="h-9 px-4 rounded-full border border-[#ebe3da] dark:border-[#302b27] text-xs sm:text-sm font-semibold text-[#211d1a] dark:text-[#f5f2ef] hover:border-[#ff6b00]/40 hover:text-[#ff6b00] transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-[#8f857b] dark:text-[#9b9187]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((cell) => {
              const dayTasks = tasksByDate.get(cell.iso) || [];
              const hasPending = dayTasks.some((t) => !t.completed);
              const hasCompleted = dayTasks.some((t) => t.completed);
              const isSelected = cell.iso === selectedIso;

              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => handleSelectCell(cell.iso, cell.inCurrentMonth)}
                  aria-label={`${formatLongDate(cell.iso)}, ${dayTasks.length} tasks`}
                  aria-pressed={isSelected}
                  className={`min-h-[60px] sm:min-h-[74px] rounded-xl flex flex-col items-center justify-between py-2 px-1 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#fff4e9] dark:bg-[#2c2017] border border-[#ff6b00]/45'
                      : 'hover:bg-[#fffaf5] dark:hover:bg-[#25211d] border border-transparent'
                  }`}
                >
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold tabular-nums transition-colors ${
                      isSelected
                        ? 'bg-[#ff6b00] text-white shadow-xs'
                        : cell.isToday
                        ? 'border border-[#ff6b00] text-[#ff6b00]'
                        : cell.inCurrentMonth
                        ? 'text-[#211d1a] dark:text-[#f5f2ef]'
                        : 'text-[#b8afa7] dark:text-[#5c544d]'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {/* Task indicator dots + subtle count on wider screens */}
                  <span className="h-3 flex items-center gap-1">
                    {hasPending && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b00]" aria-hidden="true" />
                    )}
                    {hasCompleted && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#16a34a]" aria-hidden="true" />
                    )}
                    {dayTasks.length > 1 && (
                      <span className="hidden sm:inline text-[10px] font-medium text-[#7c7269] dark:text-[#a69d95] tabular-nums">
                        {dayTasks.length}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Right: Selected Day & Upcoming Tasks */}
        <aside className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] p-5 shadow-xs space-y-5">
          {/* Selected Date Tasks */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div>
                <h2 className="text-base font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
                  {formatDueLabel(selectedIso)}
                </h2>
                <p className="text-xs text-[#7c7269] dark:text-[#a69d95]">
                  {formatLongDate(selectedIso)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openAddModal(selectedIso)}
                aria-label={`Add task for ${formatLongDate(selectedIso)}`}
                className="h-9 px-3.5 rounded-full bg-[#fff4e9] dark:bg-[#2c2017] text-[#e85d04] dark:text-[#ff8a32] hover:bg-[#ffe5cc] dark:hover:bg-[#3a281b] text-xs font-semibold inline-flex items-center gap-1 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Add</span>
              </button>
            </div>

            {selectedTasks.length === 0 ? (
              <p className="py-4 text-xs text-[#7c7269] dark:text-[#a69d95] bg-[#fffaf5] dark:bg-[#161412] rounded-xl px-3.5">
                No tasks scheduled for this date.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#fffaf5] dark:bg-[#161412] border border-[#f2ebe4] dark:border-[#2a2521]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-label={task.completed ? `Mark "${task.title}" pending` : `Complete "${task.title}"`}
                        className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          task.completed
                            ? 'bg-[#1b7a3d] text-white'
                            : 'border-2 border-[#d5cdc5] dark:border-[#4b453f] hover:border-[#ff6b00]'
                        }`}
                      >
                        {task.completed && <Check size={13} strokeWidth={3} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(task)}
                        className="text-left min-w-0 flex-1 cursor-pointer"
                      >
                        <p
                          className={`text-sm font-medium truncate ${
                            task.completed
                              ? 'line-through text-[#7c7269]'
                              : 'text-[#211d1a] dark:text-[#f5f2ef]'
                          }`}
                        >
                          {task.title}
                        </p>
                        <p className="text-[11px] text-[#7c7269] dark:text-[#a69d95]">
                          {task.dueTime ? `${formatTimeLabel(task.dueTime)} · ` : ''}
                          {task.priority} priority
                        </p>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete "${task.title}"`}
                      className="h-8 w-8 rounded-full inline-flex items-center justify-center text-[#dc2626]/75 hover:text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#3a1d1d] transition-colors shrink-0 cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="h-px bg-[#f0e9e2] dark:bg-[#2d2824]" />

          {/* Upcoming Tasks */}
          <div>
            <h3 className="text-sm font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] mb-3">
              Upcoming Tasks
            </h3>
            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-[#7c7269] dark:text-[#a69d95]">
                No upcoming pending tasks.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.map((task) => (
                  <button
                    key={task.id}
                    type="button"
                    onClick={() => handleSelectCell(task.dueDate, true)}
                    className="w-full flex items-start gap-2.5 p-2 rounded-xl hover:bg-[#fffaf5] dark:hover:bg-[#25211d] transition-colors text-left cursor-pointer"
                  >
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                        task.priority === 'High'
                          ? 'bg-[#ff6b00]'
                          : task.priority === 'Medium'
                          ? 'bg-[#f59e0b]'
                          : 'bg-[#16a34a]'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#211d1a] dark:text-[#f5f2ef] truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-[#7c7269] dark:text-[#a69d95]">
                        {formatDueLabel(task.dueDate, task.dueTime)} · {task.priority}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
