'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* Backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — slides in from left (hidden on mobile by default) */}
      <div className={`fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav onToggleSidebar={() => setSidebarOpen(v => !v)} />
        <main className="flex-1 overflow-y-auto w-full bg-gray-900">
          {children}
        </main>
      </div>
    </div>
  );
}
