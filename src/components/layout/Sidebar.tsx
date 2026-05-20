'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { resolveSuperAdminTab, superAdminNavItems, type SuperAdminTab } from './superAdminNavigation'

type NavItem = {
  label: string
  href: string
  icon: 'dashboard' | 'services' | 'users' | 'tenants'
  tab: SuperAdminTab
}

const navItems: NavItem[] = superAdminNavItems.map((item) => ({
  href: item.href,
  label: item.label,
  tab: item.tab,
  icon: item.tab === 'dashboard' ? 'dashboard' : item.tab,
}))

function NavIcon({ type }: { type: NavItem['icon'] }) {
  if (type === 'dashboard') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h6V4H4z" /><path d="M14 20h6V10h-6z" /><path d="M14 4h6v4h-6z" /><path d="M4 16h6v4H4z" /></svg>
  }

  if (type === 'services') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" /><path d="M19 12a7 7 0 11-14 0 7 7 0 0114 0" /></svg>
  }

  if (type === 'users') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  }

  if (type === 'tenants') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16" /><path d="M4 12h16" /></svg>
}

function SettingsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" /><path d="M19.4 15a7.96 7.96 0 0 0 .1-1 7.96 7.96 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7.5 7.5 0 0 0-1.7-1l-.4-2.6H9.1l-.4 2.6a7.5 7.5 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a7.96 7.96 0 0 0-.1 1 7.96 7.96 0 0 0 .1 1l-2 1.5 2 3.5 2.4-1a7.5 7.5 0 0 0 1.7 1l.4 2.6h5.8l.4-2.6a7.5 7.5 0 0 0 1.7-1l2.4 1 2-3.5-2-1.5Z" /></svg>
}

function LogoutIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17l1.5-1.5L8 12h10" /><path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M14 20H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h7" /></svg>
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = resolveSuperAdminTab(searchParams.get('tab'))
  const isSuperAdminPanel = pathname === '/admin/super' || pathname === '/'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/login')
  }

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark" aria-hidden="true">
            <img src="/campus-one-logo.png" alt="Campus One" className="w-full h-full object-contain" />
          </div>

          <div className="sidebar-brand-copy">
            <div className="sidebar-brand-name">
              <span className="sidebar-brand-campus">CAMPUS</span>
              <span className="sidebar-brand-portal">Portal</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = isSuperAdminPanel && activeTab === item.tab
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? 'active' : ''}
            >
              <span className="sidebar-item-icon" aria-hidden="true">
                <NavIcon type={item.icon} />
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-actions">
          <button className="sidebar-footer-link" type="button">
            <span className="sidebar-item-icon sidebar-footer-icon" aria-hidden="true">
              <SettingsIcon />
            </span>
            <span>Settings</span>
          </button>

          <button className="sidebar-footer-link sidebar-footer-link--danger" type="button" onClick={handleLogout}>
            <span className="sidebar-item-icon sidebar-footer-icon" aria-hidden="true">
              <LogoutIcon />
            </span>
            <span>Log Out</span>
          </button>
        </div>

        <div className="sidebar-ops-card" aria-label="Operations Desk">
          <span className="sidebar-ops-avatar" aria-hidden="true">AO</span>
          <span className="sidebar-ops-copy">
            <strong>Operations Desk</strong>
            <span>Schema-aligned admin</span>
          </span>
          <span className="sidebar-ops-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 10l4 4 4-4" /></svg>
          </span>
        </div>
      </div>
    </aside>
  )
}
