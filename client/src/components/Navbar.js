import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, ShieldCheck, LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <span>⚡</span>
        <span>TaskFlow</span>
      </div>

      <div className="navbar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <FolderKanban size={16} />
          <span>Projects</span>
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <ShieldCheck size={16} />
            <span>Admin</span>
          </NavLink>
        )}
      </div>

      <div className="navbar-user">
        <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>{user?.name}</span>
        <span className="user-badge">{user?.role}</span>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={14} style={{ marginRight: 4 }} />
          Logout
        </button>
      </div>
    </nav>
  );
}
