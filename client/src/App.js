import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';

import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';
import DashboardPage    from './pages/DashboardPage';
import ProjectsPage     from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AdminPage        from './pages/AdminPage';
import CalendarPage     from './pages/CalendarPage';
import TeamPage         from './pages/TeamPage';
import SettingsPage     from './pages/SettingsPage';

import './index.css';

const pageVariants = {
  initial:  { opacity: 0, y: 10 },
  animate:  { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:     { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

function AnimatedPage({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login"  element={<AnimatedPage><LoginPage /></AnimatedPage>} />
        <Route path="/signup" element={<AnimatedPage><SignupPage /></AnimatedPage>} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/dashboard" element={
          <ProtectedRoute><Layout><AnimatedPage><DashboardPage /></AnimatedPage></Layout></ProtectedRoute>
        } />
        <Route path="/projects" element={
          <ProtectedRoute><Layout><AnimatedPage><ProjectsPage /></AnimatedPage></Layout></ProtectedRoute>
        } />
        <Route path="/projects/:id" element={
          <ProtectedRoute><Layout><AnimatedPage><ProjectDetailPage /></AnimatedPage></Layout></ProtectedRoute>
        } />
        <Route path="/calendar" element={
          <ProtectedRoute><Layout><AnimatedPage><CalendarPage /></AnimatedPage></Layout></ProtectedRoute>
        } />
        <Route path="/team" element={
          <ProtectedRoute><Layout><AnimatedPage><TeamPage /></AnimatedPage></Layout></ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute><Layout><AnimatedPage><SettingsPage /></AnimatedPage></Layout></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><Layout><AnimatedPage><AdminPage /></AnimatedPage></Layout></AdminRoute>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#0f172a',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              },
              success: { iconTheme: { primary: '#8b5cf6', secondary: '#0f172a' } },
              error:   { iconTheme: { primary: '#ef4444', secondary: '#0f172a' } },
            }}
          />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
