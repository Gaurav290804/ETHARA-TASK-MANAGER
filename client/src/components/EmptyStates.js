import React from 'react';
import { motion } from 'framer-motion';

const container = { animate: { transition: { staggerChildren: 0.06 } } };
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

/* ─── No Tasks ─── */
export function EmptyTasks({ onAdd }) {
  return (
    <motion.div variants={container} initial="initial" animate="animate"
      className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div variants={item} className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/10 border border-violet-500/20 flex items-center justify-center mx-auto">
          <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
            <rect x="12" y="16" width="40" height="8" rx="3" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"/>
            <rect x="12" y="30" width="28" height="8" rx="3" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
            <rect x="12" y="44" width="18" height="8" rx="3" fill="rgba(6,182,212,0.1)" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5"/>
            <circle cx="50" cy="46" r="8" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="1.5"/>
            <line x1="50" y1="42" x2="50" y2="50" stroke="rgba(139,92,246,0.8)" strokeWidth="2" strokeLinecap="round"/>
            <line x1="46" y1="46" x2="54" y2="46" stroke="rgba(139,92,246,0.8)" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-500/30 border border-violet-500/40 flex items-center justify-center">
          <span className="text-violet-300 text-[10px]">✦</span>
        </motion.div>
      </motion.div>
      <motion.h3 variants={item} className="text-[16px] font-bold text-primary-t mb-1.5">No tasks yet</motion.h3>
      <motion.p variants={item} className="text-[13px] text-muted-t mb-5 max-w-xs leading-relaxed">
        You're all caught up! Create your first task to start tracking your progress.
      </motion.p>
      {onAdd && (
        <motion.button variants={item} onClick={onAdd} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-primary-t text-[13px] font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-shadow duration-300">
          + Create first task
        </motion.button>
      )}
    </motion.div>
  );
}

/* ─── No Projects ─── */
export function EmptyProjects({ onAdd }) {
  return (
    <motion.div variants={container} initial="initial" animate="animate"
      className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div variants={item} className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto">
          <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
            <rect x="8" y="20" width="22" height="30" rx="4" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.5)" strokeWidth="1.5"/>
            <rect x="34" y="14" width="22" height="36" rx="4" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5"/>
            <line x1="14" y1="28" x2="24" y2="28" stroke="rgba(99,102,241,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="34" x2="22" y2="34" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="40" y1="22" x2="50" y2="22" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="40" y1="28" x2="50" y2="28" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="40" y1="34" x2="46" y2="34" stroke="rgba(6,182,212,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </motion.div>
      <motion.h3 variants={item} className="text-[16px] font-bold text-primary-t mb-1.5">No projects found</motion.h3>
      <motion.p variants={item} className="text-[13px] text-muted-t mb-5 max-w-xs leading-relaxed">
        Organize your work into projects. Group tasks, add team members, and track progress.
      </motion.p>
      {onAdd && (
        <motion.button variants={item} onClick={onAdd} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-primary-t text-[13px] font-semibold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-shadow duration-300">
          + New project
        </motion.button>
      )}
    </motion.div>
  );
}

/* ─── No Notifications ─── */
export function EmptyNotifications() {
  return (
    <motion.div variants={container} initial="initial" animate="animate"
      className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <motion.div variants={item} className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
        <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
          <path d="M16 4a8 8 0 0 0-8 8v4l-2 4h20l-2-4v-4a8 8 0 0 0-8-8z" stroke="rgba(52,211,153,0.6)" strokeWidth="1.5" fill="rgba(52,211,153,0.1)"/>
          <path d="M14 24a2 2 0 0 0 4 0" stroke="rgba(52,211,153,0.5)" strokeWidth="1.5"/>
          <circle cx="22" cy="8" r="4" fill="rgba(52,211,153,0.3)" stroke="rgba(52,211,153,0.6)" strokeWidth="1"/>
        </svg>
      </motion.div>
      <motion.h3 variants={item} className="text-[14px] font-bold text-secondary-t mb-1">All caught up!</motion.h3>
      <motion.p variants={item} className="text-[12px] text-muted-t">No new notifications right now.</motion.p>
    </motion.div>
  );
}

/* ─── No Analytics Data ─── */
export function EmptyAnalytics() {
  return (
    <motion.div variants={container} initial="initial" animate="animate"
      className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <motion.div variants={item} className="w-20 h-20 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
        <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
          <line x1="8" y1="52" x2="56" y2="52" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="12" y="36" width="8" height="16" rx="2" fill="rgba(6,182,212,0.15)" stroke="rgba(6,182,212,0.4)" strokeWidth="1.5"/>
          <rect x="26" y="28" width="8" height="24" rx="2" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.4)" strokeWidth="1.5"/>
          <rect x="40" y="20" width="8" height="32" rx="2" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="1.5"/>
          <path d="M12 36 C18 28, 26 20, 32 16 C38 12, 44 10, 52 8" stroke="rgba(6,182,212,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2"/>
        </svg>
      </motion.div>
      <motion.h3 variants={item} className="text-[16px] font-bold text-primary-t mb-1.5">No data yet</motion.h3>
      <motion.p variants={item} className="text-[13px] text-muted-t max-w-xs leading-relaxed">
        Start completing tasks to see your productivity analytics and trends appear here.
      </motion.p>
    </motion.div>
  );
}

/* ─── Generic Loading Skeleton ─── */
export function CardSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden">
          <div className="skeleton h-16 w-full rounded-xl" style={{ animationDelay: `${i * 100}ms` }} />
        </div>
      ))}
    </div>
  );
}
