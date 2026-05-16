import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-base overflow-hidden text-primary-t transition-colors duration-300">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div 
        className={`flex flex-col flex-1 min-w-0 min-h-screen overflow-hidden transition-all duration-300 ${collapsed ? 'ml-[80px]' : 'ml-[260px]'}`}
      >
        <TopHeader onToggleSidebar={() => setCollapsed(c => !c)} />
        <main className="flex-1 overflow-y-auto px-6 py-6 w-full max-w-[1600px] mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
