import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { TaskProvider, useTasks } from './context/TaskContext';
import { AppShell } from './components/AppShell';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Admin } from './pages/Admin';
import { Settings } from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useTasks();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useTasks();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

function DefaultRedirect() {
  const { user } = useTasks();
  return <Navigate to={user ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <TaskProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <AppShell />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<DefaultRedirect />} />
        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}
