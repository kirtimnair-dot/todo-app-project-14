import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import AppShell from './components/AppShell';
import { TaskProvider } from './context/TaskContext';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Settings from './pages/Settings';
import Tasks from './pages/Tasks';
function Protected({ children }: { children: ReactNode }) { return localStorage.getItem('taskflow.user') ? <AppShell>{children}</AppShell> : <Navigate to="/login" replace />; }
export default function App() { return <TaskProvider><Routes><Route path="/login" element={<Login/>}/><Route path="/" element={<Protected><Dashboard/></Protected>}/><Route path="/tasks" element={<Protected><Tasks/></Protected>}/><Route path="/calendar" element={<Protected><Calendar/></Protected>}/><Route path="/settings" element={<Protected><Settings/></Protected>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></TaskProvider>; }
