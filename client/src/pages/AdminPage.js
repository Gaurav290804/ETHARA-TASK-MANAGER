import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShieldCheck, Trash2, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    api.get('/admin/users')
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const { data } = await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u._id === userId ? data : u));
      toast.success(`Role updated to ${newRole}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally { setUpdatingId(null); }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Permanently delete this user?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  if (loading) return <div className="splash-loader"><div className="spinner" /></div>;

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary-t flex items-center gap-2">
            <ShieldCheck size={20} className="text-indigo-400" /> Admin Panel
          </h1>
          <p className="text-[13px] text-muted-t mt-0.5">Manage users and roles across your workspace</p>
        </div>
        <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          {users.length} Total Users
        </span>
      </div>

      <div className="rounded-2xl overflow-hidden bg-elevated border border-theme backdrop-blur-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-theme">
              {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left px-5 py-3.5 text-[11px] font-semibold text-muted-t uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u._id} className="border-b border-white/[0.04] last:border-none hover:bg-card-t transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[12px] font-bold text-primary-t flex-shrink-0">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-primary-t">{u.name}</div>
                      {u._id === currentUser._id && (
                        <div className="text-[10px] text-indigo-400 font-medium">You</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[12px] text-muted-t">{u.email}</td>
                <td className="px-5 py-3.5">
                  {u._id === currentUser._id ? (
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full
                      ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-secondary-t'}`}>
                      {u.role}
                    </span>
                  ) : (
                    <select
                      id={`role-select-${u._id}`}
                      value={u.role}
                      disabled={updatingId === u._id}
                      onChange={e => handleRoleChange(u._id, e.target.value)}
                      className="bg-hover border border-theme rounded-xl px-2.5 py-1 text-[12px] text-secondary-t outline-none cursor-pointer hover:border-indigo-500/40 transition-colors disabled:opacity-50"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </td>
                <td className="px-5 py-3.5 text-[12px] text-muted-t">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5">
                  {u._id !== currentUser._id ? (
                    <div className="flex items-center gap-2">
                      {updatingId === u._id && <Loader2 size={14} className="text-indigo-400 animate-spin" />}
                      <button
                        id={`delete-user-${u._id}`}
                        onClick={() => handleDelete(u._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-[12px] font-medium hover:bg-red-500 hover:text-primary-t transition-all duration-200"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  ) : (
                    <span className="text-muted-t text-[12px]">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
