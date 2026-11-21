import { AdminStats, AdminTask, AdminUser, Priority, Task, TaskDraft, UserRole } from '../types';
import { normalizeApiDate } from './date';
import { loadTaskReminders } from './storage';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:5000';

export class ApiError extends Error {
  status: number;
  isNetworkError: boolean;

  constructor(message: string, status = 0, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isNetworkError = isNetworkError;
  }
}

interface RawBackendTask {
  id: number | string;
  user_id?: number;
  title: string;
  description?: string | null;
  status: 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string | null;
  created_at?: string;
}

function mapPriorityToUi(priority?: string): Priority {
  const lower = (priority || 'medium').toLowerCase();
  if (lower === 'high') return 'High';
  if (lower === 'low') return 'Low';
  return 'Medium';
}

export function mapTaskFromBackend(raw: RawBackendTask): Task {
  const id = String(raw.id);
  const reminders = loadTaskReminders();
  const reminder = reminders[id];
  return {
    id,
    title: raw.title,
    notes: raw.description || undefined,
    priority: mapPriorityToUi(raw.priority),
    dueDate: normalizeApiDate(raw.due_date),
    dueTime: reminder?.dueTime,
    alarmEnabled: reminder?.alarmEnabled,
    completed: raw.status === 'completed',
    createdAt: raw.created_at || new Date().toISOString(),
  };
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError('Unable to reach backend API server.', 0, true);
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    data = {};
  }

  if (!response.ok) {
    const message =
      typeof data.message === 'string'
        ? data.message
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, false);
  }

  return data as T;
}

export async function apiCheckHealth(): Promise<boolean> {
  try {
    const res = await request<{ status?: string }>('/api/health', { method: 'GET' });
    return res.status === 'healthy';
  } catch {
    return false;
  }
}

export async function apiRegister(
  name: string,
  email: string,
  password: string
): Promise<{ message: string }> {
  return request<{ message: string }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

export async function apiLogin(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiGetTasks(token: string): Promise<Task[]> {
  const res = await request<{ tasks: RawBackendTask[] }>('/api/tasks', { method: 'GET' }, token);
  return (res.tasks || []).map(mapTaskFromBackend);
}

export async function apiCreateTask(token: string, draft: TaskDraft): Promise<Task> {
  const res = await request<{ task: RawBackendTask }>(
    '/api/tasks',
    {
      method: 'POST',
      body: JSON.stringify({
        title: draft.title.trim(),
        description: draft.notes?.trim() || '',
        priority: draft.priority.toLowerCase(),
        due_date: draft.dueDate || null,
      }),
    },
    token
  );
  return mapTaskFromBackend(res.task);
}

export async function apiUpdateTask(
  token: string,
  taskId: string,
  updates: Partial<{
    title: string;
    notes: string;
    priority: Priority;
    dueDate: string;
    completed: boolean;
  }>
): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title.trim();
  if (updates.notes !== undefined) payload.description = updates.notes.trim();
  if (updates.priority !== undefined) payload.priority = updates.priority.toLowerCase();
  if (updates.dueDate !== undefined) payload.due_date = updates.dueDate || null;
  if (updates.completed !== undefined) {
    payload.status = updates.completed ? 'completed' : 'pending';
  }

  await request<{ message: string }>(
    `/api/tasks/${encodeURIComponent(taskId)}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token
  );
}

export async function apiDeleteTask(token: string, taskId: string): Promise<void> {
  await request<{ message: string }>(
    `/api/tasks/${encodeURIComponent(taskId)}`,
    { method: 'DELETE' },
    token
  );
}

// Admin RBAC endpoints (/api/admin/*)
export async function apiAdminGetStats(token: string): Promise<AdminStats> {
  const res = await request<{ statistics: AdminStats }>(
    '/api/admin/stats',
    { method: 'GET' },
    token
  );
  return res.statistics;
}

export async function apiAdminGetUsers(token: string): Promise<AdminUser[]> {
  const res = await request<{ users: AdminUser[] }>(
    '/api/admin/users',
    { method: 'GET' },
    token
  );
  return res.users || [];
}

export async function apiAdminUpdateUserRole(
  token: string,
  userId: number,
  role: UserRole
): Promise<void> {
  await request<{ message: string }>(
    `/api/admin/users/${userId}/role`,
    {
      method: 'PUT',
      body: JSON.stringify({ role }),
    },
    token
  );
}

export async function apiAdminDeleteUser(token: string, userId: number): Promise<void> {
  await request<{ message: string }>(
    `/api/admin/users/${userId}`,
    { method: 'DELETE' },
    token
  );
}

export async function apiAdminGetTasks(token: string): Promise<AdminTask[]> {
  const res = await request<{ tasks: AdminTask[] }>(
    '/api/admin/tasks',
    { method: 'GET' },
    token
  );
  return res.tasks || [];
}
