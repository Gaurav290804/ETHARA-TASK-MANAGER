import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Plus, Users, Trash2, Search, FolderKanban, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { EmptyProjects } from '../components/EmptyStates';

function CreateProjectModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/projects', form);
      onCreated(data);
      toast.success('Project created!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally { setLoading(false); }
  };

  const inputCls = "w-full bg-hover border border-theme rounded-xl px-3 py-2.5 text-[13px] text-primary-t outline-none focus:border-indigo-500/50 transition-colors";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-base border border-theme rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme">
          <h2 className="text-[15px] font-bold text-primary-t">New Project</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-hover flex items-center justify-center text-secondary-t hover:bg-red-500/80 hover:text-primary-t transition-all duration-200">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Project Title *</label>
            <input id="project-title" className={inputCls} placeholder="e.g. Website Redesign" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Description</label>
            <textarea id="project-desc" className={inputCls} placeholder="What is this project about?" rows={3} style={{ resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl bg-hover text-secondary-t text-[13px] font-medium hover:text-primary-t hover:bg-white/[0.08] transition-all duration-200">Cancel</button>
            <button id="create-project-submit" type="submit" disabled={loading} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-primary-t text-[13px] font-semibold transition-all duration-200 disabled:opacity-50">
              {loading && <Loader2 size={13} className="animate-spin" />}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/projects')
      .then(res => setProjects(res.data))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects(prev => prev.filter(p => p._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete project'); }
  };

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="splash-loader"><div className="spinner" /></div>;

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary-t flex items-center gap-2">
            <FolderKanban size={20} className="text-indigo-400" /> Projects
          </h1>
          <p className="text-[13px] text-muted-t mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-hover border border-theme rounded-xl px-3 py-2 w-56 focus-within:border-indigo-500/40 transition-all duration-200">
            <Search size={14} className="text-muted-t flex-shrink-0" />
            <input placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} className="bg-transparent border-none outline-none text-[13px] text-secondary-t placeholder-slate-600 w-full" />
          </div>
          {isAdmin && (
            <button id="new-project-btn" onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-primary-t text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30">
              <Plus size={14} /> New Project
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyProjects onAdd={isAdmin ? () => setShowModal(true) : null} />
      ) : (
        <motion.div 
          initial="initial" animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filtered.map((project, i) => (
            <motion.div
              key={project._id}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="group relative rounded-2xl p-5 bg-elevated border border-theme cursor-pointer
                hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10
                transition-all duration-300 flex flex-col gap-3"
            >
              {/* gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="flex items-start justify-between">
                <h2 className="text-[14px] font-bold text-primary-t transition-colors">{project.title}</h2>
                {isAdmin && (
                  <button onClick={e => handleDelete(project._id, e)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-t hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <p className="text-[12px] text-muted-t leading-relaxed flex-1">
                {project.description || <em className="not-italic text-muted-t">No description</em>}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-theme">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-t">
                  <Users size={12} />
                  <span>{project.members?.length || 0} member{project.members?.length !== 1 ? 's' : ''}</span>
                </div>
                <span className="text-[11px] text-muted-t">
                  {new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {showModal && (
        <CreateProjectModal onClose={() => setShowModal(false)} onCreated={p => setProjects(prev => [p, ...prev])} />
      )}
    </div>
  );
}
