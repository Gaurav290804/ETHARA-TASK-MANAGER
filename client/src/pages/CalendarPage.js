import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Calendar, Clock, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

const PRIORITY_COLORS = { high: 'bg-red-500', medium: 'bg-amber-500', low: 'bg-emerald-500' };
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function MiniCalendar({ year, month, events }) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const getEventsForDay = (day) => {
    if (!day) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div>
      <div className="grid grid-cols-7 mb-2">
        {DAYS_OF_WEEK.map(d => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-t py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div key={i} className={`relative flex flex-col items-center py-1 px-0.5 rounded-lg transition-colors
              ${day ? 'hover:bg-hover cursor-pointer' : ''}
              ${isToday(day) ? 'bg-indigo-500/15 ring-1 ring-indigo-500/30' : ''}`}>
              <span className={`text-[12px] font-medium leading-none mb-1
                ${isToday(day) ? 'text-indigo-300' : day ? 'text-secondary-t' : 'text-transparent'}`}>
                {day || 0}
              </span>
              <div className="flex gap-0.5 flex-wrap justify-center">
                {dayEvents.slice(0, 3).map((ev, j) => (
                  <div key={j} className={`w-1.5 h-1.5 rounded-full ${PRIORITY_COLORS[ev.priority] || 'bg-indigo-500'}`} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() });

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setTasks(res.data.recentTasks || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="splash-loader"><div className="spinner" /></div>;

  const events = tasks
    .filter(t => t.dueDate)
    .map(t => ({ ...t, date: t.dueDate?.substring(0, 10) }));

  const now = new Date();
  const upcoming = tasks
    .filter(t => t.dueDate && t.status !== 'done')
    .map(t => ({ ...t, _date: new Date(t.dueDate) }))
    .filter(t => t._date >= now)
    .sort((a, b) => a._date - b._date)
    .slice(0, 8);

  const prevMonth = () => setCurrent(c => {
    if (c.month === 0) return { year: c.year - 1, month: 11 };
    return { year: c.year, month: c.month - 1 };
  });
  const nextMonth = () => setCurrent(c => {
    if (c.month === 11) return { year: c.year + 1, month: 0 };
    return { year: c.year, month: c.month + 1 };
  });

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-primary-t flex items-center gap-2">
          <Calendar size={20} className="text-indigo-400" /> Calendar
        </h1>
        <p className="text-[13px] text-muted-t mt-0.5">All your task deadlines in one place</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Main calendar */}
        <div className="xl:col-span-3 rounded-2xl p-6 bg-elevated border border-theme backdrop-blur-sm">
          {/* Calendar nav */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-bold text-primary-t">
              {MONTHS[current.month]} {current.year}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-xl bg-hover text-secondary-t hover:text-primary-t hover:bg-white/[0.08] transition-all duration-200">
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrent({ year: now.getFullYear(), month: now.getMonth() })}
                className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-[12px] font-semibold hover:bg-indigo-500/20 transition-all duration-200"
              >
                Today
              </button>
              <button onClick={nextMonth} className="p-2 rounded-xl bg-hover text-secondary-t hover:text-primary-t hover:bg-white/[0.08] transition-all duration-200">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <MiniCalendar year={current.year} month={current.month} events={events} />

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-theme">
            {[['High', 'bg-red-500'], ['Medium', 'bg-amber-500'], ['Low', 'bg-emerald-500']].map(([label, cls]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${cls}`} />
                <span className="text-[11px] text-muted-t">{label} priority</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming deadlines */}
        <div className="rounded-2xl p-5 bg-elevated border border-theme backdrop-blur-sm">
          <h2 className="text-[14px] font-semibold text-primary-t mb-4 flex items-center gap-2">
            <Clock size={14} className="text-indigo-400" /> Upcoming
          </h2>
          {upcoming.length === 0 ? (
            <div className="text-muted-t text-[13px] text-center py-10">
              <Calendar size={32} className="mx-auto mb-2 opacity-20" />
              No upcoming deadlines 🎉
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map(task => {
                const daysLeft = Math.ceil((task._date - now) / 86400000);
                const isUrgent = daysLeft <= 2;
                return (
                  <div key={task._id} className="p-3 rounded-xl bg-card-t border border-theme hover:border-indigo-500/20 hover:bg-hover transition-all duration-200">
                    <div className="text-[12px] font-semibold text-primary-t truncate">{task.title}</div>
                    <div className="flex items-center justify-between mt-1.5 gap-2">
                      <span className="text-[11px] text-muted-t truncate">{fmtDate(task.dueDate)}</span>
                      <span className={`flex-shrink-0 flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                        ${isUrgent ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {isUrgent && <AlertTriangle size={9} />}
                        {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft}d`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${PRIORITY_COLORS[task.priority] || 'bg-slate-500'}`} />
                      <span className="text-[10px] text-muted-t capitalize">{task.priority} priority</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
