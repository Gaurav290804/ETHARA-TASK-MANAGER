import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Trash2, UserPlus, ArrowLeft, Calendar, Loader2, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const COLUMNS = [
  { id: 'todo',        label: 'Todo',        color: 'text-secondary-t',   dot: 'bg-slate-500' },
  { id: 'in-progress', label: 'In Progress', color: 'text-blue-400',    dot: 'bg-blue-500' },
  { id: 'review',      label: 'Review',      color: 'text-amber-400',   dot: 'bg-amber-500' },
  { id: 'done',        label: 'Done',        color: 'text-emerald-400', dot: 'bg-emerald-500' },
];

const PRIORITY_STYLE = {
  high:   'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  low:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

/* ─── Task Modal ─────────────────────────────────────── */
function TaskModal({ task, projectId, members, onClose, onSaved, isAdmin, currentUser }) {
  const isNew = !task;
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'todo',
    priority: task?.priority || 'medium',
    assignedTo: task?.assignedTo?._id || task?.assignedTo || '',
    dueDate: task?.dueDate ? task.dueDate.substring(0, 10) : '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, assignedTo: form.assignedTo || null, dueDate: form.dueDate || null };
      let res;
      if (isNew) res = await api.post(`/projects/${projectId}/tasks`, payload);
      else res = await api.put(`/tasks/${task._id}`, payload);
      toast.success(isNew ? 'Task created!' : 'Task updated!');
      onSaved(res.data, isNew);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally { setLoading(false); }
  };

  const Field = ({ label, children }) => (
    <div>
      <label className="block text-[12px] font-medium text-secondary-t mb-1.5">{label}</label>
      {children}
    </div>
  );
  const inputCls = "w-full bg-hover border border-theme rounded-xl px-3 py-2.5 text-[13px] text-primary-t outline-none focus:border-indigo-500/50 transition-colors";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-base border border-theme rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
          <h2 className="text-[15px] font-bold text-primary-t">{isNew ? 'New Task' : 'Edit Task'}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-hover flex items-center justify-center text-secondary-t hover:text-primary-t hover:bg-red-500/80 transition-all duration-200">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Title *">
            <input className={inputCls} placeholder="What needs to be done?" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </Field>
          <Field label="Description">
            <textarea className={inputCls} rows={2} placeholder="Add details…" style={{ resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <select className={inputCls + ' cursor-pointer'} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </Field>
            <Field label="Priority">
              <select className={inputCls + ' cursor-pointer'} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Assign To">
              <select className={inputCls + ' cursor-pointer'} value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })}>
                <option value="">Unassigned</option>
                {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
              </select>
            </Field>
            <Field label="Due Date">
              <input type="date" className={inputCls} value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </Field>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-hover text-secondary-t text-[13px] font-medium hover:text-primary-t hover:bg-white/[0.08] transition-all duration-200">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-primary-t text-[13px] font-semibold transition-all duration-200 disabled:opacity-50">
              {loading && <Loader2 size={13} className="animate-spin" />}
              {isNew ? 'Create Task' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Add Member Modal ───────────────────────────────── */
function AddMemberModal({ projectId, existingMembers, onClose, onAdded }) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/admin/users').then(res => {
      setUsers(res.data.filter(u => !existingMembers.some(m => m._id === u._id)));
    }).catch(() => toast.error('Failed to load users'));
  }, [existingMembers]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selected) return toast.error('Please select a user');
    setLoading(true);
    try {
      const { data } = await api.post(`/projects/${projectId}/members`, { userId: selected });
      onAdded(data.members);
      toast.success('Member added!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-base border border-theme rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
          <h2 className="text-[15px] font-bold text-primary-t">Add Member</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-hover flex items-center justify-center text-secondary-t hover:bg-red-500/80 hover:text-primary-t transition-all duration-200">✕</button>
        </div>
        <form onSubmit={handleAdd} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Select User</label>
            <select value={selected} onChange={e => setSelected(e.target.value)} required
              className="w-full bg-hover border border-theme rounded-xl px-3 py-2.5 text-[13px] text-primary-t outline-none focus:border-indigo-500/50 transition-colors cursor-pointer">
              <option value="">-- Choose a user --</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-hover text-secondary-t text-[13px] font-medium hover:text-primary-t transition-all duration-200">Cancel</button>
            <button type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-primary-t text-[13px] font-semibold transition-all duration-200 disabled:opacity-50">
              {loading && <Loader2 size={13} className="animate-spin" />}
              Add Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Task Card ──────────────────────────────────────── */
function TaskCard({ task, onEdit, onDelete, onStatusChange, isAdmin, userId }) {
  const isOverdue = task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2, scale: 1.01 }}
      onClick={() => onEdit(task)}
      className="group p-3.5 rounded-xl bg-hover border border-theme cursor-pointer
        hover:border-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/10
        transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[13px] font-medium text-primary-t leading-snug flex-1">{task.title}</p>
        {(isAdmin || task.createdBy?._id === userId) && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(task._id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-muted-t hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 flex-shrink-0"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_STYLE[task.priority]}`}>
          {task.priority}
        </span>
        {isOverdue && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
            Overdue
          </span>
        )}
      </div>
      <div className="flex items-center justify-between mt-2.5">
        {task.assignedTo ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[9px] font-bold text-primary-t">
              {task.assignedTo.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-[11px] text-muted-t">{task.assignedTo.name}</span>
          </div>
        ) : <div />}
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-[10px] ${isOverdue ? 'text-red-400' : 'text-muted-t'}`}>
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Main Page ──────────────────────────────────────── */
export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [taskModal, setTaskModal] = useState(null);
  const [memberModal, setMemberModal] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
      setTasks(data.tasks || []);
    } catch {
      toast.error('Project not found');
      navigate('/projects');
    } finally { setLoading(false); }
  }, [id, navigate]);

  useEffect(() => { fetchProject(); }, [fetchProject]);

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(t => t._id !== taskId));
      toast.success('Task deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: data.status } : t));
    } catch (err) { toast.error('Failed to update status'); }
  };

  const handleTaskSaved = (savedTask, isNew) => {
    if (isNew) setTasks(prev => [savedTask, ...prev]);
    else setTasks(prev => prev.map(t => t._id === savedTask._id ? savedTask : t));
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      const { data } = await api.delete(`/projects/${id}/members/${userId}`);
      setProject(prev => ({ ...prev, members: data.members }));
      toast.success('Member removed');
    } catch { toast.error('Failed to remove member'); }
  };

  if (loading) return <div className="splash-loader"><div className="spinner" /></div>;
  if (!project) return null;

  const tasksByCol = (colId) => tasks.filter(t => t.status === colId);

  return (
    <div className="w-full space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/projects')} className="p-2 rounded-xl bg-hover border border-theme text-secondary-t hover:text-primary-t hover:bg-white/[0.08] transition-all duration-200">
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-primary-t">{project.title}</h1>
            <p className="text-[12px] text-muted-t">{project.description || 'No description'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {isAdmin && (
            <button onClick={() => setMemberModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-hover border border-theme text-secondary-t text-[13px] font-medium hover:bg-white/[0.08] hover:text-primary-t transition-all duration-200">
              <UserPlus size={14} /> Add Member
            </button>
          )}
          <button onClick={() => setTaskModal('new')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-primary-t text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30">
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-elevated border border-theme rounded-xl p-1 w-fit">
        {['tasks', 'members'].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-lg text-[13px] font-medium capitalize transition-all duration-200
              ${activeTab === t ? 'bg-white/[0.08] text-primary-t' : 'text-muted-t hover:text-secondary-t'}`}>
            {t} {t === 'tasks' ? `(${tasks.length})` : `(${project.members?.length || 0})`}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pb-6">
          {COLUMNS.map(col => {
            const colTasks = tasksByCol(col.id);
            return (
              <div key={col.id} className="rounded-2xl bg-card-t border border-theme p-3 flex flex-col gap-2">
                {/* Column header */}
                <div className="flex items-center justify-between px-1 pb-2 border-b border-theme">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className={`text-[12px] font-semibold ${col.color}`}>{col.label}</span>
                  </div>
                  <span className="text-[11px] text-muted-t bg-hover px-2 py-0.5 rounded-full">{colTasks.length}</span>
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-2 min-h-[120px]">
                  <AnimatePresence>
                    {colTasks.map(task => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onEdit={setTaskModal}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                        isAdmin={isAdmin}
                        userId={user._id}
                      />
                    ))}
                  </AnimatePresence>
                  {colTasks.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-20 text-muted-t text-[12px] border-2 border-dashed border-white/[0.04] rounded-xl"
                    >
                      Drop here
                    </motion.div>
                  )}
                </div>

                {/* Add button */}
                <button
                  onClick={() => setTaskModal('new')}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted-t hover:text-secondary-t hover:bg-hover text-[12px] font-medium transition-all duration-200"
                >
                  <Plus size={14} /> Add task
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Members tab */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {project.members?.map(member => (
            <div key={member._id} className="flex items-center justify-between p-4 rounded-2xl bg-elevated border border-theme hover:border-indigo-500/20 transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[13px] font-bold text-primary-t">
                  {member.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-primary-t">{member.name}</div>
                  <div className="text-[11px] text-muted-t">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
                  ${member.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-500/10 text-secondary-t'}`}>
                  {member.role}
                </span>
                {isAdmin && member._id !== user._id && (
                  <button onClick={() => handleRemoveMember(member._id)} className="p-1.5 rounded-lg text-muted-t hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
                    <UserMinus size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {taskModal && (
        <TaskModal
          task={taskModal === 'new' ? null : taskModal}
          projectId={id}
          members={project.members || []}
          onClose={() => setTaskModal(null)}
          onSaved={handleTaskSaved}
          isAdmin={isAdmin}
          currentUser={user}
        />
      )}
      {memberModal && (
        <AddMemberModal
          projectId={id}
          existingMembers={project.members || []}
          onClose={() => setMemberModal(false)}
          onAdded={(members) => setProject(prev => ({ ...prev, members }))}
        />
      )}
    </div>
  );
}
