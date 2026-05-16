import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, UserPlus, MessageSquare, RefreshCw, AlertCircle } from 'lucide-react';

const EVENTS = [
  { id: 1, type: 'completed', user: 'Alice M.', avatar: 'A', task: 'Design System v2', time: '2 min ago', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 2, type: 'assigned',  user: 'Bob K.',   avatar: 'B', task: 'API Integration', time: '18 min ago', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 3, type: 'comment',   user: 'Carol T.',  avatar: 'C', task: 'Dashboard UI',   time: '42 min ago', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
  { id: 4, type: 'updated',   user: 'Dave R.',   avatar: 'D', task: 'Auth Module',    time: '1 hr ago', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  { id: 5, type: 'completed', user: 'Eve S.',    avatar: 'E', task: 'Unit Tests',     time: '2 hrs ago', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  { id: 6, type: 'assigned',  user: 'Frank L.',  avatar: 'F', task: 'Mobile Layout',  time: '3 hrs ago', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
];

const TYPE_CONFIG = {
  completed: { Icon: CheckCircle2, label: 'completed task' },
  assigned:  { Icon: UserPlus,     label: 'was assigned to' },
  comment:   { Icon: MessageSquare, label: 'commented on' },
  updated:   { Icon: RefreshCw,    label: 'updated task' },
};

export default function ActivityTimeline() {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl bg-elevated border border-theme p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[15px] font-semibold text-primary-t">Activity Timeline</h2>
        <span className="text-[11px] text-muted-t bg-hover px-2.5 py-1 rounded-full border border-theme">
          Today
        </span>
      </div>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        <div className="space-y-1">
          {EVENTS.map((ev, i) => {
            const { Icon, label } = TYPE_CONFIG[ev.type] || { Icon: AlertCircle, label: 'did something to' };
            return (
              <div
                key={ev.id}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-elevated transition-all duration-200 group"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                {/* icon bubble */}
                <div className={`relative z-10 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border ${ev.border} ${ev.bg} mt-0.5`}>
                  <Icon size={14} className={ev.color} />
                </div>

                {/* content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* avatar */}
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-primary-t flex-shrink-0">
                      {ev.avatar}
                    </div>
                    <span className="text-[13px] font-semibold text-primary-t">{ev.user}</span>
                    <span className="text-[13px] text-muted-t">{label}</span>
                    <span className="text-[13px] font-medium text-indigo-400 truncate">{ev.task}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-full border ${ev.border} ${ev.bg} ${ev.color}`}>
                      {ev.type}
                    </span>
                    <span className="text-[11px] text-muted-t">{ev.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button 
        onClick={() => navigate('/projects')}
        className="mt-4 w-full text-center text-[12px] text-muted-t hover:text-indigo-400 transition-colors duration-200 py-2 border-t border-theme"
      >
        View all activity →
      </button>
    </div>
  );
}
