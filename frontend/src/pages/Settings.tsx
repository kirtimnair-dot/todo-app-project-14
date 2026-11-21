import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, LogOut, Moon, RotateCcw, Server, Sun, Trash2 } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { AccentTheme, Priority } from '../types';
import { API_BASE_URL } from '../lib/api';

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

const ACCENT_SWATCHES: { id: AccentTheme; label: string; color: string }[] = [
  { id: 'orange', label: 'Sunset Orange', color: '#ff6b00' },
  { id: 'amber', label: 'Warm Amber', color: '#d97706' },
  { id: 'emerald', label: 'Forest Green', color: '#16a34a' },
  { id: 'blue', label: 'Cobalt Blue', color: '#2563eb' },
];

export function Settings() {
  const {
    user,
    apiMode,
    updateProfile,
    theme,
    setTheme,
    accentTheme,
    setAccentTheme,
    stats,
    clearCompleted,
    resetSampleTasks,
    logout,
  } = useTasks();

  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || 'Namit Yadav');
  const [email, setEmail] = useState(user?.email || 'namit.yadav@gmail.com');
  const [defaultPriority, setDefaultPriority] = useState<Priority>(
    user?.defaultPriority || 'Medium'
  );
  const [savedMessage, setSavedMessage] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      defaultPriority,
    });
    setSavedMessage('Settings saved');
    window.setTimeout(() => setSavedMessage(''), 2500);
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl sm:text-[30px] font-display font-bold tracking-tight text-[#211d1a] dark:text-[#f5f2ef]">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#6e655d] dark:text-[#a69d95]">
          Manage your profile, theme appearance, and task workspace preferences
        </p>
      </div>

      {/* Profile & Default Priority */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] p-6 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
            Profile &amp; Preferences
          </h2>
          {savedMessage && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16a34a] dark:text-[#4ade80]">
              <Check size={14} />
              {savedMessage}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="settings-name"
              className="block text-xs font-semibold text-[#4d453f] dark:text-[#cfc6be] mb-1.5"
            >
              Display Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#e3dad1] dark:border-[#36302b] bg-[#fffdfb] dark:bg-[#141210] text-sm text-[#211d1a] dark:text-[#f5f2ef] focus:border-[#ff6b00] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="settings-email"
              className="block text-xs font-semibold text-[#4d453f] dark:text-[#cfc6be] mb-1.5"
            >
              Email Address
            </label>
            <input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-[#e3dad1] dark:border-[#36302b] bg-[#fffdfb] dark:bg-[#141210] text-sm text-[#211d1a] dark:text-[#f5f2ef] focus:border-[#ff6b00] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <span className="block text-xs font-semibold text-[#4d453f] dark:text-[#cfc6be] mb-2">
            Default Priority for New Tasks
          </span>
          <div className="grid grid-cols-3 gap-2 max-w-sm">
            {PRIORITIES.map((item) => {
              const active = defaultPriority === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setDefaultPriority(item)}
                  className={`h-10 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#ff6b00] text-white'
                      : 'bg-[#f6f1ec] text-[#4d453f] hover:bg-[#ede4db] dark:bg-[#2a2521] dark:text-[#d5cdc5]'
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="h-10 px-5 rounded-xl bg-[#ff6b00] hover:bg-[#e85d04] text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>

      {/* Appearance Theme & Accent Swatches (BUG-003 fixed) */}
      <section className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] p-6 shadow-xs space-y-5">
        <div>
          <h2 className="text-base font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
            Appearance
          </h2>
          <p className="text-xs text-[#7c7269] dark:text-[#a69d95] mt-0.5">
            Choose between warm cream light mode or low-glare dark mode, and customize your accent color
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-[#ff6b00] bg-[#fff4e9] dark:bg-[#2c2017]'
                : 'border-[#ebe3da] dark:border-[#302b27] hover:border-[#ff6b00]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-[#fffaf5] border border-[#efe7df] text-[#ff6b00] inline-flex items-center justify-center">
                <Sun size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#211d1a] dark:text-[#f5f2ef]">
                  Light Mode
                </p>
                <p className="text-xs text-[#7c7269] dark:text-[#a69d95]">
                  Warm cream surfaces
                </p>
              </div>
            </div>
            {theme === 'light' && <Check size={18} className="text-[#ff6b00]" />}
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-[#ff6b00] bg-[#fff4e9] dark:bg-[#2c2017]'
                : 'border-[#ebe3da] dark:border-[#302b27] hover:border-[#ff6b00]/40'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-[#161412] border border-[#302b27] text-[#ff8a32] inline-flex items-center justify-center">
                <Moon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-[#211d1a] dark:text-[#f5f2ef]">
                  Dark Mode
                </p>
                <p className="text-xs text-[#7c7269] dark:text-[#a69d95]">
                  Deep charcoal workspace
                </p>
              </div>
            </div>
            {theme === 'dark' && <Check size={18} className="text-[#ff6b00]" />}
          </button>
        </div>

        {/* Interactive Accent Color Swatches */}
        <div>
          <span className="block text-xs font-semibold text-[#4d453f] dark:text-[#cfc6be] mb-2.5">
            Accent Color
          </span>
          <div className="flex items-center gap-3 flex-wrap">
            {ACCENT_SWATCHES.map((swatch) => {
              const selected = accentTheme === swatch.id;
              return (
                <button
                  key={swatch.id}
                  type="button"
                  onClick={() => setAccentTheme(swatch.id)}
                  aria-label={`Select ${swatch.label} accent`}
                  aria-pressed={selected}
                  className={`h-10 px-3 rounded-full border inline-flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                    selected
                      ? 'border-[#211d1a] dark:border-white bg-[#fcfaf8] dark:bg-[#2a2521] text-[#211d1a] dark:text-white'
                      : 'border-[#ebe3da] dark:border-[#302b27] text-[#6e655d] dark:text-[#a69d95] hover:border-[#b8afa7]'
                  }`}
                >
                  <span
                    className="h-4 w-4 rounded-full shrink-0 flex items-center justify-center text-white"
                    style={{ backgroundColor: swatch.color }}
                  >
                    {selected && <Check size={11} strokeWidth={3} />}
                  </span>
                  <span>{swatch.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workspace Data & Backend Info */}
      <section className="rounded-2xl bg-white dark:bg-[#1e1b18] border border-[#efe7df] dark:border-[#2e2924] p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-base font-display font-bold text-[#211d1a] dark:text-[#f5f2ef]">
            Workspace Data &amp; Account
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6e655d] dark:text-[#a69d95]">
            <Server size={13} />
            {apiMode === 'live'
              ? `Connected to Flask API (${API_BASE_URL})`
              : `Offline Storage Mode (API target: ${API_BASE_URL})`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={stats.completed === 0}
            onClick={clearCompleted}
            className="h-10 px-4 rounded-xl border border-[#ebe3da] dark:border-[#302b27] text-sm font-medium text-[#211d1a] dark:text-[#f5f2ef] hover:bg-[#fffaf5] dark:hover:bg-[#26221e] disabled:opacity-45 disabled:cursor-not-allowed inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 size={15} />
            <span>Clear Completed ({stats.completed})</span>
          </button>

          <button
            type="button"
            onClick={resetSampleTasks}
            className="h-10 px-4 rounded-xl border border-[#ebe3da] dark:border-[#302b27] text-sm font-medium text-[#211d1a] dark:text-[#f5f2ef] hover:bg-[#fffaf5] dark:hover:bg-[#26221e] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
            <span>Reset Sample Tasks</span>
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="h-10 px-4 rounded-xl bg-[#fef2f2] dark:bg-[#3a1d1d] text-sm font-semibold text-[#dc2626] dark:text-[#f87171] hover:bg-[#fee2e2] dark:hover:bg-[#4b2323] inline-flex items-center gap-2 transition-colors ml-auto cursor-pointer"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </section>
    </div>
  );
}
