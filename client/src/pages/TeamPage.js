import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, Mail, ShieldCheck, UserCircle } from 'lucide-react';

export default function TeamPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="splash-loader"><div className="spinner" /></div>;

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-primary-t flex items-center gap-2">
          <Users size={20} className="text-indigo-400" /> Team
        </h1>
        <p className="text-[13px] text-muted-t mt-0.5">{users.length} member{users.length !== 1 ? 's' : ''} in your workspace</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u, i) => (
          <div
            key={u._id}
            className="rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm
              hover:-translate-y-1 hover:border-indigo-500/20 transition-all duration-300"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg font-bold text-primary-t shadow-lg shadow-indigo-500/20 flex-shrink-0">
                {u.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-primary-t truncate">{u.name}</div>
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full mt-1
                  ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-secondary-t'}`}>
                  {u.role === 'admin' ? <ShieldCheck size={10} /> : <UserCircle size={10} />}
                  {u.role}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-muted-t">
              <Mail size={12} className="text-muted-t flex-shrink-0" />
              <span className="truncate">{u.email}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-theme text-[11px] text-muted-t">
              Joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
