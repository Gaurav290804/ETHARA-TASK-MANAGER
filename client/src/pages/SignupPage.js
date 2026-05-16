import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data);
      toast.success(`Welcome, ${data.name}! 🎉`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-hover border border-white/[0.09] rounded-xl px-4 py-3 text-[13px] text-primary-t placeholder-slate-600 outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/30 mb-4">
            <Zap size={22} className="text-primary-t" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            TaskFlow
          </h1>
          <p className="text-[13px] text-muted-t mt-1">Create your account</p>
        </div>

        {/* Card */}
        <div className="bg-elevated border border-theme rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] mb-5">
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Full Name</label>
              <input
                id="signup-name"
                placeholder="John Doe"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Email Address</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                  className={inputCls + ' pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-t hover:text-secondary-t transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Role</label>
              <select
                id="signup-role"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className={inputCls + ' cursor-pointer'}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-primary-t text-[14px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Creating account…</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-[13px] text-muted-t mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
