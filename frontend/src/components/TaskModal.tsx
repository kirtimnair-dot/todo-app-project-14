import React, { useEffect, useRef, useState } from 'react';
import { AlarmClock, Calendar as CalendarIcon, Clock, Pencil, Plus, Volume2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Priority } from '../types';
import { useTasks } from '../context/TaskContext';
import { addDays, addMinutesToDateAndTime, toISODate } from '../lib/date';
import {
  playAlarmChime,
  requestAlarmNotificationPermission,
  unlockAlarmAudio,
} from '../lib/alarm';

const PRIORITIES: { value: Priority; dot: string }[] = [
  { value: 'High', dot: 'bg-[#ef4444]' },
  { value: 'Medium', dot: 'bg-[#f59e0b]' },
  { value: 'Low', dot: 'bg-[#16a34a]' },
];

export function TaskModal() {
  const {
    isModalOpen,
    editingTask,
    defaultModalDate,
    user,
    isSubmittingTask,
    closeModal,
    addTask,
    updateTask,
  } = useTasks();

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [error, setError] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isModalOpen) return;

    if (editingTask) {
      setTitle(editingTask.title);
      setNotes(editingTask.notes || '');
      setPriority(editingTask.priority);
      setDueDate(editingTask.dueDate);
      setDueTime(editingTask.dueTime || '');
      setAlarmEnabled(Boolean(editingTask.alarmEnabled && editingTask.dueTime));
    } else {
      setTitle('');
      setNotes('');
      setPriority(user?.defaultPriority || 'High');
      setDueDate(defaultModalDate || toISODate(new Date()));
      setDueTime('');
      setAlarmEnabled(false);
    }
    setError('');

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 40);

    return () => window.clearTimeout(timer);
  }, [isModalOpen, editingTask, defaultModalDate, user?.defaultPriority]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal]);

  const todayIso = toISODate(new Date());
  const tomorrowIso = toISODate(addDays(new Date(), 1));

  const applyTimeSelection = (nextTime: string) => {
    setDueTime(nextTime);
    if (nextTime) {
      setAlarmEnabled(true);
      unlockAlarmAudio();
    } else {
      setAlarmEnabled(false);
    }
  };

  const applyQuickMinutes = (minutes: number) => {
    const next = addMinutesToDateAndTime(minutes);
    setDueDate(next.dueDate);
    setDueTime(next.dueTime);
    setAlarmEnabled(true);
    unlockAlarmAudio();
    requestAlarmNotificationPermission();
  };

  const handleToggleAlarm = () => {
    if (!dueTime) {
      const next = addMinutesToDateAndTime(15);
      setDueDate(next.dueDate);
      setDueTime(next.dueTime);
      setAlarmEnabled(true);
      unlockAlarmAudio();
      requestAlarmNotificationPermission();
      return;
    }
    const nextEnabled = !alarmEnabled;
    setAlarmEnabled(nextEnabled);
    if (nextEnabled) {
      unlockAlarmAudio();
      requestAlarmNotificationPermission();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingTask) return;

    if (!title.trim()) {
      setError('Please enter a task title.');
      inputRef.current?.focus();
      return;
    }

    if (alarmEnabled) {
      unlockAlarmAudio();
      requestAlarmNotificationPermission();
    }

    const payload = {
      title: title.trim(),
      notes: notes.trim(),
      priority,
      dueDate: dueDate || todayIso,
      dueTime: dueTime || undefined,
      alarmEnabled: Boolean(dueTime && alarmEnabled),
    };

    try {
      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await addTask(payload);
      }
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save task.');
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211d1a]/50 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[460px] rounded-3xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#302b27] shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <span className="h-9 w-9 rounded-full bg-[#ff6b00] text-white inline-flex items-center justify-center shadow-xs">
                  {editingTask ? <Pencil size={16} /> : <Plus size={20} strokeWidth={2.5} />}
                </span>
                <h2
                  id="task-modal-title"
                  className="text-xl font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]"
                >
                  {editingTask ? 'Edit Task' : 'Add New Task'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close modal"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full text-[#6e655d] hover:text-[#211d1a] hover:bg-[#f7f1eb] dark:text-[#a69d95] dark:hover:text-white dark:hover:bg-[#2a2521] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="px-7 pb-7 space-y-5">
              {/* Task Title */}
              <div>
                <label htmlFor="task-title-input" className="sr-only">
                  Task Title
                </label>
                <input
                  ref={inputRef}
                  id="task-title-input"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter task title..."
                  className="w-full h-12 px-4 rounded-xl border border-[#ebe3da] dark:border-[#38322d] bg-[#fcfaf8] dark:bg-[#141210] text-sm text-[#211d1a] dark:text-[#f5f2ef] placeholder:text-[#9b9187] focus:bg-white dark:focus:bg-[#191613] focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 focus:outline-none transition-colors"
                />
                {error && (
                  <p className="mt-1.5 text-xs font-medium text-[#dc2626] dark:text-[#f87171]">
                    {error}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div>
                <span className="block text-sm font-semibold text-[#211d1a] dark:text-[#e9e3dd] mb-2">
                  Priority
                </span>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRIORITIES.map(({ value, dot }) => {
                    const active = priority === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPriority(value)}
                        aria-pressed={active}
                        className={`h-10 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all duration-150 whitespace-nowrap cursor-pointer ${
                          active
                            ? 'bg-[#ff6b00] text-white shadow-xs'
                            : 'bg-[#f6f1ec] text-[#4d453f] hover:bg-[#ede4db] dark:bg-[#2a2521] dark:text-[#d5cdc5] dark:hover:bg-[#352f2a]'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${active ? 'bg-white' : dot}`}
                          aria-hidden="true"
                        />
                        <span>{value}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Due Date & Time */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-[#211d1a] dark:text-[#e9e3dd]">
                    Due Date &amp; Time
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setDueDate(todayIso)}
                      className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        dueDate === todayIso
                          ? 'bg-[#fff4e9] text-[#e85d04] dark:bg-[#362316] dark:text-[#ff8a32]'
                          : 'text-[#6e655d] hover:text-[#211d1a] dark:text-[#a69d95] dark:hover:text-white'
                      }`}
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={() => setDueDate(tomorrowIso)}
                      className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                        dueDate === tomorrowIso
                          ? 'bg-[#fff4e9] text-[#e85d04] dark:bg-[#362316] dark:text-[#ff8a32]'
                          : 'text-[#6e655d] hover:text-[#211d1a] dark:text-[#a69d95] dark:hover:text-white'
                      }`}
                    >
                      Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickMinutes(5)}
                      className="px-2 py-0.5 rounded-md text-xs font-medium text-[#6e655d] hover:text-[#ff6b00] dark:text-[#a69d95] dark:hover:text-[#ff8a32] transition-colors cursor-pointer"
                    >
                      +5m
                    </button>
                    <button
                      type="button"
                      onClick={() => applyQuickMinutes(60)}
                      className="px-2 py-0.5 rounded-md text-xs font-medium text-[#6e655d] hover:text-[#ff6b00] dark:text-[#a69d95] dark:hover:text-[#ff8a32] transition-colors cursor-pointer"
                    >
                      +1h
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="relative">
                    <CalendarIcon
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e655d] pointer-events-none"
                    />
                    <input
                      id="task-due-date"
                      type="date"
                      aria-label="Due Date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full h-11 pl-10 pr-3 rounded-xl border border-[#ebe3da] dark:border-[#38322d] bg-[#fcfaf8] dark:bg-[#141210] text-sm text-[#211d1a] dark:text-[#f5f2ef] focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 focus:outline-none tabular-nums"
                    />
                  </div>

                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6e655d] pointer-events-none"
                    />
                    <input
                      id="task-due-time"
                      type="time"
                      aria-label="Due Time"
                      value={dueTime}
                      onChange={(e) => applyTimeSelection(e.target.value)}
                      className="w-full h-11 pl-10 pr-8 rounded-xl border border-[#ebe3da] dark:border-[#38322d] bg-[#fcfaf8] dark:bg-[#141210] text-sm text-[#211d1a] dark:text-[#f5f2ef] focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 focus:outline-none tabular-nums"
                    />
                    {dueTime && (
                      <button
                        type="button"
                        onClick={() => applyTimeSelection('')}
                        aria-label="Clear time"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full inline-flex items-center justify-center text-[#7c7269] hover:text-[#211d1a] dark:hover:text-white cursor-pointer"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Alarm Reminder Row */}
                <div className="flex items-center justify-between gap-3 rounded-xl border border-[#ebe3da] dark:border-[#302b27] bg-[#fcfaf8] dark:bg-[#141210] px-3.5 py-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`h-8 w-8 rounded-lg inline-flex items-center justify-center shrink-0 transition-colors ${
                        alarmEnabled && dueTime
                          ? 'bg-[#fff4e9] text-[#ff6b00] dark:bg-[#362316] dark:text-[#ff8a32]'
                          : 'bg-[#f3ede6] text-[#7c7269] dark:bg-[#26221e] dark:text-[#a69d95]'
                      }`}
                    >
                      <AlarmClock size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#211d1a] dark:text-[#f5f2ef]">
                        Ring Alarm Reminder
                      </p>
                      <p className="text-[11px] text-[#7c7269] dark:text-[#a69d95] truncate">
                        {dueTime
                          ? alarmEnabled
                            ? `Alarm set for ${dueTime}`
                            : 'Alarm paused for this task'
                          : 'Select a time or tap toggle (+15m)'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        unlockAlarmAudio();
                        playAlarmChime();
                      }}
                      title="Test alarm sound"
                      aria-label="Test alarm sound"
                      className="h-8 px-2.5 rounded-lg border border-[#ebe3da] dark:border-[#302b27] text-[11px] font-semibold text-[#5c534c] dark:text-[#cfc6be] hover:text-[#ff6b00] hover:border-[#ff6b00]/40 inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Volume2 size={13} />
                      <span>Test</span>
                    </button>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(alarmEnabled && dueTime)}
                      aria-label="Toggle task alarm"
                      onClick={handleToggleAlarm}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                        alarmEnabled && dueTime
                          ? 'bg-[#ff6b00]'
                          : 'bg-[#d8cfc6] dark:bg-[#3d3731]'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                          alarmEnabled && dueTime ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Optional Note */}
              <div>
                <label htmlFor="task-notes-input" className="sr-only">
                  Notes (optional)
                </label>
                <input
                  id="task-notes-input"
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional note or description..."
                  className="w-full h-10 px-4 rounded-xl border border-[#ebe3da] dark:border-[#38322d] bg-[#fcfaf8] dark:bg-[#141210] text-xs sm:text-sm text-[#211d1a] dark:text-[#f5f2ef] placeholder:text-[#9b9187] focus:bg-white dark:focus:bg-[#191613] focus:border-[#ff6b00] focus:outline-none transition-colors"
                />
              </div>

              {/* Full-width Submit CTA with double-click guard (TC-EDGE-005) */}
              <button
                type="submit"
                disabled={isSubmittingTask}
                className="w-full h-12 rounded-xl bg-[#ff6b00] hover:bg-[#e85d04] disabled:opacity-60 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer"
              >
                {isSubmittingTask ? 'Saving...' : editingTask ? 'Save Changes' : 'Add Task'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
