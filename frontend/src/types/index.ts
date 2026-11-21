export type Priority = 'Low' | 'Medium' | 'High';

export type TaskStatus = 'pending' | 'completed';

export type TaskFilter = 'all' | 'pending' | 'completed';

export type ThemeMode = 'light' | 'dark';

export type AccentTheme = 'orange' | 'amber' | 'emerald' | 'blue';

export type UserRole = 'user' | 'admin';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  priority: Priority;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  alarmEnabled?: boolean;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id?: number;
  name: string;
  email: string;
  role: UserRole;
  avatarInitials: string;
  defaultPriority: Priority;
  dailyGoal: number;
}

export interface TaskDraft {
  title: string;
  notes?: string;
  priority: Priority;
  dueDate: string;
  dueTime?: string;
  alarmEnabled?: boolean;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface AdminTask {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_tasks: number;
  pending_tasks: number;
  completed_tasks: number;
}
