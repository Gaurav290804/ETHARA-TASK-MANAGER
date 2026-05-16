import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CheckSquare, Calendar,
  Users, Settings, ChevronLeft, ChevronRight, Zap, ShieldCheck, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects',  icon: CheckSquare,     label: 'Tasks' },
  { to: '/calendar',  icon: Calendar,         label: 'Calendar' },
  { to: '/team',      icon: Users,            label: 'Team' },
  { to: '/settings',  icon: Settings,         label: 'Settings' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      className="fixed top-0 left-0 z-50 flex flex-col h-screen flex-shrink-0 border-r border-theme"
      style={{
        background: 'linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-base) 100%)',
        backdropFilter: 'blur(24px)'
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-[70px] border-b border-theme overflow-hidden">
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          className="flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 4px 14px rgba(139,92,246,0.4)' }}
        >
          <Zap size={16} className="text-primary-t" />
        </motion.div>
        <motion.span
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
          transition={{ duration: 0.2 }}
          className="font-bold text-[15px] whitespace-nowrap overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          TaskFlow
        </motion.span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              transition-all duration-200 overflow-hidden whitespace-nowrap
              ${collapsed ? 'justify-center' : ''}
              ${isActive
                ? 'text-primary-t'
                : 'text-muted-t hover:text-primary-t hover:bg-hover'}
            `}
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))',
              borderLeft: collapsed ? 'none' : '2px solid rgba(139,92,246,0.6)',
              paddingLeft: collapsed ? undefined : '10px',
              boxShadow: '0 2px 12px rgba(139,92,246,0.1)',
            } : {}}
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0">
                  <Icon size={16} className={isActive ? 'text-violet-400' : ''} />
                </motion.div>
                <motion.span
                  animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {label}
                </motion.span>
              </>
            )}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to="/admin"
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium
              transition-all duration-200 overflow-hidden whitespace-nowrap
              ${collapsed ? 'justify-center' : ''}
              ${isActive ? 'text-primary-t' : 'text-muted-t hover:text-primary-t hover:bg-hover'}
            `}
            style={({ isActive }) => isActive ? {
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))',
              borderLeft: '2px solid rgba(139,92,246,0.6)',
              paddingLeft: '10px',
            } : {}}
            title={collapsed ? 'Admin' : undefined}
          >
            {({ isActive }) => (
              <>
                <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0">
                  <ShieldCheck size={16} className={isActive ? 'text-violet-400' : ''} />
                </motion.div>
                <motion.span
                  animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  Admin
                </motion.span>
              </>
            )}
          </NavLink>
        )}
      </nav>

      {/* User profile */}
      <div className="border-t border-theme p-3">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 group overflow-hidden ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? `${user?.name} — logout` : 'Click to logout'}
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-primary-t flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 2px 8px rgba(139,92,246,0.3)' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <motion.div
            animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
            transition={{ duration: 0.2 }}
            className="text-left min-w-0 overflow-hidden"
          >
            <div className="text-[13px] font-semibold text-primary-t truncate">{user?.name}</div>
            <div className="text-[10px] text-muted-t capitalize flex items-center gap-1">
              <LogOut size={9} className="opacity-60" /> Sign out
            </div>
          </motion.div>
        </motion.button>
      </div>
    </motion.aside>
  );
}
