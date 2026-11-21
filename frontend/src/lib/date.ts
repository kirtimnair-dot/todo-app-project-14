export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeApiDate(value?: string | null): string {
  if (!value) return toISODate(new Date());
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const isoMatch = value.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoMatch) return isoMatch[1];
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return toISODate(parsed);
  }
  return toISODate(new Date());
}

export function addDays(base: Date, days: number): Date {
  const copy = new Date(base.getFullYear(), base.getMonth(), base.getDate());
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function getCurrentTimeHHMM(date = new Date()): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function addMinutesToDateAndTime(minutesToAdd: number, base = new Date()): {
  dueDate: string;
  dueTime: string;
} {
  const next = new Date(base.getTime() + minutesToAdd * 60_000);
  return {
    dueDate: toISODate(next),
    dueTime: getCurrentTimeHHMM(next),
  };
}

export function formatTimeLabel(time?: string): string {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return '';
  const [hStr, mStr] = time.split(':');
  const h = Number(hStr);
  const m = Number(mStr);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function formatDueLabel(iso: string, time?: string): string {
  if (!iso) return 'No date';
  const today = toISODate(new Date());
  const tomorrow = toISODate(addDays(new Date(), 1));
  const yesterday = toISODate(addDays(new Date(), -1));

  let datePart: string;
  if (iso === today) datePart = 'Today';
  else if (iso === tomorrow) datePart = 'Tomorrow';
  else if (iso === yesterday) datePart = 'Yesterday';
  else {
    const date = parseISODate(iso);
    datePart = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  const timePart = formatTimeLabel(time);
  return timePart ? `${datePart} · ${timePart}` : datePart;
}

export function formatLongDate(iso: string): string {
  const date = parseISODate(iso);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function isOverdue(iso: string, completed: boolean, time?: string): boolean {
  if (completed || !iso) return false;
  const now = new Date();
  const today = toISODate(now);
  if (iso < today) return true;
  if (iso === today && time && /^\d{2}:\d{2}$/.test(time)) {
    return time < getCurrentTimeHHMM(now);
  }
  return false;
}

export function getTimeGreeting(): { greeting: string; period: 'morning' | 'afternoon' | 'evening' } {
  const hour = new Date().getHours();
  if (hour < 12) return { greeting: 'Good Morning', period: 'morning' };
  if (hour < 17) return { greeting: 'Good Afternoon', period: 'afternoon' };
  return { greeting: 'Good Evening', period: 'evening' };
}

export interface CalendarCell {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
}

export function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const startWeekday = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const todayIso = toISODate(new Date());

  const cells: CalendarCell[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    const iso = toISODate(d);
    cells.push({ iso, day: d.getDate(), inCurrentMonth: false, isToday: iso === todayIso });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const iso = toISODate(d);
    cells.push({ iso, day, inCurrentMonth: true, isToday: iso === todayIso });
  }

  const remaining = (7 - (cells.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    const iso = toISODate(d);
    cells.push({ iso, day: d.getDate(), inCurrentMonth: false, isToday: iso === todayIso });
  }

  return cells;
}
