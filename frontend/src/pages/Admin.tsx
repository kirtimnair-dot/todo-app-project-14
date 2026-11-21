import { useCallback, useEffect, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { AdminStats, AdminTask, AdminUser, UserRole } from '../types';
import {
  apiAdminDeleteUser,
  apiAdminGetStats,
  apiAdminGetTasks,
  apiAdminGetUsers,
  apiAdminUpdateUserRole,
  ApiError,
} from '../lib/api';
import { buildOfflineAdminTasks, buildOfflineAdminUsers } from '../lib/storage';
import { formatDueLabel, normalizeApiDate } from '../lib/date';

export function Admin() {
  const { user, token, apiMode, tasks: localTasks } = useTasks();

  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    total_tasks: 0,
    pending_tasks: 0,
    completed_tasks: 0,
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [allTasks, setAllTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'users' | 'tasks'>('users');

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setFeedback('');

    if (apiMode === 'live' && token && !token.startsWith('offline-')) {
      try {
        const [fetchedStats, fetchedUsers, fetchedTasks] = await Promise.all([
          apiAdminGetStats(token),
          apiAdminGetUsers(token),
          apiAdminGetTasks(token),
        ]);
        setStats(fetchedStats);
        setUsers(fetchedUsers);
        setAllTasks(fetchedTasks);
        setLoading(false);
        return;
      } catch (err) {
        if (err instanceof ApiError && !err.isNetworkError) {
          setFeedback(err.message);
          setLoading(false);
          return;
        }
      }
    }

    // Offline fallback view matching MySQL seed structure
    const offlineUsers = buildOfflineAdminUsers();
    const offlineTasks = buildOfflineAdminTasks(localTasks, user);
    setUsers(offlineUsers);
    setAllTasks(offlineTasks);
    setStats({
      total_users: offlineUsers.length,
      total_tasks: offlineTasks.length,
      pending_tasks: offlineTasks.filter((t) => t.status === 'pending').length,
      completed_tasks: offlineTasks.filter((t) => t.status === 'completed').length,
    });
    setLoading(false);
  }, [apiMode, token, localTasks, user]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleRoleChange = async (targetUser: AdminUser, nextRole: UserRole) => {
    if (targetUser.role === nextRole) return;
    setFeedback('');

    if (apiMode === 'live' && token && !token.startsWith('offline-')) {
      try {
        await apiAdminUpdateUserRole(token, targetUser.id, nextRole);
      } catch (err) {
        if (err instanceof ApiError) {
          setFeedback(err.message);
          return;
        }
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === targetUser.id ? { ...u, role: nextRole } : u))
    );
    setFeedback(`Updated ${targetUser.name}'s role to ${nextRole}.`);
  };

  const handleDeleteUser = async (targetUser: AdminUser) => {
    if (targetUser.id === user?.id) {
      setFeedback('You cannot delete your own account.');
      return;
    }
    setFeedback('');

    if (apiMode === 'live' && token && !token.startsWith('offline-')) {
      try {
        await apiAdminDeleteUser(token, targetUser.id);
      } catch (err) {
        if (err instanceof ApiError) {
          setFeedback(err.message);
          return;
        }
      }
    }

    setUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
    setAllTasks((prev) => prev.filter((t) => t.user_id !== targetUser.id));
    setStats((prev) => ({
      ...prev,
      total_users: Math.max(0, prev.total_users - 1),
    }));
    setFeedback(`Removed user ${targetUser.name}.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#ff6b00] mb-1">
            <ShieldCheck size={15} />
            <span>Administrator Console</span>
          </div>
          <h1 className="text-2xl sm:text-[32px] font-display font-bold tracking-tight text-[#211d1a] dark:text-[#f5f2ef]">
            Admin Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-[#6e655d] dark:text-[#a69d95]">
            System-wide user management, role permissions, and task overview
          </p>
        </div>

        <button
          type="button"
          onClick={loadAdminData}
          disabled={loading}
          className="h-10 px-4 rounded-full border border-[#ebe3da] dark:border-[#302b27] bg-white dark:bg-[#1e1b18] text-xs sm:text-sm font-semibold text-[#211d1a] dark:text-[#f5f2ef] hover:border-[#ff6b00]/40 inline-flex items-center gap-2 transition-colors self-start cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {feedback && (
        <div className="rounded-xl bg-[#fff4e9] dark:bg-[#2c2017] border border-[#ffd8b8] dark:border-[#4b3423] px-4 py-3 text-xs sm:text-sm font-medium text-[#211d1a] dark:text-[#ffe5cc]">
          {feedback}
        </div>
      )}

      {/* 4 System Stats Cards */}
      <section aria-label="System statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#f0e9e2] dark:border-[#2e2924] p-5 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-[#eff6ff] dark:bg-[#1c2a3a] text-[#2563eb] dark:text-[#60a5fa] inline-flex items-center justify-center">
            <Users size={18} />
          </div>
          <p className="mt-4 text-3xl font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] tabular-nums">
            {stats.total_users}
          </p>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#6e655d] dark:text-[#a69d95]">
            Total Users
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#f0e9e2] dark:border-[#2e2924] p-5 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-[#dff2e1] dark:bg-[#193521] text-[#2e7d32] dark:text-[#4ade80] inline-flex items-center justify-center">
            <ListTodo size={18} />
          </div>
          <p className="mt-4 text-3xl font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] tabular-nums">
            {stats.total_tasks}
          </p>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#6e655d] dark:text-[#a69d95]">
            Total Tasks
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#f0e9e2] dark:border-[#2e2924] p-5 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-[#ffead6] dark:bg-[#382315] text-[#f56a00] dark:text-[#ff8a32] inline-flex items-center justify-center">
            <Clock size={18} />
          </div>
          <p className="mt-4 text-3xl font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] tabular-nums">
            {stats.pending_tasks}
          </p>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#6e655d] dark:text-[#a69d95]">
            Pending Tasks
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#f0e9e2] dark:border-[#2e2924] p-5 shadow-xs">
          <div className="h-10 w-10 rounded-full bg-[#dff2e1] dark:bg-[#193521] text-[#2e7d32] dark:text-[#4ade80] inline-flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
          <p className="mt-4 text-3xl font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] tabular-nums">
            {stats.completed_tasks}
          </p>
          <p className="mt-1 text-xs sm:text-sm font-medium text-[#6e655d] dark:text-[#a69d95]">
            Completed Tasks
          </p>
        </div>
      </section>

      {/* Users / All Tasks Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`h-9 px-4 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[#181614] text-white dark:bg-[#ff6b00]'
              : 'bg-white dark:bg-[#1e1b18] text-[#5c534c] dark:text-[#cfc6be] border border-[#ebe3da] dark:border-[#2e2924]'
          }`}
        >
          Users ({users.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('tasks')}
          className={`h-9 px-4 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'tasks'
              ? 'bg-[#181614] text-white dark:bg-[#ff6b00]'
              : 'bg-white dark:bg-[#1e1b18] text-[#5c534c] dark:text-[#cfc6be] border border-[#ebe3da] dark:border-[#2e2924]'
          }`}
        >
          All Tasks ({allTasks.length})
        </button>
      </div>

      {/* Table Card */}
      <div className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] shadow-xs overflow-hidden">
        {activeTab === 'users' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0e9e2] dark:border-[#2d2824] text-xs font-semibold text-[#7c7269] dark:text-[#a69d95]">
                  <th className="py-3.5 px-5">User</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3ede6] dark:divide-[#2a2521] text-sm">
                {users.map((u) => {
                  const isSelf = u.id === user?.id;
                  return (
                    <tr key={u.id} className="hover:bg-[#fffaf5] dark:hover:bg-[#231f1c]">
                      <td className="py-3.5 px-5 font-medium text-[#211d1a] dark:text-[#f5f2ef] whitespace-nowrap">
                        {u.name}
                        {isSelf && (
                          <span className="ml-2 text-xs text-[#ff6b00] font-semibold">(You)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#6e655d] dark:text-[#a69d95] whitespace-nowrap">
                        {u.email}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          aria-label={`Role for ${u.name}`}
                          value={u.role}
                          disabled={isSelf}
                          onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                          className="h-8 px-2.5 rounded-lg border border-[#e3dad1] dark:border-[#36302b] bg-[#fcfaf8] dark:bg-[#141210] text-xs font-semibold text-[#211d1a] dark:text-[#f5f2ef] disabled:opacity-60 focus:border-[#ff6b00] focus:outline-none"
                        >
                          <option value="user">user</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isSelf}
                          onClick={() => handleDeleteUser(u)}
                          aria-label={`Delete user ${u.name}`}
                          className="h-8 w-8 inline-flex items-center justify-center rounded-full text-[#dc2626] hover:bg-[#fef2f2] dark:hover:bg-[#3a1d1d] disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f0e9e2] dark:border-[#2d2824] text-xs font-semibold text-[#7c7269] dark:text-[#a69d95]">
                  <th className="py-3.5 px-5">Task</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-5 text-right">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3ede6] dark:divide-[#2a2521] text-sm">
                {allTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-[#fffaf5] dark:hover:bg-[#231f1c]">
                    <td className="py-3.5 px-5 font-medium text-[#211d1a] dark:text-[#f5f2ef] max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="py-3.5 px-4 text-[#6e655d] dark:text-[#a69d95] whitespace-nowrap">
                      {t.user_name}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                          t.status === 'completed'
                            ? 'bg-[#eaf7ee] text-[#15803d] dark:bg-[#173020] dark:text-[#4ade80]'
                            : 'bg-[#fff4e9] text-[#e85d04] dark:bg-[#382315] dark:text-[#ff8a32]'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize text-xs font-semibold text-[#4d453f] dark:text-[#d5cdc5] whitespace-nowrap">
                      {t.priority}
                    </td>
                    <td className="py-3.5 px-5 text-right text-xs text-[#6e655d] dark:text-[#a69d95] tabular-nums whitespace-nowrap">
                      {t.due_date ? formatDueLabel(normalizeApiDate(t.due_date)) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
