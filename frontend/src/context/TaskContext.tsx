import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AccentTheme,
  Priority,
  Task,
  TaskDraft,
  ThemeMode,
  UserProfile,
} from '../types';
import {
  buildSampleTasks,
  getInitials,
  loadAccentTheme,
  loadFiredAlarmKeys,
  loadTasks,
  loadTheme,
  loadToken,
  loadUser,
  markAlarmKeyFired,
  removeTaskReminder,
  saveAccentTheme,
  saveTasks,
  saveTheme,
  saveToken,
  saveUser,
  SEEDED_ACCOUNTS,
  setTaskReminder,
} from '../lib/storage';
import {
  ApiError,
  apiCheckHealth,
  apiCreateTask,
  apiDeleteTask,
  apiGetTasks,
  apiLogin,
  apiRegister,
  apiUpdateTask,
} from '../lib/api';
import { addMinutesToDateAndTime, getCurrentTimeHHMM, toISODate } from '../lib/date';
import { showAlarmNotification, startAlarmLoop, stopAlarmLoop } from '../lib/alarm';

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface TaskContextValue {
  user: UserProfile | null;
  token: string | null;
  apiMode: 'live' | 'offline';
  isLoadingTasks: boolean;
  isSubmittingTask: boolean;

  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  loginWithDemoAccount: (role?: 'user' | 'admin') => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;

  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  accentTheme: AccentTheme;
  setAccentTheme: (accent: AccentTheme) => void;

  tasks: Task[];
  stats: {
    total: number;
    pending: number;
    completed: number;
    completionRate: number;
  };
  addTask: (draft: TaskDraft) => Promise<void>;
  updateTask: (id: string, draft: TaskDraft) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  resetSampleTasks: () => void;
  refreshTasks: () => Promise<void>;

  searchQuery: string;
  setSearchQuery: (query: string) => void;

  isModalOpen: boolean;
  editingTask: Task | null;
  defaultModalDate: string;
  openAddModal: (defaultDate?: string) => void;
  openEditModal: (task: Task) => void;
  closeModal: () => void;

  activeAlarm: Task | null;
  dismissAlarm: () => void;
  snoozeAlarm: (minutes?: number) => Promise<void>;
  completeAlarmTask: () => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | null>(null);

const ACCENT_PALETTES: Record<AccentTheme, { primary: string; hover: string; soft: string }> = {
  orange: { primary: '#ff6b00', hover: '#e85d04', soft: '#fff4e9' },
  amber: { primary: '#d97706', hover: '#b45309', soft: '#fffbeb' },
  emerald: { primary: '#16a34a', hover: '#15803d', soft: '#f0fdf4' },
  blue: { primary: '#2563eb', hover: '#1d4ed8', soft: '#eff6ff' },
};

function deriveNameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || 'User';
  const cleaned = localPart.replace(/[0-9._-]+/g, ' ').trim();
  if (!cleaned) return 'Namit Yadav';
  return cleaned
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => loadUser());
  const [token, setToken] = useState<string | null>(() => loadToken());
  const [apiMode, setApiMode] = useState<'live' | 'offline'>('offline');
  const [theme, setThemeState] = useState<ThemeMode>(() => loadTheme());
  const [accentTheme, setAccentThemeState] = useState<AccentTheme>(() => loadAccentTheme());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultModalDate, setDefaultModalDate] = useState(() => toISODate(new Date()));
  const [activeAlarm, setActiveAlarm] = useState<Task | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  useEffect(() => {
    const palette = ACCENT_PALETTES[accentTheme];
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', palette.primary);
    root.style.setProperty('--accent-hover', palette.hover);
    root.style.setProperty('--accent-soft', palette.soft);
    root.setAttribute('data-accent', accentTheme);
    saveAccentTheme(accentTheme);
  }, [accentTheme]);

  useEffect(() => {
    if (apiMode === 'offline') {
      saveTasks(tasks);
    }
  }, [tasks, apiMode]);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    saveToken(token);
  }, [token]);

  const refreshTasks = useCallback(async () => {
    if (!token || token.startsWith('offline-')) return;
    setIsLoadingTasks(true);
    try {
      const serverTasks = await apiGetTasks(token);
      setTasks(serverTasks);
      setApiMode('live');
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        setToken(null);
      } else if (err instanceof ApiError && err.isNetworkError) {
        setApiMode('offline');
      }
    } finally {
      setIsLoadingTasks(false);
    }
  }, [token]);

  // Check backend health and sync tasks on startup / token change
  useEffect(() => {
    let active = true;
    (async () => {
      const healthy = await apiCheckHealth();
      if (!active) return;
      if (healthy) {
        setApiMode('live');
        if (token && !token.startsWith('offline-')) {
          await refreshTasks();
        }
      } else {
        setApiMode('offline');
      }
    })();
    return () => {
      active = false;
    };
  }, [token, refreshTasks]);

  // Multi-tab session sync (TC-EDGE-004)
  useEffect(() => {
    const handleStorageSync = (e: StorageEvent) => {
      if (e.key === 'todo_app_user_v1') {
        setUser(loadUser());
      }
      if (e.key === 'todo_app_token_v1') {
        setToken(loadToken());
      }
      if (e.key === 'todo_app_tasks_v1' && apiMode === 'offline') {
        setTasks(loadTasks());
      }
    };
    window.addEventListener('storage', handleStorageSync);
    return () => window.removeEventListener('storage', handleStorageSync);
  }, [apiMode]);

  const setTheme = (nextTheme: ThemeMode) => setThemeState(nextTheme);
  const toggleTheme = () => setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  const setAccentTheme = (accent: AccentTheme) => setAccentThemeState(accent);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    const trimmedEmail = email.trim();
    try {
      const res = await apiLogin(trimmedEmail, password);
      const nextUser: UserProfile = {
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: res.user.role,
        avatarInitials: getInitials(res.user.name),
        defaultPriority: 'Medium',
        dailyGoal: 5,
      };
      setApiMode('live');
      setToken(res.access_token);
      setUser(nextUser);
      try {
        const serverTasks = await apiGetTasks(res.access_token);
        setTasks(serverTasks);
      } catch {
        setTasks([]);
      }
      return { ok: true };
    } catch (err) {
      if (err instanceof ApiError && !err.isNetworkError) {
        return { ok: false, error: err.message };
      }

      // Offline fallback when local Flask server is not running
      setApiMode('offline');
      const seeded = SEEDED_ACCOUNTS.find(
        (acc) => acc.email.toLowerCase() === trimmedEmail.toLowerCase()
      );
      if (seeded && password !== seeded.password && password !== 'todoapp123') {
        return { ok: false, error: 'Invalid email or password' };
      }

      const displayName = seeded ? seeded.name : deriveNameFromEmail(trimmedEmail);
      const role = seeded ? seeded.role : trimmedEmail.toLowerCase().includes('admin') ? 'admin' : 'user';
      setToken(`offline-${Date.now()}`);
      setUser({
        id: seeded?.id || 99,
        name: displayName,
        email: trimmedEmail,
        role,
        avatarInitials: getInitials(displayName),
        defaultPriority: 'Medium',
        dailyGoal: 5,
      });
      setTasks(loadTasks());
      return { ok: true };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResult> => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    try {
      await apiRegister(trimmedName, trimmedEmail, password);
      return await login(trimmedEmail, password);
    } catch (err) {
      if (err instanceof ApiError && !err.isNetworkError) {
        return { ok: false, error: err.message };
      }
      // Offline fallback registration
      setApiMode('offline');
      setToken(`offline-${Date.now()}`);
      setUser({
        id: Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        role: 'user',
        avatarInitials: getInitials(trimmedName),
        defaultPriority: 'Medium',
        dailyGoal: 5,
      });
      setTasks(loadTasks());
      return { ok: true };
    }
  };

  const loginWithDemoAccount = (role: 'user' | 'admin' = 'user') => {
    const displayName = role === 'admin' ? 'Admin User' : 'Namit Yadav';
    const email = role === 'admin' ? 'admin@todoapp.com' : 'namit.yadav@gmail.com';
    setToken(`offline-demo-${role}`);
    setUser({
      id: role === 'admin' ? 1 : 2,
      name: displayName,
      email,
      role,
      avatarInitials: getInitials(displayName),
      defaultPriority: 'Medium',
      dailyGoal: 5,
    });
    setTasks(loadTasks());
  };

  const logout = () => {
    stopAlarmLoop();
    setActiveAlarm(null);
    setUser(null);
    setToken(null);
    setSearchQuery('');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const nextName = updates.name ?? prev.name;
      return {
        ...prev,
        ...updates,
        avatarInitials: getInitials(nextName),
      };
    });
  };

  const addTask = async (draft: TaskDraft) => {
    if (isSubmittingTask) return;
    setIsSubmittingTask(true);
    const normalizedTime = draft.dueTime?.trim() || undefined;
    const normalizedAlarm = Boolean(normalizedTime && draft.alarmEnabled !== false);
    try {
      if (token && !token.startsWith('offline-')) {
        try {
          const created = await apiCreateTask(token, draft);
          setApiMode('live');
          setTaskReminder(created.id, {
            dueTime: normalizedTime,
            alarmEnabled: normalizedAlarm,
          });
          setTasks((prev) => [
            { ...created, dueTime: normalizedTime, alarmEnabled: normalizedAlarm },
            ...prev,
          ]);
          return;
        } catch (err) {
          if (err instanceof ApiError && !err.isNetworkError) {
            throw err;
          }
        }
      }

      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: draft.title.trim(),
        notes: draft.notes?.trim() || undefined,
        priority: draft.priority,
        dueDate: draft.dueDate || toISODate(new Date()),
        dueTime: normalizedTime,
        alarmEnabled: normalizedAlarm,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTaskReminder(newTask.id, {
        dueTime: normalizedTime,
        alarmEnabled: normalizedAlarm,
      });
      setTasks((prev) => [newTask, ...prev]);
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const updateTask = async (id: string, draft: TaskDraft) => {
    if (isSubmittingTask) return;
    setIsSubmittingTask(true);
    const normalizedTime = draft.dueTime?.trim() || undefined;
    const normalizedAlarm = Boolean(normalizedTime && draft.alarmEnabled !== false);
    try {
      if (token && !token.startsWith('offline-')) {
        try {
          await apiUpdateTask(token, id, {
            title: draft.title,
            notes: draft.notes || '',
            priority: draft.priority,
            dueDate: draft.dueDate,
          });
          setApiMode('live');
        } catch (err) {
          if (err instanceof ApiError && !err.isNetworkError) {
            throw err;
          }
        }
      }

      setTaskReminder(id, {
        dueTime: normalizedTime,
        alarmEnabled: normalizedAlarm,
      });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                title: draft.title.trim(),
                notes: draft.notes?.trim() || undefined,
                priority: draft.priority,
                dueDate: draft.dueDate,
                dueTime: normalizedTime,
                alarmEnabled: normalizedAlarm,
              }
            : task
        )
      );
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const deleteTask = async (id: string) => {
    if (token && !token.startsWith('offline-')) {
      try {
        await apiDeleteTask(token, id);
        setApiMode('live');
      } catch (err) {
        if (err instanceof ApiError && !err.isNetworkError) {
          throw err;
        }
      }
    }
    removeTaskReminder(id);
    if (activeAlarm?.id === id) {
      stopAlarmLoop();
      setActiveAlarm(null);
    }
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const toggleTask = async (id: string) => {
    const existing = tasks.find((t) => t.id === id);
    if (!existing) return;
    const nextCompleted = !existing.completed;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString() : undefined,
            }
          : task
      )
    );

    if (token && !token.startsWith('offline-')) {
      try {
        await apiUpdateTask(token, id, { completed: nextCompleted });
        setApiMode('live');
      } catch (err) {
        if (err instanceof ApiError && !err.isNetworkError) {
          throw err;
        }
      }
    }
  };

  const clearCompleted = async () => {
    const completedIds = tasks.filter((t) => t.completed).map((t) => t.id);
    setTasks((prev) => prev.filter((task) => !task.completed));
    if (token && !token.startsWith('offline-')) {
      try {
        await Promise.allSettled(completedIds.map((id) => apiDeleteTask(token, id)));
        setApiMode('live');
      } catch {
        // ignore
      }
    }
  };

  const resetSampleTasks = () => {
    setTasks(buildSampleTasks());
  };

  const openAddModal = (defaultDate?: string) => {
    setEditingTask(null);
    setDefaultModalDate(defaultDate || toISODate(new Date()));
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setDefaultModalDate(task.dueDate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Alarm scheduler: rings when a pending task's dueDate + dueTime arrives
  useEffect(() => {
    if (!user) {
      stopAlarmLoop();
      setActiveAlarm(null);
      return;
    }

    const checkAlarms = () => {
      if (activeAlarm) return;

      const now = new Date();
      const todayIso = toISODate(now);
      const nowHHMM = getCurrentTimeHHMM(now);
      const [nowH, nowM] = nowHHMM.split(':').map(Number);
      const nowTotalMins = nowH * 60 + nowM;
      const firedKeys = loadFiredAlarmKeys();

      const dueTask = tasks.find((task) => {
        if (task.completed || !task.alarmEnabled || !task.dueTime) return false;
        if (task.dueDate !== todayIso) return false;

        const [taskH, taskM] = task.dueTime.split(':').map(Number);
        if (Number.isNaN(taskH) || Number.isNaN(taskM)) return false;
        const taskTotalMins = taskH * 60 + taskM;
        const diff = nowTotalMins - taskTotalMins;

        // Ring when current minute matches or within a 2-minute window (in case tab slept briefly)
        if (diff < 0 || diff > 2) return false;

        const key = `${task.id}@${task.dueDate}@${task.dueTime}`;
        return !firedKeys.includes(key);
      });

      if (dueTask) {
        const key = `${dueTask.id}@${dueTask.dueDate}@${dueTask.dueTime}`;
        markAlarmKeyFired(key);
        setActiveAlarm(dueTask);
        startAlarmLoop();
        showAlarmNotification(
          `TO-DO APP Alarm: ${dueTask.title}`,
          `${dueTask.priority} priority task is due now.`
        );
      }
    };

    checkAlarms();
    const timer = window.setInterval(checkAlarms, 4000);
    return () => window.clearInterval(timer);
  }, [user, tasks, activeAlarm]);

  useEffect(() => {
    return () => {
      stopAlarmLoop();
    };
  }, []);

  const dismissAlarm = () => {
    stopAlarmLoop();
    setActiveAlarm(null);
  };

  const snoozeAlarm = async (minutes = 5) => {
    if (!activeAlarm) return;
    const target = activeAlarm;
    stopAlarmLoop();
    setActiveAlarm(null);

    const next = addMinutesToDateAndTime(minutes);
    await updateTask(target.id, {
      title: target.title,
      notes: target.notes,
      priority: target.priority,
      dueDate: next.dueDate,
      dueTime: next.dueTime,
      alarmEnabled: true,
    });
  };

  const completeAlarmTask = async () => {
    if (!activeAlarm) return;
    const targetId = activeAlarm.id;
    stopAlarmLoop();
    setActiveAlarm(null);
    await toggleTask(targetId);
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, pending, completed, completionRate };
  }, [tasks]);

  const value: TaskContextValue = {
    user,
    token,
    apiMode,
    isLoadingTasks,
    isSubmittingTask,
    login,
    register,
    loginWithDemoAccount,
    logout,
    updateProfile,
    theme,
    setTheme,
    toggleTheme,
    accentTheme,
    setAccentTheme,
    tasks,
    stats,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    clearCompleted,
    resetSampleTasks,
    refreshTasks,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    editingTask,
    defaultModalDate,
    openAddModal,
    openEditModal,
    closeModal,
    activeAlarm,
    dismissAlarm,
    snoozeAlarm,
    completeAlarmTask,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const ctx = useContext(TaskContext);
  if (!ctx) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return ctx;
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};
