'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Notification = { id: string; title: string; body: string | null; is_read: boolean; created_at: string };

export default function TopNav({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;
      const { data } = await supabase.from('notifications')
        .select('id, title, body, is_read, created_at')
        .eq('profile_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(20);
      if (data) setNotifications(data as Notification[]);
    };
    load();

    const sub = supabase.auth.onAuthStateChange(() => load());
    return () => sub.data.subscription.unsubscribe();
  }, []);

  const unread = notifications.filter(n => !n.is_read).length;

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <>
      <header className="h-16 bg-[#0B0F14] border-b border-gray-800 flex items-center px-6 sticky top-0 z-30 relative">
        {/* Left — hamburger */}
        <button onClick={onToggleSidebar} className="text-gray-400 hover:text-white transition-colors p-1 -ml-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Center — logo */}
        <div className="flex-1 flex justify-center">
          <span className="text-sm font-extrabold tracking-tight">
            <span className="text-amber-400">CAMPUS</span>
            <span className="text-white"> Portal</span>
          </span>
        </div>

        {/* Right — bell */}
        <button onClick={() => setNotifOpen(v => !v)} className="relative text-gray-400 hover:text-white transition-colors p-1 -mr-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      </header>

      {/* Backdrop for notification panel */}
      {notifOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300" onClick={() => setNotifOpen(false)} />
      )}

      {/* Notification panel — slides in from right */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#0B0F14] z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out border-l border-gray-800 ${notifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <span className="text-white font-semibold text-sm">Notifications</span>
          <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm px-4">
              <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              No notifications yet
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`px-6 py-4 border-b border-gray-800 cursor-pointer transition-colors ${
                  n.is_read ? 'hover:bg-gray-900/50' : 'bg-gray-900/50 hover:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{n.title}</p>
                    {n.body && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{n.body}</p>}
                    <p className="text-xs text-gray-500 mt-2">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 mt-1.5" />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
            </div>
          ) : (
            notifications.map(n => (
              <button key={n.id} onClick={() => markRead(n.id)}
                className={`w-full text-left flex gap-3 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition ${n.is_read ? 'opacity-60' : ''}`}>
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.is_read ? 'bg-gray-300' : 'bg-amber-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.is_read ? 'font-medium text-gray-600' : 'font-bold text-gray-900'}`}>{n.title}</p>
                  {n.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>}
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(n.created_at)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
