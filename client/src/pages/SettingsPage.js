import React, { useState } from 'react';
import { Settings, User, Bell, Lock, Palette, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'profile',  label: 'Profile',  icon: User },
  { id: 'notifs',   label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [tab, setTab] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = () => toast.success('Settings saved!');

  return (
    <div className="w-full space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-xl font-bold text-primary-t flex items-center gap-2">
          <Settings size={20} className="text-indigo-400" /> Settings
        </h1>
        <p className="text-[13px] text-muted-t mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                ${tab === id
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/20'
                  : 'text-muted-t hover:text-primary-t hover:bg-hover'}`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 rounded-2xl p-6 bg-elevated border border-theme backdrop-blur-sm">
          {tab === 'profile' && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold text-primary-t">Profile Settings</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-2xl font-bold text-primary-t">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-primary-t">{user?.name}</div>
                  <div className="text-[12px] text-muted-t capitalize">{user?.role} · {user?.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Full Name</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-hover border border-theme rounded-xl px-3 py-2.5 text-[13px] text-primary-t outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Email Address</label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-hover border border-theme rounded-xl px-3 py-2.5 text-[13px] text-primary-t outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-primary-t text-[13px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30"
              >
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}
          {tab === 'notifs' && (
            <div className="space-y-4">
              <h2 className="text-[15px] font-semibold text-primary-t">Notification Preferences</h2>
              {['Task assigned to me', 'Task due soon', 'Comment on my task', 'Project updates'].map(label => (
                <label key={label} className="flex items-center justify-between p-3 rounded-xl bg-card-t border border-theme cursor-pointer hover:bg-hover transition-colors">
                  <span className="text-[13px] text-secondary-t">{label}</span>
                  <div className="relative w-9 h-5 bg-indigo-600 rounded-full">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </label>
              ))}
            </div>
          )}
          {tab === 'security' && (
            <div className="space-y-5">
              <h2 className="text-[15px] font-semibold text-primary-t">Security</h2>
              <div>
                <label className="block text-[12px] font-medium text-secondary-t mb-1.5">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-hover border border-theme rounded-xl px-3 py-2.5 text-[13px] text-primary-t outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-secondary-t mb-1.5">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-hover border border-theme rounded-xl px-3 py-2.5 text-[13px] text-primary-t outline-none focus:border-indigo-500/50 transition-colors" />
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-primary-t text-[13px] font-semibold transition-all duration-200">
                <Save size={14} /> Update Password
              </button>
            </div>
          )}
          {tab === 'appearance' && (
            <div className="space-y-4">
              <h2 className="text-[15px] font-semibold text-primary-t">Appearance</h2>
              <div className="flex gap-3">
                {['dark', 'light'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => {
                      if (t !== theme) toggleTheme();
                      toast.success(`${t.charAt(0).toUpperCase() + t.slice(1)} theme activated!`);
                    }} 
                    className={`flex-1 py-3 rounded-xl text-[13px] font-medium border transition-all duration-200 capitalize ${theme === t ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-elevated border-theme text-secondary-t hover:text-primary-t'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-[12px] text-muted-t capitalize">{theme} theme is currently active and configured.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
