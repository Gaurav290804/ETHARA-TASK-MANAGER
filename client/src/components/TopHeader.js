import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sun, Moon, User, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { EmptyNotifications } from './EmptyStates';

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-14 h-7 rounded-full border transition-all duration-300"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.2))'
          : 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(245,158,11,0.2))',
        borderColor: isDark ? 'rgba(139,92,246,0.3)' : 'rgba(245,158,11,0.3)',
      }}
    >
      <motion.div
        animate={{ x: isDark ? 2 : 30 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center"
        style={{ background: isDark ? '#8b5cf6' : '#f59e0b' }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.span key="moon" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
              <Moon size={12} className="text-white" />
            </motion.span>
          ) : (
            <motion.span key="sun" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }}>
              <Sun size={12} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

function NotifDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-72 rounded-2xl border z-50 overflow-hidden shadow-2xl bg-elevated border-theme"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-theme">
        <span className="text-[13px] font-bold text-primary-t">Notifications</span>
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">0 new</span>
      </div>
      <EmptyNotifications />
    </motion.div>
  );
}

function ProfileDropdown({ user, onLogout, onClose, navigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-56 rounded-2xl border z-50 overflow-hidden shadow-2xl bg-elevated border-theme"
    >
      <div className="p-3 border-b border-theme">
        <div className="text-[13px] font-semibold text-primary-t">{user?.name}</div>
        <div className="text-[11px] text-secondary-t">{user?.email}</div>
      </div>
      <div className="p-1.5">
        <button onClick={() => { navigate('/settings'); onClose(); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-muted-t hover:text-primary-t hover:bg-hover transition-all duration-200">
          <User size={14} /> Profile
        </button>
        <div className="my-1 border-t border-theme" />
        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200">
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </motion.div>
  );
}

export default function TopHeader({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 h-[70px] border-b transition-all duration-300 border-theme"
      style={{ background: 'var(--bg-base)', backdropFilter: 'blur(20px)' }}>
      {/* Left */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={onToggleSidebar}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          className="p-1.5 rounded-lg text-secondary-t hover:text-primary-t hover:bg-hover transition-all duration-200"
        >
          <Menu size={18} />
        </motion.button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            className="relative p-2 rounded-xl text-muted-t hover:text-primary-t hover:bg-hover transition-all duration-200"
          >
            <Bell size={17} />
          </motion.button>
          <AnimatePresence>
            {notifOpen && <NotifDropdown />}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-primary-t">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-[13px] font-medium hidden sm:block text-secondary-t">{user?.name}</span>
            <ChevronDown size={12} className={`text-muted-t transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </motion.button>
          <AnimatePresence>
            {profileOpen && <ProfileDropdown user={user} onLogout={handleLogout} onClose={() => setProfileOpen(false)} navigate={navigate} />}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
