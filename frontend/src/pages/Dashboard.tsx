import { Link } from 'react-router-dom';
import { ArrowRight, Check, Clock, Moon, Plus, Sun } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { getTimeGreeting } from '../lib/date';
import { StayProductiveIllustration } from '../components/Illustrations';
import { ProductivityChart } from '../components/ProductivityChart';
import { TaskRow } from '../components/TaskRow';

export function Dashboard() {
  const { user, tasks, stats, toggleTask, openEditModal, deleteTask, openAddModal } = useTasks();
  const { greeting, period } = getTimeGreeting();
  const firstName = (user?.name || 'Namit').split(' ')[0];

  const recentTasks = [...tasks]
    .sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, 4);

  const bannerCopy =
    stats.total === 0
      ? {
          title: 'Ready to Start!',
          subtitle: 'Add your first task to build daily momentum.',
        }
      : stats.completionRate === 100
      ? {
          title: 'All Caught Up!',
          subtitle: 'Every task on your list is complete.',
        }
      : {
          title: 'Stay Productive!',
          subtitle: "You're on track.",
        };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-[32px] font-display font-bold tracking-tight text-[#211d1a] dark:text-[#f5f2ef] text-balance">
            {greeting}, {firstName}!
          </h1>
          <span
            className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-[#fff5db] dark:bg-[#2c2316] text-[#f59e0b]"
            aria-hidden="true"
          >
            {period === 'evening' ? <Moon size={20} /> : <Sun size={20} />}
          </span>
        </div>
      </div>

      {/* 3 Clean KPI Summary Cards */}
      <section aria-label="Task summary statistics" className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Total Tasks */}
        <Link
          to="/tasks"
          className="group rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#f0e9e2] dark:border-[#2e2924] p-6 shadow-[0_6px_24px_rgba(33,29,26,0.03)] hover:border-[#16a34a]/35 hover:-translate-y-0.5 transition-all duration-150"
        >
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-full bg-[#dff2e1] dark:bg-[#193521] text-[#2e7d32] dark:text-[#4ade80] inline-flex items-center justify-center">
              <Check size={20} strokeWidth={2.75} />
            </div>
            <span className="text-xs font-medium text-[#8f857b] group-hover:text-[#211d1a] dark:group-hover:text-white transition-colors">
              All tracked
            </span>
          </div>
          <p className="mt-5 text-[34px] leading-none font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] tabular-nums">
            {stats.total}
          </p>
          <p className="mt-2 text-sm font-medium text-[#6e655d] dark:text-[#a69d95]">
            Total Tasks
          </p>
        </Link>

        {/* Pending */}
        <Link
          to="/tasks"
          className="group rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#f0e9e2] dark:border-[#2e2924] p-6 shadow-[0_6px_24px_rgba(33,29,26,0.03)] hover:border-[#ff6b00]/40 hover:-translate-y-0.5 transition-all duration-150"
        >
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-full bg-[#ffead6] dark:bg-[#382315] text-[#f56a00] dark:text-[#ff8a32] inline-flex items-center justify-center">
              <Clock size={20} strokeWidth={2.25} />
            </div>
            <span className="text-xs font-medium text-[#8f857b] group-hover:text-[#ff6b00] transition-colors">
              In progress
            </span>
          </div>
          <p className="mt-5 text-[34px] leading-none font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] tabular-nums">
            {stats.pending}
          </p>
          <p className="mt-2 text-sm font-medium text-[#6e655d] dark:text-[#a69d95]">
            Pending
          </p>
        </Link>

        {/* Completed */}
        <Link
          to="/tasks"
          className="group rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#f0e9e2] dark:border-[#2e2924] p-6 shadow-[0_6px_24px_rgba(33,29,26,0.03)] hover:border-[#16a34a]/35 hover:-translate-y-0.5 transition-all duration-150"
        >
          <div className="flex items-center justify-between">
            <div className="h-11 w-11 rounded-full bg-[#dff2e1] dark:bg-[#193521] text-[#2e7d32] dark:text-[#4ade80] inline-flex items-center justify-center">
              <Check size={20} strokeWidth={2.75} />
            </div>
            <span className="text-xs font-semibold text-[#16a34a] dark:text-[#4ade80] tabular-nums">
              {stats.completionRate}% rate
            </span>
          </div>
          <p className="mt-5 text-[34px] leading-none font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] tabular-nums">
            {stats.completed}
          </p>
          <p className="mt-2 text-sm font-medium text-[#6e655d] dark:text-[#a69d95]">
            Completed
          </p>
        </Link>
      </section>

      {/* Stay Productive Hero Banner */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#fff6ee] via-[#ffecda] to-[#fff4e9] dark:from-[#231b15] dark:via-[#2c2017] dark:to-[#241b15] border border-[#f6e3d0] dark:border-[#3b2d22] px-6 sm:px-10 py-7">
        <div
          className="pointer-events-none absolute -right-12 -bottom-16 h-56 w-72 rounded-full bg-[#ffd6b0]/35 dark:bg-[#ff6b00]/10 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center justify-center">
            <StayProductiveIllustration />
          </div>

          <div className="flex-1 max-w-md text-center md:text-left">
            <h2 className="text-2xl sm:text-[28px] font-display font-bold text-[#211d1a] dark:text-[#fff6ee] tracking-tight">
              {bannerCopy.title}
            </h2>
            <p className="mt-1 text-base text-[#5c4f44] dark:text-[#d5c5b8]">
              {bannerCopy.subtitle}
            </p>

            {/* Sleek Progress Track */}
            <div className="mt-5">
              <div className="flex items-center justify-between text-xs font-semibold text-[#5c4f44] dark:text-[#d5c5b8] mb-2 tabular-nums">
                <span>Completion Progress</span>
                <span>{stats.completionRate}%</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-white/80 dark:bg-[#171310] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ff7d1a] to-[#ff6b00] transition-all duration-300"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                to="/tasks"
                className="h-10 px-5 rounded-full bg-[#ff6b00] hover:bg-[#e85d04] text-white text-sm font-semibold inline-flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Open My Tasks</span>
                <ArrowRight size={15} />
              </Link>
              <button
                type="button"
                onClick={() => openAddModal()}
                className="h-10 px-4 rounded-full bg-white/90 dark:bg-[#1e1b18] border border-[#eedbc9] dark:border-[#3d332a] text-sm font-semibold text-[#211d1a] dark:text-[#f5f2ef] hover:bg-white dark:hover:bg-[#2a2420] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={15} />
                <span>Quick Add</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Momentum & Active Tasks */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-3">
          <ProductivityChart
            completionRate={stats.completionRate}
            completedCount={stats.completed}
            totalCount={stats.total}
          />
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0e9e2] dark:border-[#2d2824]">
            <h2 className="text-base font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
              Up Next
            </h2>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#ff6b00] hover:text-[#e85d04] transition-colors"
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-semibold text-[#211d1a] dark:text-[#f5f2ef]">
                No tasks yet
              </p>
              <button
                type="button"
                onClick={() => openAddModal()}
                className="mt-3 h-9 px-4 rounded-full bg-[#ff6b00] hover:bg-[#e85d04] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Plus size={14} />
                <span>Add Task</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#f2ebe4] dark:divide-[#2a2521]">
              {recentTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={openEditModal}
                  onDelete={deleteTask}
                  compact
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
