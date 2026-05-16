import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

const FEATURES = [
  'AI-powered task prioritization',
  'Real-time team collaboration',
  'Smart deadline tracking',
  'Beautiful analytics dashboard',
];

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      toast.success(`Welcome back, ${data.name}!`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0b1120' }}>
      {/* Left panel — branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
      >
        {/* Animated blobs */}
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }} />
        <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-20 right-0 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
        <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 4px 20px rgba(139,92,246,0.4)' }}>
            <Zap size={20} className="text-primary-t" />
          </div>
          <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            TaskFlow
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            <h1 className="text-4xl font-bold text-primary-t mb-4 leading-tight">
              Work smarter,<br />
              <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                not harder.
              </span>
            </h1>
            <p className="text-secondary-t text-[15px] mb-8 leading-relaxed">
              TaskFlow brings AI-powered task management to your team. Organize, prioritize, and ship faster.
            </p>
            <div className="space-y-3">
              {FEATURES.map((f, i) => (
                <motion.div key={f} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.4)' }}>
                    <CheckCircle2 size={11} className="text-violet-400" />
                  </div>
                  <span className="text-[13px] text-secondary-t">{f}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Social proof */}
        <div className="relative z-10">
          <div className="flex -space-x-2 mb-2">
            {['A','B','C','D','E'].map((l, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold text-primary-t"
                style={{ borderColor: '#0b1120', background: `hsl(${i * 60 + 240}, 70%, 55%)` }}>{l}</div>
            ))}
          </div>
          <p className="text-[12px] text-muted-t">Trusted by <span className="text-secondary-t font-medium">2,000+ teams</span> worldwide</p>
        </div>
      </motion.div>

      {/* Right panel — form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 relative"
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 60%)' }} />

        <div className="w-full max-w-md relative z-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
              <Zap size={17} className="text-primary-t" />
            </div>
            <span className="text-lg font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              TaskFlow
            </span>
          </div>

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-primary-t mb-1.5">Welcome back</h2>
            <p className="text-[14px] text-muted-t">Sign in to your workspace to continue.</p>
          </div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="rounded-2xl border p-7 space-y-4"
            style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(20px)' }}
          >
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 rounded-xl text-red-400 text-[13px] border"
                style={{ background: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }}>
                ⚠ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full rounded-xl px-4 py-3 text-[13px] text-primary-t placeholder-slate-600 outline-none transition-all duration-200 border"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Password</label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    className="w-full rounded-xl px-4 py-3 pr-11 text-[13px] text-primary-t placeholder-slate-600 outline-none transition-all duration-200 border"
                    style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.08)' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,92,246,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-t hover:text-secondary-t transition-colors">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <motion.button
                id="login-submit"
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-primary-t text-[14px] font-semibold mt-2 transition-all duration-200 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', boxShadow: '0 4px 20px rgba(139,92,246,0.3)' }}
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Signing in…</> : <>Sign In <ArrowRight size={14} /></>}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <span className="text-[11px] text-muted-t">or continue with</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>

            {/* OAuth buttons */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', icon: 'G', color: '#ea4335' },
                { label: 'GitHub', icon: '⌥', color: '#fff' },
              ].map(({ label, icon, color }) => (
                <motion.button key={label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => toast('OAuth not configured yet', { icon: 'ℹ️' })}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-medium text-secondary-t border transition-all duration-200 hover:bg-hover"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}>
                  <span style={{ color, fontWeight: 800 }}>{icon}</span> {label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <p className="text-center text-[13px] text-muted-t mt-5">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium transition-colors" style={{ color: '#8b5cf6' }}
              onMouseOver={e => e.target.style.color = '#a78bfa'}
              onMouseOut={e => e.target.style.color = '#8b5cf6'}>
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
