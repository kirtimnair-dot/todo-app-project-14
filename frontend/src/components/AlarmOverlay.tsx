import { AlarmClock, Check, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTasks } from '../context/TaskContext';
import { formatDueLabel, formatTimeLabel } from '../lib/date';

export function AlarmOverlay() {
  const { activeAlarm, dismissAlarm, snoozeAlarm, completeAlarmTask } = useTasks();

  return (
    <AnimatePresence>
      {activeAlarm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#211d1a]/55 backdrop-blur-xs"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="alarm-dialog-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[420px] rounded-3xl bg-white dark:bg-[#1e1b18] border-2 border-[#ff6b00] shadow-2xl overflow-hidden p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative h-12 w-12 rounded-2xl bg-[#ff6b00] text-white flex items-center justify-center shadow-md shrink-0">
                  <span
                    className="absolute inset-0 rounded-2xl bg-[#ff6b00] animate-ping opacity-35"
                    aria-hidden="true"
                  />
                  <AlarmClock size={24} className="relative z-10" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#ff6b00]">
                    Task Alarm Ringing
                  </span>
                  <h2
                    id="alarm-dialog-title"
                    className="text-lg font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] leading-snug"
                  >
                    {activeAlarm.title}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={dismissAlarm}
                aria-label="Dismiss alarm"
                className="h-8 w-8 rounded-full inline-flex items-center justify-center text-[#7c7269] hover:text-[#211d1a] hover:bg-[#f7f1eb] dark:hover:text-white dark:hover:bg-[#2a2521] transition-colors shrink-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 rounded-2xl bg-[#fffaf5] dark:bg-[#141210] border border-[#f2ebe3] dark:border-[#2e2924] p-4 space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#5c534c] dark:text-[#cfc6be]">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-[#ff6b00]" />
                  <span>
                    {activeAlarm.dueTime
                      ? formatTimeLabel(activeAlarm.dueTime)
                      : formatDueLabel(activeAlarm.dueDate)}
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#ffe5cc] dark:bg-[#362316] text-[#e85d04] dark:text-[#ff8a32]">
                  {activeAlarm.priority} Priority
                </span>
              </div>
              {activeAlarm.notes && (
                <p className="text-xs text-[#6e655d] dark:text-[#a69d95] pt-1">
                  {activeAlarm.notes}
                </p>
              )}
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={completeAlarmTask}
                className="h-11 px-4 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check size={16} strokeWidth={2.5} />
                <span>Mark Done</span>
              </button>

              <button
                type="button"
                onClick={() => snoozeAlarm(5)}
                className="h-11 px-4 rounded-xl bg-[#fff4e9] dark:bg-[#2c2017] hover:bg-[#ffe5cc] dark:hover:bg-[#3a281b] text-[#e85d04] dark:text-[#ff8a32] text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Clock size={15} />
                <span>Snooze 5m</span>
              </button>

              <button
                type="button"
                onClick={dismissAlarm}
                className="h-11 px-4 rounded-xl border border-[#ebe3da] dark:border-[#302b27] text-[#211d1a] dark:text-[#f5f2ef] hover:bg-[#fcfaf8] dark:hover:bg-[#26221e] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
