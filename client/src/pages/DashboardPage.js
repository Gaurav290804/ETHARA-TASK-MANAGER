import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from 'recharts';
import {
  CheckSquare, CheckCircle2, Clock, Zap, TrendingUp, TrendingDown, ArrowRight
} from 'lucide-react';
import ActivityTimeline from '../components/ActivityTimeline';
import AIAssistant from '../components/AIAssistant';

const SPARKLINE_COLORS = { purple: '#818cf8', green: '#34d399', amber: '#fbbf24', blue: '#60a5fa' };

const weekly = [
  { day: 'Mon', tasks: 4 }, { day: 'Tue', tasks: 7 }, { day: 'Wed', tasks: 5 },
  { day: 'Thu', tasks: 9 }, { day: 'Fri', tasks: 6 }, { day: 'Sat', tasks: 3 }, { day: 'Sun', tasks: 8 },
];
const area = [
  { week: 'W1', done: 8, created: 12 }, { week: 'W2', done: 14, created: 16 },
  { week: 'W3', done: 11, created: 13 }, { week: 'W4', done: 18, created: 20 },
  { week: 'W5', done: 22, created: 24 }, { week: 'W6', done: 19, created: 21 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base border border-theme rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-secondary-t mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

function StatCard({ label, value, icon: Icon, color, trend, trendUp, sparkData, sparkColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl p-5 border cursor-pointer
        bg-elevated border-theme backdrop-blur-sm
        hover:-translate-y-1 hover:shadow-2xl hover:border-theme
        transition-all duration-300 group"
      style={{ boxShadow: 'none' }}
    >
      {/* gradient blob */}
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 ${color === 'purple' ? 'bg-indigo-500' : color === 'green' ? 'bg-emerald-500' : color === 'amber' ? 'bg-amber-500' : 'bg-blue-500'}`} />

      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${color === 'purple' ? 'bg-indigo-500/15 text-indigo-400' :
            color === 'green'  ? 'bg-emerald-500/15 text-emerald-400' :
            color === 'amber'  ? 'bg-amber-500/15 text-amber-400' :
            'bg-blue-500/15 text-blue-400'}`}>
          <Icon size={18} />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full
            ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trend}
          </span>
        )}
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold text-primary-t">{value}</div>
        <div className="text-[12px] text-muted-t mt-0.5">{label}</div>
      </div>

      {/* sparkline */}
      <ResponsiveContainer width="100%" height={36}>
        <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sg-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SPARKLINE_COLORS[color]} stopOpacity={0.35} />
              <stop offset="100%" stopColor={SPARKLINE_COLORS[color]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={SPARKLINE_COLORS[color]} strokeWidth={2}
            fill={`url(#sg-${color})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

const PIE_COLORS = ['#818cf8', '#34d399', '#fbbf24'];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="splash-loader"><div className="spinner" /></div>;
  if (!data) return <div className="text-muted-t p-8">Failed to load dashboard.</div>;

  const todo = data.tasksByStatus?.todo ?? 0;
  const inProg = data.tasksByStatus?.['in-progress'] ?? 0;
  const done = data.tasksByStatus?.done ?? 0;
  const total = data.totalTasks ?? 0;
  const productivity = total > 0 ? Math.round((done / total) * 100) : 0;

  const pieData = [
    { name: 'Todo', value: todo },
    { name: 'In Progress', value: inProg },
    { name: 'Done', value: done },
  ].filter(d => d.value > 0);

  const spark = (vals) => vals.map((v, i) => ({ v, i }));

  const formatDate = (d) => d ? new Date(d).toLocaleDateString() : '—';

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1
          onClick={() => navigate('/dashboard')}
          className="text-xl font-bold text-primary-t cursor-pointer hover:text-indigo-300 transition-colors"
        >
          Dashboard
        </h1>
        <p className="text-[13px] text-muted-t mt-0.5">Welcome back, <span className="text-secondary-t font-medium">{user?.name}</span> 👋</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Tasks"   value={total}        icon={CheckSquare}  color="purple" trend="+12%" trendUp={true}  onClick={() => navigate('/projects')} sparkData={spark([3,5,4,7,6,8,total])} />
        <StatCard label="Completed"     value={done}         icon={CheckCircle2} color="green"  trend="+8%"  trendUp={true}  onClick={() => navigate('/projects')} sparkData={spark([1,2,3,4,3,5,done])}  />
        <StatCard label="In Progress"   value={inProg}       icon={Clock}        color="amber"  trend="-3%"  trendUp={false} onClick={() => navigate('/projects')} sparkData={spark([5,4,6,3,5,4,inProg])} />
        <StatCard label="Productivity"  value={`${productivity}%`} icon={Zap}   color="blue"   trend="+5%"  trendUp={true}  onClick={() => navigate('/projects')} sparkData={spark([60,65,70,68,72,75,productivity])} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart - spans 2 cols */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-primary-t">Task Activity</h2>
            <span className="text-[11px] text-muted-t bg-hover px-2.5 py-1 rounded-full border border-theme">Last 6 weeks</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={area} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gDone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gCreated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#34d399" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="done"    name="Completed" stroke="#818cf8" strokeWidth={2} fill="url(#gDone)"    dot={false} />
              <Area type="monotone" dataKey="created" name="Created"   stroke="#34d399" strokeWidth={2} fill="url(#gCreated)" dot={false} />
              <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-primary-t">Distribution</h2>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-40 text-muted-t text-sm">No data yet</div>
          )}
        </div>
      </div>

      {/* Weekly bar + activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar */}
        <div className="lg:col-span-2 rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-primary-t">Weekly Productivity</h2>
            <span className="text-[11px] text-muted-t bg-hover px-2.5 py-1 rounded-full border border-theme">This week</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tasks" name="Tasks" radius={[6, 6, 0, 0]} fill="url(#barGrad)" />
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Activity timeline */}
        <ActivityTimeline />
      </div>

      {/* AI Assistant + Recent Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Tasks */}
        <div className="xl:col-span-2">
          {data.recentTasks?.length > 0 ? (
            <div className="rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[14px] font-semibold text-primary-t">Recent Tasks</h2>
                <button onClick={() => navigate('/projects')} className="flex items-center gap-1 text-[12px] text-indigo-400 hover:text-indigo-300 transition-colors">
                  View all <ArrowRight size={12} />
                </button>
              </div>
              <div className="space-y-2">
                {data.recentTasks.map(task => (
                  <motion.div
                    key={task._id}
                    whileHover={{ x: 2 }}
                    onClick={() => navigate(`/projects/${task.projectId?._id || task.projectId}`)}
                    className="flex items-center justify-between p-3 rounded-xl bg-card-t border border-theme hover:bg-hover hover:border-indigo-500/20 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-primary-t truncate">{task.title}</div>
                      <div className="text-[11px] text-muted-t mt-0.5">
                        {task.projectId?.title} · Due {formatDate(task.dueDate)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
                        ${task.priority === 'high' ? 'bg-red-500/10 text-red-400' :
                          task.priority === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                          'bg-emerald-500/10 text-emerald-400'}`}>
                        {task.priority}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
                        ${task.status === 'done' ? 'bg-emerald-500/10 text-emerald-400' :
                          task.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-slate-500/10 text-secondary-t'}`}>
                        {task.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-elevated border border-theme backdrop-blur-sm h-full flex items-center justify-center">
              <div className="text-center py-8 text-muted-t text-[13px]">No recent tasks</div>
            </div>
          )}
        </div>

        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
}

