import React from 'react';
import { BarChart2, TrendingUp, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend
} from 'recharts';

const monthly = [
  { month: 'Jan', tasks: 32 }, { month: 'Feb', tasks: 41 }, { month: 'Mar', tasks: 38 },
  { month: 'Apr', tasks: 55 }, { month: 'May', tasks: 47 }, { month: 'Jun', tasks: 62 },
];
const teamData = [
  { name: 'Alice', completed: 24, assigned: 28 },
  { name: 'Bob',   completed: 18, assigned: 22 },
  { name: 'Carol', completed: 31, assigned: 35 },
  { name: 'Dave',  completed: 14, assigned: 19 },
];
const pieData = [
  { name: 'High', value: 30 }, { name: 'Medium', value: 45 }, { name: 'Low', value: 25 },
];
const PIE_COLORS = ['#ef4444', '#f59e0b', '#22c55e'];

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

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <motion.div variants={{ initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } }}
    className="rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
      <Icon size={18} />
    </div>
    <div className="text-2xl font-bold text-primary-t">{value}</div>
    <div className="text-[12px] text-muted-t">{label}</div>
    {sub && <div className="text-[11px] text-emerald-400 mt-1">{sub}</div>}
  </motion.div>
);

export default function AnalyticsPage() {
  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-primary-t flex items-center gap-2"><BarChart2 size={20} className="text-indigo-400" /> Analytics</h1>
        <p className="text-[13px] text-muted-t mt-0.5">Track productivity and performance metrics</p>
      </div>

      <motion.div initial="initial" animate="animate" variants={{ animate: { transition: { staggerChildren: 0.05 } } }} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total This Month" value="62"  icon={TrendingUp} color="bg-indigo-500/15 text-indigo-400" sub="+18% vs last month" />
        <StatCard label="Team Velocity"    value="87%" icon={BarChart2}  color="bg-emerald-500/15 text-emerald-400" sub="+5% improvement" />
        <StatCard label="Avg Completion"   value="3.2d" icon={Clock}     color="bg-amber-500/15 text-amber-400" sub="Down from 4.1d" />
        <StatCard label="Active Members"   value="4"   icon={Users}     color="bg-blue-500/15 text-blue-400" sub="All contributing" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm">
          <h2 className="text-[14px] font-semibold text-primary-t mb-4">Monthly Task Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="aGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="tasks" name="Tasks" stroke="#818cf8" strokeWidth={2} fill="url(#aGrad)" dot={{ fill: '#818cf8', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm">
          <h2 className="text-[14px] font-semibold text-primary-t mb-4">Priority Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm">
        <h2 className="text-[14px] font-semibold text-primary-t mb-4">Team Performance</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={teamData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
            <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: 12 }}>{v}</span>} />
            <Bar dataKey="assigned"  name="Assigned"  radius={[6,6,0,0]} fill="#334155" />
            <Bar dataKey="completed" name="Completed" radius={[6,6,0,0]} fill="#818cf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
