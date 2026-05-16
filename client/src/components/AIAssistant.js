import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, Zap, Brain, CheckCircle2, Clock, RefreshCw } from 'lucide-react';

const INSIGHTS = [
  {
    id: 1,
    type: 'priority',
    icon: Zap,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/20',
    glow: 'hover:shadow-violet-500/10',
    title: 'High-impact task ready',
    desc: 'API Integration has no blockers — ideal to start now for max velocity.',
    action: 'Start task',
  },
  {
    id: 2,
    type: 'warning',
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    glow: 'hover:shadow-amber-500/10',
    title: '2 deadlines approaching',
    desc: '"Dashboard UI" is due tomorrow. "Auth Module" due in 2 days.',
    action: 'View tasks',
  },
  {
    id: 3,
    type: 'insight',
    icon: TrendingUp,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    glow: 'hover:shadow-cyan-500/10',
    title: 'Peak productivity: 10–12am',
    desc: 'You complete 40% more tasks in morning sessions. Schedule deep work then.',
    action: 'View analytics',
  },
  {
    id: 4,
    type: 'recommendation',
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'hover:shadow-emerald-500/10',
    title: 'Quick win available',
    desc: '"Write unit tests" takes ~30 min and unblocks 3 other tasks.',
    action: 'Assign to me',
  },
];


function ProductivityRing({ score }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="48" cy="48" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
      <div className="text-center z-10">
        <div className="text-xl font-bold text-primary-t">{score}</div>
        <div className="text-[9px] text-muted-t font-medium uppercase tracking-wide">Score</div>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [score] = useState(78);
  const [dismissed, setDismissed] = useState([]);

  const refresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const visible = INSIGHTS.filter(i => !dismissed.includes(i.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="rounded-2xl overflow-hidden glass border"
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.04) 0%, rgba(99,102,241,0.03) 50%, rgba(6,182,212,0.02) 100%)',
        borderColor: 'rgba(139,92,246,0.15)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Brain size={15} className="text-primary-t" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-dark-900 animate-pulse" />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-primary-t flex items-center gap-1.5">
              AI Assistant
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/20 tracking-wider">BETA</span>
            </div>
            <div className="text-[11px] text-muted-t">Powered by productivity insights</div>
          </div>
        </div>
        <button
          onClick={refresh}
          className="p-2 rounded-xl text-muted-t hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin text-violet-400' : ''} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Productivity score */}
        <div className="flex items-center gap-5 p-4 rounded-xl bg-card-t border border-theme">
          <ProductivityRing score={score} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold text-primary-t mb-1">Productivity Score</div>
            <div className="text-[12px] text-muted-t mb-3">Above average this week 🎯</div>
            <div className="space-y-1.5">
              {[['Focus time',   78], ['Tasks done',  85], ['Velocity',    70]].map(([label, val]) => (
                <div key={label}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-muted-t">{label}</span>
                    <span className="text-secondary-t font-medium">{val}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-hover overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${val}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg, #8b5cf6, #06b6d4)' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-[11px] font-semibold text-secondary-t uppercase tracking-wider">Smart Suggestions</span>
          </div>
          <AnimatePresence>
            <div className="space-y-2">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl skeleton" />
                ))
              ) : (
                visible.map((insight, i) => {
                  const Icon = insight.icon;
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0, marginBottom: 0, padding: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.06 }}
                      onClick={() => navigate('/projects')}
                      className={`group relative flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${insight.bg} ${insight.border} ${insight.glow}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${insight.bg} border ${insight.border}`}>
                        <Icon size={13} className={insight.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-semibold text-primary-t mb-0.5">{insight.title}</div>
                        <div className="text-[11px] text-muted-t leading-relaxed">{insight.desc}</div>
                        <button className={`mt-2 flex items-center gap-1 text-[11px] font-semibold ${insight.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                          {insight.action} <ArrowRight size={10} />
                        </button>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setDismissed(d => [...d, insight.id]); }}
                        className="opacity-0 group-hover:opacity-100 text-muted-t hover:text-secondary-t transition-all duration-200 text-[14px] leading-none flex-shrink-0"
                      >
                        ×
                      </button>
                    </motion.div>
                  );
                })
              )}
              {!loading && visible.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 text-muted-t text-[12px]"
                >
                  <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500/40" />
                  All insights reviewed ✓
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>

        {/* Next recommended task */}
        <motion.div 
          whileHover={{ y: -2 }}
          onClick={() => navigate('/projects')}
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/5 border border-violet-500/15 cursor-pointer hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300 group"
        >
          <Clock size={14} className="text-violet-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-semibold text-violet-300">Recommended next</div>
            <div className="text-[12px] text-secondary-t truncate">Review PR: Dashboard component update</div>
          </div>
          <ArrowRight size={13} className="text-violet-500 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
        </motion.div>
      </div>
    </motion.div>
  );
}
