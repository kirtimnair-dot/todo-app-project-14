import { AlarmClock, Calendar as CalendarIcon, Check, Pencil, Trash2 } from 'lucide-react';
import { Priority, Task } from '../types';
import { formatDueLabel, isOverdue } from '../lib/date';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
}

const PRIORITY_STYLES: Record<Priority, { box: string; dot: string }> = {
  High: {
    box: 'bg-[#fdecec] text-[#c8231c] dark:bg-[#3a1d1d] dark:text-[#f87171]',
    dot: 'bg-[#dc2626]',
  },
  Medium: {
    box: 'bg-[#fff5db] text-[#a14b07] dark:bg-[#362814] dark:text-[#fbbf24]',
    dot: 'bg-[#d97706]',
  },
  Low: {
    box: 'bg-[#eaf7ee] text-[#15803d] dark:bg-[#173020] dark:text-[#4ade80]',
    dot: 'bg-[#16a34a]',
  },
};

export function TaskRow({ task, onToggle, onEdit, onDelete, compact = false }: TaskRowProps) {
  const overdue = isOverdue(task.dueDate, task.completed, task.dueTime);
  const dueLabel = formatDueLabel(task.dueDate, task.dueTime);
  const pStyle = PRIORITY_STYLES[task.priority];
  const hasAlarm = Boolean(task.dueTime && task.alarmEnabled && !task.completed);

  return (
    <div
      className={`group flex items-center justify-between gap-3 sm:gap-4 transition-colors duration-150 hover:bg-[#fffaf4] dark:hover:bg-[#231f1c] ${
        compact ? 'px-4 py-3' : 'px-4 sm:px-6 py-3.5 sm:py-4'
      }`}
    >
      {/* Left: Toggle + Title + Mobile Meta */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? `Mark "${task.title}" as pending` : `Mark "${task.title}" as completed`}
          aria-pressed={task.completed}
          className="h-10 w-10 -ml-2 flex items-center justify-center rounded-full shrink-0 transition-transform duration-150 active:scale-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff6b00] cursor-pointer"
        >
          <span
            className={`h-6 w-6 rounded-full flex items-center justify-center transition-all duration-150 ${
              task.completed
                ? 'bg-[#1b7a3d] text-white shadow-xs scale-100'
                : 'border-2 border-[#d9d1c9] bg-white group-hover:border-[#ff6b00] dark:border-[#4b453f] dark:bg-transparent dark:group-hover:border-[#ff8a32]'
            }`}
          >
            {task.completed && <Check size={14} strokeWidth={3} />}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-[15px] font-medium truncate transition-colors ${
              task.completed
                ? 'text-[#7c7269] line-through decoration-[#b8afa7] dark:text-[#8f857b] dark:decoration-[#5e564e]'
                : 'text-[#211d1a] dark:text-[#f5f2ef]'
            }`}
          >
            {task.title}
          </p>
          {!compact && task.notes && (
            <p className="text-xs text-[#7c7269] dark:text-[#9b9187] truncate mt-0.5">
              {task.notes}
            </p>
          )}
          {/* Mobile meta line so due date & time are never hidden on phones */}
          <div className="flex sm:hidden items-center gap-1.5 mt-1 text-[11px] text-[#7c7269] dark:text-[#9b9187]">
            {hasAlarm && <AlarmClock size={11} className="text-[#ff6b00] shrink-0" />}
            <span className={overdue ? 'text-[#dc2626] dark:text-[#f87171] font-medium' : ''}>
              {dueLabel}
            </span>
            <span aria-hidden="true">·</span>
            <span>{task.priority}</span>
          </div>
        </div>
      </div>

      {/* Right: Priority, Due Date + Time, Action Buttons */}
      <div className="flex items-center gap-2.5 sm:gap-5 shrink-0">
        <span
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${pStyle.box}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${pStyle.dot}`} aria-hidden="true" />
          {task.priority}
        </span>

        {!compact && (
          <span
            className={`hidden md:inline-flex items-center gap-1.5 text-xs font-medium min-w-[120px] tabular-nums whitespace-nowrap ${
              overdue
                ? 'text-[#dc2626] dark:text-[#f87171]'
                : 'text-[#5c534c] dark:text-[#a69d95]'
            }`}
          >
            {hasAlarm ? (
              <AlarmClock size={14} className="shrink-0 text-[#ff6b00]" />
            ) : (
              <CalendarIcon size={14} className="shrink-0 opacity-80" />
            )}
            <span>{dueLabel}</span>
          </span>
        )}

        {compact && (
          <span
            className={`hidden sm:inline-flex items-center gap-1 text-xs font-medium tabular-nums whitespace-nowrap ${
              overdue ? 'text-[#dc2626] dark:text-[#f87171]' : 'text-[#7c7269] dark:text-[#a69d95]'
            }`}
          >
            {hasAlarm && <AlarmClock size={12} className="text-[#ff6b00]" />}
            <span>{dueLabel}</span>
          </span>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit "${task.title}"`}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#efe7df] dark:border-[#302b27] text-[#5c534c] hover:text-[#211d1a] hover:bg-[#f7f1eb] dark:text-[#a69d95] dark:hover:text-white dark:hover:bg-[#2d2824] transition-colors cursor-pointer"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Delete "${task.title}"`}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-[#fde4e4] dark:border-[#422323] text-[#dc2626] hover:bg-[#fef2f2] dark:text-[#f87171] dark:hover:bg-[#3a1d1d] transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
