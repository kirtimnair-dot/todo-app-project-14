import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { Brand } from '../components/Brand';
import { LoginSunsetBackdrop } from '../components/Illustrations';
import { useTasks } from '../context/TaskContext';

export function Login() {
  const { user, login, register, loginWithDemoAccount } = useTasks();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('jane.doe@example.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
    } else if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      const result =
        mode === 'signup'
          ? await register(name.trim(), trimmedEmail, password)
          : await login(trimmedEmail, password);

      if (!result.ok) {
        setError(result.error || 'Authentication failed.');
        return;
      }
      navigate('/dashboard');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleDemoSignIn = () => {
    loginWithDemoAccount('user');
    navigate('/dashboard');
  };

  const fillAdminDemo = () => {
    setMode('signin');
    setEmail('admin@todoapp.com');
    setPassword('Password123!');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#fbf8f5] dark:bg-[#141210]">
      <div className="w-full max-w-[1020px] min-h-[600px] rounded-3xl overflow-hidden bg-white dark:bg-[#1c1916] border border-[#efe5da] dark:border-[#2d2824] shadow-[0_24px_70px_rgba(45,30,18,0.10)] grid grid-cols-1 lg:grid-cols-2">
        {/* Left Atmospheric Sunset Hero Column */}
        <div className="relative flex flex-col justify-between p-8 sm:p-11 min-h-[340px] lg:min-h-full overflow-hidden">
          <LoginSunsetBackdrop />

          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/35"
            aria-hidden="true"
          />

          <div className="relative z-10">
            <Brand variant="hero" size="md" />

            <div className="mt-14 sm:mt-20">
              <h1 className="text-3xl sm:text-[38px] font-display font-bold tracking-tight text-white leading-[1.18] text-balance drop-shadow-xs">
                Plan. Organize.
                <br />
                Get Things Done.
              </h1>
              <div className="mt-4 h-0.5 w-12 rounded-full bg-white/85" aria-hidden="true" />
            </div>
          </div>

          <div className="relative z-10 hidden lg:block h-20" />
        </div>

        {/* Right Form Column */}
        <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-14 overflow-hidden">
          <div
            className="pointer-events-none -right-12 -top-12 absolute h-40 w-40 rounded-full bg-[#fff1e4] dark:bg-[#2a211a]"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-sm w-full mx-auto">
            <h2 className="text-2xl sm:text-[28px] font-display font-bold text-[#211d1a] dark:text-[#f5f2ef] tracking-tight">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-1 text-sm text-[#786e65] dark:text-[#a69d95]">
              {mode === 'signin' ? 'Sign in to continue' : 'Start organizing your tasks'}
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
              {mode === 'signup' && (
                <div>
                  <label htmlFor="login-name" className="sr-only">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f857b] pointer-events-none"
                    />
                    <input
                      id="login-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      autoComplete="name"
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#e7dfd7] dark:border-[#36302b] bg-[#fdfcfb] dark:bg-[#141210] text-sm text-[#211d1a] dark:text-[#f5f2ef] placeholder:text-[#8f857b] focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="login-email" className="sr-only">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f857b] pointer-events-none"
                  />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    autoComplete="email"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#e7dfd7] dark:border-[#36302b] bg-[#fdfcfb] dark:bg-[#141210] text-sm text-[#211d1a] dark:text-[#f5f2ef] placeholder:text-[#8f857b] focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={17}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8f857b] pointer-events-none"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === 'signup' ? 'Password (8+ characters)' : 'Password'}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    className="w-full h-12 pl-11 pr-11 rounded-xl border border-[#e7dfd7] dark:border-[#36302b] bg-[#fdfcfb] dark:bg-[#141210] text-sm text-[#211d1a] dark:text-[#f5f2ef] placeholder:text-[#8f857b] focus:border-[#ff6b00] focus:ring-2 focus:ring-[#ff6b00]/20 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 inline-flex items-center justify-center rounded-lg text-[#7c7269] hover:text-[#211d1a] dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium text-[#dc2626] dark:text-[#f87171]">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-full bg-[#ff6b00] hover:bg-[#e85d04] disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <span>
                  {submitting
                    ? 'Please wait...'
                    : mode === 'signin'
                    ? 'Login'
                    : 'Create Account'}
                </span>
                <ArrowRight size={17} />
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#ebe3da] dark:bg-[#2d2824]" />
              <span className="text-xs font-medium text-[#8f857b]">or</span>
              <div className="h-px flex-1 bg-[#ebe3da] dark:bg-[#2d2824]" />
            </div>

            {/* Continue with Google */}
            <button
              type="button"
              onClick={handleGoogleDemoSignIn}
              className="w-full h-12 rounded-full border border-[#e7dfd7] dark:border-[#36302b] bg-white dark:bg-[#231f1c] hover:bg-[#fffaf5] dark:hover:bg-[#2c2622] text-sm font-semibold text-[#211d1a] dark:text-[#f5f2ef] inline-flex items-center justify-center gap-2.5 transition-colors cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#EA4335"
                  d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.31 0 3.25 2.69 1.28 6.61l3.66 2.84C5.8 6.89 8.65 5 12 5Z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.52-1.14 2.81-2.4 3.68l3.73 2.9c2.18-2.01 3.69-4.97 3.69-8.82Z"
                />
                <path
                  fill="#FBBC05"
                  d="M4.94 14.55A7.14 7.14 0 0 1 4.55 12c0-.89.15-1.75.39-2.55L1.28 6.61A11.97 11.97 0 0 0 0 12c0 1.94.46 3.77 1.28 5.39l3.66-2.84Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.73-2.9c-1.08.72-2.45 1.16-4.2 1.16-3.35 0-6.2-1.89-7.06-4.8l-3.66 2.84C3.25 21.31 7.31 24 12 24Z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="mt-6 flex flex-col items-center gap-2 text-xs sm:text-sm text-[#786e65] dark:text-[#a69d95]">
              <p>
                {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError('');
                  }}
                  className="font-semibold text-[#ff6b00] hover:text-[#e85d04] transition-colors cursor-pointer"
                >
                  {mode === 'signin' ? 'Sign Up' : 'Login'}
                </button>
              </p>

              <button
                type="button"
                onClick={fillAdminDemo}
                className="text-xs font-medium text-[#8f857b] hover:text-[#ff6b00] transition-colors cursor-pointer"
              >
                Use seeded Admin account (admin@todoapp.com)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
