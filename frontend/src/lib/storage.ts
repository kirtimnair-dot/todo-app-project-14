import { AccentTheme, AdminTask, AdminUser, Task, ThemeMode, UserProfile } from '../types';
import { addDays, toISODate } from './date';

const TASKS_KEY = 'todo_app_tasks_v1';
const USER_KEY = 'todo_app_user_v1';
const TOKEN_KEY = 'todo_app_token_v1';
const THEME_KEY = 'todo_app_theme_v1';
const ACCENT_KEY = 'todo_app_accent_v1';

export const SEEDED_ACCOUNTS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@todoapp.com',
    password: 'Password123!',
    role: 'admin' as const,
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'Password123!',
    role: 'user' as const,
  },
  {
    id: 3,
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: 'Password123!',
    role: 'user' as const,
  },
];

export function buildSampleTasks(): Task[] {
  const today = new Date();
  return [
    {
      id: 'task-1',
      title: 'Complete project report',
      notes: 'Finalize Q4 deliverables and attach weekly metrics summary.',
      priority: 'High',
      dueDate: toISODate(today),
      completed: true,
      createdAt: addDays(today, -3).toISOString(),
      completedAt: addDays(today, -1).toISOString(),
    },
    {
      id: 'task-2',
      title: 'Study DSA',
      notes: 'Review dynamic programming patterns and graph shortest-path problems.',
      priority: 'Medium',
      dueDate: toISODate(addDays(today, 1)),
      completed: true,
      createdAt: addDays(today, -2).toISOString(),
      completedAt: today.toISOString(),
    },
    {
      id: 'task-3',
      title: 'Read a book',
      notes: 'Read two chapters of Designing Data-Intensive Applications.',
      priority: 'Low',
      dueDate: toISODate(addDays(today, 2)),
      completed: false,
      createdAt: addDays(today, -2).toISOString(),
    },
    {
      id: 'task-4',
      title: 'Plan next hackathon',
      notes: 'Draft architecture outline, team roles, and demo timeline.',
      priority: 'Medium',
      dueDate: toISODate(addDays(today, 3)),
      completed: false,
      createdAt: addDays(today, -1).toISOString(),
    },
    {
      id: 'task-5',
      title: 'Workout',
      notes: '45-minute strength & mobility session.',
      priority: 'Low',
      dueDate: toISODate(addDays(today, 4)),
      completed: true,
      createdAt: addDays(today, -1).toISOString(),
      completedAt: today.toISOString(),
    },
  ];
}

export function buildOfflineAdminUsers(): AdminUser[] {
  return SEEDED_ACCOUNTS.map((acc, idx) => ({
    id: acc.id,
    name: acc.name,
    email: acc.email,
    role: acc.role,
    created_at: addDays(new Date(), -(30 - idx * 8)).toISOString(),
  }));
}

export function buildOfflineAdminTasks(userTasks: Task[], currentUser: UserProfile | null): AdminTask[] {
  const mappedCurrent: AdminTask[] = userTasks.map((t, i) => ({
    id: Number(t.id.replace(/\D/g, '')) || 100 + i,
    user_id: currentUser?.id || 1,
    user_name: currentUser?.name || 'Admin User',
    user_email: currentUser?.email || 'admin@todoapp.com',
    title: t.title,
    description: t.notes || null,
    status: t.completed ? 'completed' : 'pending',
    priority: t.priority.toLowerCase() as 'low' | 'medium' | 'high',
    due_date: t.dueDate,
    created_at: t.createdAt,
  }));

  const otherSeeded: AdminTask[] = [
    {
      id: 201,
      user_id: 2,
      user_name: 'Jane Doe',
      user_email: 'jane.doe@example.com',
      title: 'Design landing page mockup',
      description: 'Create responsive wireframes in Figma for desktop and mobile.',
      status: 'pending',
      priority: 'high',
      due_date: toISODate(addDays(new Date(), 2)),
      created_at: addDays(new Date(), -2).toISOString(),
    },
    {
      id: 202,
      user_id: 3,
      user_name: 'John Smith',
      user_email: 'john.smith@example.com',
      title: 'Implement JWT authentication flow',
      description: 'Develop register and login endpoints with bcrypt password hashing.',
      status: 'completed',
      priority: 'high',
      due_date: toISODate(addDays(new Date(), -1)),
      created_at: addDays(new Date(), -4).toISOString(),
    },
  ];

  return [...mappedCurrent, ...otherSeeded];
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'TD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY) || localStorage.getItem('taskflow_tasks_v1');
    if (!raw) {
      const defaults = buildSampleTasks();
      localStorage.setItem(TASKS_KEY, JSON.stringify(defaults));
      return defaults;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : buildSampleTasks();
  } catch {
    return buildSampleTasks();
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (!parsed || !parsed.email) return null;
    return {
      id: parsed.id,
      name: parsed.name || 'User',
      email: parsed.email,
      role: parsed.role === 'admin' ? 'admin' : 'user',
      avatarInitials: parsed.avatarInitials || getInitials(parsed.name || parsed.email),
      defaultPriority: parsed.defaultPriority || 'Medium',
      dailyGoal: parsed.dailyGoal || 5,
    };
  } catch {
    return null;
  }
}

export function saveUser(user: UserProfile | null): void {
  try {
    if (!user) {
      localStorage.removeItem(USER_KEY);
    } else {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function loadToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token: string | null): void {
  try {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function loadTheme(): ThemeMode {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (raw === 'dark' || raw === 'light') return raw;
    return 'light';
  } catch {
    return 'light';
  }
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Ignore storage quota errors
  }
}

export interface TaskReminderMeta {
  dueTime?: string;
  alarmEnabled?: boolean;
}

const REMINDERS_KEY = 'todo_app_reminders_v1';
const FIRED_ALARMS_KEY = 'todo_app_fired_alarms_v1';

export function loadTaskReminders(): Record<string, TaskReminderMeta> {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, TaskReminderMeta>) : {};
  } catch {
    return {};
  }
}

export function saveTaskReminders(map: Record<string, TaskReminderMeta>): void {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage quota errors
  }
}

export function setTaskReminder(taskId: string, meta: TaskReminderMeta): void {
  const map = loadTaskReminders();
  if (!meta.dueTime && !meta.alarmEnabled) {
    delete map[taskId];
  } else {
    map[taskId] = meta;
  }
  saveTaskReminders(map);
}

export function removeTaskReminder(taskId: string): void {
  const map = loadTaskReminders();
  if (taskId in map) {
    delete map[taskId];
    saveTaskReminders(map);
  }
}

export function loadFiredAlarmKeys(): string[] {
  try {
    const raw = localStorage.getItem(FIRED_ALARMS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markAlarmKeyFired(key: string): void {
  try {
    const existing = loadFiredAlarmKeys();
    if (!existing.includes(key)) {
      const next = [...existing.slice(-50), key];
      localStorage.setItem(FIRED_ALARMS_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore storage quota errors
  }
}

export function loadAccentTheme(): AccentTheme {
  try {
    const raw = localStorage.getItem(ACCENT_KEY);
    if (raw === 'orange' || raw === 'amber' || raw === 'emerald' || raw === 'blue') {
      return raw;
    }
    return 'orange';
  } catch {
    return 'orange';
  }
}

export function saveAccentTheme(accent: AccentTheme): void {
  try {
    localStorage.setItem(ACCENT_KEY, accent);
  } catch {
    // Ignore storage quota errors
  }
}
