'use client';

import { useEffect, useRef, useState } from 'react';
import { logout } from '@/shared/auth.service';

type ServiceModule = 'alumni' | 'enrollment' | 'application' | 'graduation';
type ModuleStatus = 'online' | 'degraded';

type ServiceHealth = {
  module: ServiceModule;
  status: ModuleStatus;
  port: number;
  version: string;
  endpoint: string;
  lastChecked: string;
};

type TopicRow = {
  topic: string;
  module: string;
  description: string;
};

type AdminUserRow = {
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ALUMNI_ADMIN' | 'STUDENT_ADMIN' | 'APPLICANT_ADMIN';
  tenant: string;
  status: 'active' | 'suspended';
};

type TenantRow = {
  name: string;
  tenantId: string;
  status: 'active' | 'inactive';
  plan: 'enterprise' | 'standard';
  modules: string[];
};

const SERVICE_ROWS: ServiceHealth[] = [
  { module: 'alumni', status: 'online', port: 3002, version: 'v1.0.0', endpoint: '/api/v1/alumni/health', lastChecked: '12:48:06 AM' },
  { module: 'enrollment', status: 'online', port: 3001, version: 'v1.0.0', endpoint: '/api/v1/enrollment/health', lastChecked: '12:48:06 AM' },
  { module: 'application', status: 'online', port: 3003, version: 'v1.0.0', endpoint: '/api/v1/application/health', lastChecked: '12:48:06 AM' },
  { module: 'graduation', status: 'degraded', port: 3004, version: 'v1.0.0', endpoint: '/api/v1/graduation/health', lastChecked: '12:48:06 AM' },
];

const TOPIC_ROWS: TopicRow[] = [
  { topic: 'graduation.verified.v1', module: 'graduation -> alumni', description: 'Triggers alumni log creation and push notification' },
  { topic: 'enrollment.subject.selected.v1', module: 'enrollment', description: 'Student adds subject to cart' },
  { topic: 'enrollment.checkout.submitted.v1', module: 'enrollment', description: 'Enrollment confirmed button clicked' },
  { topic: 'alumni.registration.submitted.v1', module: 'alumni', description: 'Alumni registration submitted (internal or legacy)' },
  { topic: 'alumni.record.requested.v1', module: 'alumni', description: 'Document request (TOR, Diploma, etc.) submitted' },
  { topic: 'auth.user.login.v1', module: 'auth', description: 'User login attempt' },
];

const ADMIN_USERS: AdminUserRow[] = [
  { name: 'Super Admin', email: 'super@campus-one.edu', role: 'SUPER_ADMIN', tenant: 'global', status: 'active' },
  { name: 'Alumni Admin', email: 'alumni.admin@campus-one.edu', role: 'ALUMNI_ADMIN', tenant: 'campus-one', status: 'active' },
  { name: 'Student Admin', email: 'student.admin@campus-one.edu', role: 'STUDENT_ADMIN', tenant: 'campus-one', status: 'active' },
  { name: 'Applicant Admin', email: 'app.admin@campus-one.edu', role: 'APPLICANT_ADMIN', tenant: 'campus-one', status: 'suspended' },
];

const TENANTS: TenantRow[] = [
  {
    name: 'Campus One (UST)',
    tenantId: 'campus-one',
    status: 'active',
    plan: 'enterprise',
    modules: ['alumni', 'enrollment', 'application', 'graduation'],
  },
];

const NOTIFICATIONS = [
  { title: 'System health check', message: 'All microservices are operating normally.', time: '5 min ago' },
  { title: 'Admin user activity', message: 'Three new admin accounts were activated.', time: '1 hour ago' },
  { title: 'Tenant status update', message: 'Campus One enrollment module is showing optimal performance.', time: '2 hours ago' },
];

const metrics = [
  { value: '3/4', label: 'Services Online', tone: 'blue' },
  { value: '3', label: 'Active Admin Users', tone: 'green' },
  { value: '1', label: 'Active Tenants', tone: 'indigo' },
  { value: '1', label: 'Degraded Services', tone: 'amber' },
] as const;

function CampusCapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 8.7 12 4l9 4.7-9 4.7-9-4.7Z" />
      <path d="M6 10.3V14c0 1.4 2.7 2.6 6 2.6s6-1.2 6-2.6v-3.7" />
      <path d="M19.2 10.1v3.8" />
    </svg>
  );
}

function SidebarIcon({ kind }: { kind: 'overview' | 'services' | 'users' | 'tenants' | 'settings' | 'logout' }) {
  switch (kind) {
    case 'overview':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6v6H4z" /><path d="M14 5h6v3h-6z" /><path d="M14 10h6v9h-6z" /><path d="M4 13h6v6H4z" /></svg>;
    case 'services':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="1.6" /><circle cx="18.4" cy="12" r="1.6" /><circle cx="5.6" cy="12" r="1.6" /><path d="M12 5.6a6.4 6.4 0 1 1 0 12.8 6.4 6.4 0 0 1 0-12.8Z" /></svg>;
    case 'users':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16.5 20v-1.7a4.3 4.3 0 0 0-4.3-4.3H6.5A4.3 4.3 0 0 0 2.2 18.3V20" /><circle cx="9.5" cy="7.5" r="3.5" /><path d="M21.8 20v-1a4 4 0 0 0-3-3.9" /><path d="M16.7 4.1a3.2 3.2 0 0 1 0 6.2" /></svg>;
    case 'tenants':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V9l8-5 8 5v11" /><path d="M9 20v-7h6v7" /><path d="M2.5 20h19" /></svg>;
    case 'settings':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" /><path d="m19.4 13.1-.1-2.2 1.7-1.3-1.9-3.3-2 .5-1.8-1.2-.3-2.1h-3.8l-.3 2.1-1.8 1.2-2-.5-1.9 3.3 1.7 1.3-.1 2.2-1.6 1 1.9 3.3 1.9-.6 1.8 1.1.3 2.2h3.8l.3-2.2 1.8-1.1 1.9.6 1.9-3.3-1.6-1Z" /></svg>;
    case 'logout':
      return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5" /><path d="M15 16l4-4-4-4" /><path d="M19 12H9" /></svg>;
    default:
      return null;
  }
}

function NotificationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.6 17.2H8.4c1.1-1.3 1.4-2.4 1.4-4.4V10a2.2 2.2 0 1 1 4.4 0v2.8c0 2 .3 3.1 1.4 4.4Z" />
      <path d="M17.5 17.2H6.5" />
      <path d="M10.5 17.2a1.5 1.5 0 0 0 3 0" />
    </svg>
  );
}

function SectionCode({ children }: { children: string }) {
  return <span className="superadmin-code-chip">{children}</span>;
}

function UserRoleChip({ role }: { role: AdminUserRow['role'] }) {
  return <span className={`superadmin-role-chip superadmin-role-chip--${role.toLowerCase()}`}>{role}</span>;
}

function StatusChip({ status }: { status: AdminUserRow['status'] | ServiceHealth['status'] }) {
  return <span className={`superadmin-status-pill superadmin-status-pill--${status}`}>{status}</span>;
}

function TenantStatusChip({ status }: { status: TenantRow['status'] }) {
  return <span className={`superadmin-tenant-chip superadmin-tenant-chip--${status}`}>{status}</span>;
}

function TenantPlanChip({ plan }: { plan: TenantRow['plan'] }) {
  return <span className={`superadmin-tenant-chip superadmin-tenant-chip--${plan}`}>{plan}</span>;
}

type SuperAdminView = 'overview' | 'services' | 'users' | 'tenants' | 'settings';

function SettingsIcon({ type }: { type: 'lock' | 'bell' | 'mail' | 'shield' | 'download' }) {
  if (type === 'lock') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M8 10V8a4 4 0 0 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
  if (type === 'bell') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><path d="M8 9a4 4 0 1 1 8 0v3.2c0 .8.3 1.6.9 2.2l1 1.1H6.1l1-1.1c.6-.6.9-1.4.9-2.2V9" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M10 17a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
  if (type === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><rect x="4" y="6" width="16" height="12" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m5 8 7 5 7-5" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
  if (type === 'shield') return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><path d="M12 3 5 6v5c0 4.4 2.7 8.5 7 10 4.3-1.5 7-5.6 7-10V6l-7-3Z" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[14px] w-[14px]"><path d="M12 4v9" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m8.5 10.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="M5 18h14" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>;
}

function SettingsToggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-amber-500' : 'bg-slate-300'}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

function SettingsRow({ icon, title, description, action, clickable = false }: { icon: 'lock' | 'bell' | 'mail' | 'shield' | 'download'; title: string; description: string; action?: React.ReactNode; clickable?: boolean; }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-2 py-2 ${clickable ? 'hover:bg-slate-50' : ''}`}>
      <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f6d978] text-[#8f6a00]">
        <SettingsIcon type={icon} />
      </span>
      <span className="flex-1">
        <span className="block text-[1.05rem] font-extrabold leading-tight text-[#0c1d3d]">{title}</span>
        <span className="block text-[0.86rem] text-slate-500">{description}</span>
      </span>
      {action ?? <span className="text-[1.15rem] text-slate-400">&gt;</span>}
    </div>
  );
}

export default function SuperAdminPage() {
  const [activeView, setActiveView] = useState<SuperAdminView>('services');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(NOTIFICATIONS.length);
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!notificationPanelRef.current?.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const pageTitle =
    activeView === 'services'
      ? 'Microservice Health'
      : activeView === 'users'
        ? 'Admin Users'
        : activeView === 'tenants'
          ? 'Tenants'
          : activeView === 'settings'
            ? 'Settings'
          : 'Campus Overview';

  const pageSubtitle =
    activeView === 'services'
      ? 'Detailed view of all running microservices and their status.'
      : activeView === 'users'
        ? 'Manage administrator accounts and their roles across tenants.'
        : activeView === 'tenants'
          ? 'Manage and monitor all registered tenants on the platform.'
          : activeView === 'settings'
            ? 'Manage account preferences and security settings.'
          : 'System administration, tenant management, and service health monitoring.';

  return (
    <main className="superadmin-shell">
      <aside className="superadmin-sidebar">
        <div className="superadmin-brand">
          <div className="superadmin-brand-mark">
            <img src="/logo.png" alt="Campus One" className="superadmin-brand-image" />
          </div>
          <div className="superadmin-brand-copy">
            <div className="superadmin-brand-line"><span className="superadmin-brand-highlight">CAMPUS</span><span className="superadmin-brand-portal">Portal</span></div>
          </div>
        </div>

        <nav className="superadmin-nav" aria-label="Super admin navigation">
          <button className={`superadmin-nav-item ${activeView === 'overview' ? 'superadmin-nav-item--active' : ''}`} type="button" onClick={() => setActiveView('overview')}>
            <span className="superadmin-nav-icon"><SidebarIcon kind="overview" /></span>
            <span>Overview</span>
          </button>
          <button className={`superadmin-nav-item ${activeView === 'services' ? 'superadmin-nav-item--active' : ''}`} type="button" onClick={() => setActiveView('services')}>
            <span className="superadmin-nav-icon"><SidebarIcon kind="services" /></span>
            <span>Services</span>
          </button>
          <button className={`superadmin-nav-item ${activeView === 'users' ? 'superadmin-nav-item--active' : ''}`} type="button" onClick={() => setActiveView('users')}>
            <span className="superadmin-nav-icon"><SidebarIcon kind="users" /></span>
            <span>Admin Users</span>
          </button>
          <button className={`superadmin-nav-item ${activeView === 'tenants' ? 'superadmin-nav-item--active' : ''}`} type="button" onClick={() => setActiveView('tenants')}>
            <span className="superadmin-nav-icon"><SidebarIcon kind="tenants" /></span>
            <span>Tenants</span>
          </button>
        </nav>

        <div className="superadmin-sidebar-spacer" />

        <div className="superadmin-sidebar-actions">
          <button className="superadmin-sidebar-link" type="button" onClick={() => setActiveView('settings')}>
            <span className="superadmin-nav-icon superadmin-nav-icon--soft"><SidebarIcon kind="settings" /></span>
            <span>Settings</span>
          </button>
          <button className="superadmin-sidebar-link superadmin-sidebar-link--danger" type="button" onClick={logout}>
            <span className="superadmin-nav-icon superadmin-nav-icon--soft"><SidebarIcon kind="logout" /></span>
            <span>Log Out</span>
          </button>
        </div>

        <div className="superadmin-operations-card-wrap">
          <button className="superadmin-issue-pill" type="button">
            <span className="superadmin-issue-dot">N</span>
            <span>1 Issue</span>
            <span className="superadmin-issue-close">×</span>
          </button>

          <div className="superadmin-operations-card">
            <div className="superadmin-operations-avatar">AO</div>
            <div className="superadmin-operations-copy">
              <strong>Operations Desk</strong>
              <span>Schema-aligned admin</span>
            </div>
            <svg className="superadmin-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </div>
        </div>
      </aside>

      <div className="superadmin-main">
        <header className="superadmin-topbar">
          <div className="superadmin-title-block">
            <h1>Campus Super Admin</h1>
            <p>{pageSubtitle}</p>
          </div>

          <div ref={notificationPanelRef} className="relative">
            <button
              className="superadmin-notification-button"
              type="button"
              aria-label="Notifications"
              aria-expanded={isNotificationOpen}
              aria-controls="top-bar-notifications"
              onClick={() => {
                setIsNotificationOpen((current) => {
                  const nextOpen = !current;

                  if (nextOpen) {
                    setUnreadNotificationCount(0);
                  }

                  return nextOpen;
                });
              }}
            >
              <NotificationIcon />
              {unreadNotificationCount > 0 ? <span className="superadmin-notification-badge">{unreadNotificationCount}</span> : null}
            </button>

            {isNotificationOpen ? (
              <div
                id="top-bar-notifications"
                className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">Notifications</h2>
                    <p className="text-[11px] text-gray-500">Recent system updates.</p>
                  </div>
                  <span className="rounded-full bg-[#F59E0B] px-2 py-0.5 text-[10px] font-bold text-black">
                    {NOTIFICATIONS.length} new
                  </span>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {NOTIFICATIONS.map((notification) => (
                    <article key={notification.title} className="border-b border-gray-50 px-4 py-3 last:border-b-0 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#F59E0B]" />
                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold text-gray-800">{notification.title}</h3>
                          <p className="mt-0.5 text-xs text-gray-500">{notification.message}</p>
                          <small className="mt-1 block text-[10px] text-gray-400">{notification.time}</small>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <div className="superadmin-content">
          {activeView === 'overview' && (
            <section className="space-y-5" aria-label="Overview dashboard">
              <section className="superadmin-stats-grid" aria-label="Summary metrics">
                {metrics.map((metric) => (
                  <article className={`superadmin-stat-card superadmin-stat-card--${metric.tone}`} key={metric.label}>
                    <div className="superadmin-stat-value">{metric.value}</div>
                    <div className="superadmin-stat-label">{metric.label}</div>
                  </article>
                ))}
              </section>

              <section className="superadmin-panel superadmin-panel--services">
                <div className="superadmin-panel-header">
                  <h2>Service Status</h2>
                  <p>Real-time health monitoring of all microservices.</p>
                </div>

                <div className="superadmin-table-shell">
                  <table className="superadmin-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Port</th>
                        <th>Version</th>
                        <th>Health Endpoint</th>
                        <th>Status</th>
                        <th>Last Checked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SERVICE_ROWS.map((service) => (
                        <tr key={service.module}>
                          <td><strong>{service.module}</strong></td>
                          <td>{service.port}</td>
                          <td>{service.version}</td>
                          <td className="superadmin-endpoint-cell"><span className="superadmin-endpoint-text">{service.endpoint}</span></td>
                          <td className="superadmin-status-cell">
                            <StatusChip status={service.status} />
                          </td>
                          <td>{service.lastChecked}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="superadmin-panel superadmin-panel--topics">
                <div className="superadmin-panel-header">
                  <h2>Event Bus Topics (Kafka)</h2>
                  <p>Async communication between microservices.</p>
                </div>

                <div className="superadmin-table-shell superadmin-table-shell--topics">
                  <table className="superadmin-table superadmin-table--topics">
                    <thead>
                      <tr>
                        <th>Topic</th>
                        <th>Module</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOPIC_ROWS.map((topic) => (
                        <tr key={topic.topic}>
                          <td><SectionCode>{topic.topic}</SectionCode></td>
                          <td>{topic.module}</td>
                          <td>{topic.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </section>
          )}

          {activeView === 'services' && (
            <section className="superadmin-panel superadmin-panel--services">
              <div className="superadmin-panel-header">
                <h2>Service Status</h2>
                <p>Real-time health monitoring of all microservices.</p>
              </div>

              <div className="superadmin-table-shell">
                <table className="superadmin-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Port</th>
                      <th>Version</th>
                      <th>Health Endpoint</th>
                      <th>Status</th>
                      <th>Last Checked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICE_ROWS.map((service) => (
                      <tr key={service.module}>
                        <td><strong>{service.module}</strong></td>
                        <td>{service.port}</td>
                        <td>{service.version}</td>
                        <td className="superadmin-endpoint-cell"><span className="superadmin-endpoint-text">{service.endpoint}</span></td>
                        <td className="superadmin-status-cell">
                          <StatusChip status={service.status} />
                        </td>
                        <td>{service.lastChecked}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeView === 'users' && (
            <section className="superadmin-panel superadmin-panel--users">
              <div className="superadmin-panel-header">
                <h2>Admin Users</h2>
                <p>Manage administrator accounts and their roles across tenants.</p>
              </div>

              <div className="superadmin-table-shell superadmin-table-shell--users">
                <table className="superadmin-table superadmin-table--users">
                  <thead>
                    <tr>
                      <th>Admin User</th>
                      <th>Role</th>
                      <th>Tenant</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ADMIN_USERS.map((user) => (
                      <tr key={user.email}>
                        <td>
                          <div className="superadmin-user-name">{user.name}</div>
                          <div className="superadmin-user-email">{user.email}</div>
                        </td>
                        <td><UserRoleChip role={user.role} /></td>
                        <td className="superadmin-tenant-cell">{user.tenant}</td>
                        <td><StatusChip status={user.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeView === 'tenants' && (
            <section className="superadmin-panel superadmin-panel--tenants">
              <div className="superadmin-panel-header">
                <h2>Tenant Management</h2>
                <p>Manage and monitor all registered tenants on the platform.</p>
              </div>

              <div className="superadmin-tenant-card">
                {TENANTS.map((tenant) => (
                  <article key={tenant.tenantId} className="superadmin-tenant-panel">
                    <div className="superadmin-tenant-topline">
                      <div>
                        <h3>{tenant.name}</h3>
                        <p>tenant_id: {tenant.tenantId}</p>
                      </div>

                      <div className="superadmin-tenant-badges">
                        <TenantStatusChip status={tenant.status} />
                        <TenantPlanChip plan={tenant.plan} />
                      </div>
                    </div>

                    <div className="superadmin-tenant-modules-wrap">
                      <div className="superadmin-tenant-modules-label">Enabled Modules:</div>
                      <div className="superadmin-tenant-modules-list">
                        {tenant.modules.map((module) => (
                          <span className="superadmin-tenant-module-pill" key={module}>{module}</span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeView === 'settings' && (
            <section className="superadmin-panel superadmin-panel--settings">
              <div className="superadmin-panel-header">
                <h2>Settings</h2>
                <p>Manage account notifications and privacy.</p>
              </div>

              <div className="mx-auto w-full max-w-[1450px] space-y-4">
                <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
                  <h3 className="text-[18px] font-bold text-slate-950">Account</h3>
                  <div className="mt-4">
                    <SettingsRow icon="lock" title="Change Password" description="Update your account password" clickable />
                  </div>
                </section>

                <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
                  <h3 className="text-[18px] font-bold text-slate-950">Notifications</h3>
                  <div className="mt-4 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <SettingsRow icon="bell" title="Push Notifications" description="Receive app notifications" />
                      <SettingsToggle checked={true} onToggle={() => undefined} label="Toggle push notifications" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <SettingsRow icon="mail" title="Email Notifications" description="Receive updates via email" />
                      <SettingsToggle checked={true} onToggle={() => undefined} label="Toggle email notifications" />
                    </div>
                  </div>
                </section>

                <section className="rounded-[16px] border border-slate-200 bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:px-5 sm:py-5">
                  <h3 className="text-[18px] font-bold text-slate-950">Privacy &amp; Security</h3>
                  <div className="mt-4 space-y-5">
                    <SettingsRow icon="shield" title="Privacy Policy" description="View our privacy policy" clickable />
                    <SettingsRow icon="shield" title="Terms &amp; Conditions" description="View terms of service" clickable />
                    <SettingsRow icon="download" title="Download My Data" description="Export your personal data" clickable />
                  </div>
                </section>

                <button
                  className="mt-1 h-10 w-full rounded-[12px] bg-[#bf6060] text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(191,96,96,0.18)] transition hover:bg-[#b25353]"
                  type="button"
                  onClick={logout}
                >
                  Log Out
                </button>
              </div>
            </section>
          )}
        </div>
      </div>

      <style>{superAdminStyles}</style>
    </main>
  );
}

const superAdminStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  html, body {
    margin: 0;
    background: #f9f6ef;
  }

  body {
    overflow-x: hidden;
    font-family: 'Inter', sans-serif;
  }

  .superadmin-shell {
    min-height: 100vh;
    display: flex;
    background: linear-gradient(180deg, #faf7f1 0%, #f7f1e7 46%, #f3ecdf 100%);
    color: #0f172a;
  }

  .superadmin-sidebar {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 258px;
    flex: 0 0 258px;
    background: #030303;
    border-right: 1px solid rgba(255, 255, 255, 0.04);
    color: #fff;
    display: flex;
    flex-direction: column;
    padding: 18px 14px 16px;
    box-sizing: border-box;
  }

  .superadmin-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  .superadmin-brand-mark {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: #ffffff;
    display: grid;
    place-items: center;
    flex: 0 0 auto;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
    overflow: hidden;
  }

  .superadmin-brand-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .superadmin-brand-line {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: flex;
    align-items: baseline;
    gap: 0;
    line-height: 1;
  }

  .superadmin-brand-highlight {
    color: #f6a623;
  }

  .superadmin-brand-portal {
    color: #c8d2e1;
    margin-left: 4px;
    font-weight: 700;
  }

  .superadmin-nav {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 4px;
  }

  .superadmin-nav-item,
  .superadmin-sidebar-link {
    height: 54px;
    border: 0;
    border-radius: 18px;
    background: transparent;
    color: #d1d5db;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 0 16px;
    cursor: pointer;
    font-family: inherit;
    letter-spacing: -0.01em;
    text-align: left;
  }

  .superadmin-nav-item--active {
    background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04));
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
  }

  .superadmin-nav-item:hover,
  .superadmin-sidebar-link:hover {
    background: rgba(255,255,255,0.05);
  }

  .superadmin-nav-icon {
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
    opacity: 0.9;
    flex: 0 0 auto;
  }

  .superadmin-nav-icon svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .superadmin-nav-icon--soft {
    color: #cbd5e1;
  }

  .superadmin-sidebar-spacer {
    flex: 1 1 auto;
    min-height: 20px;
  }

  .superadmin-sidebar-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 14px;
  }

  .superadmin-sidebar-link--danger {
    color: #fca5a5;
  }

  .superadmin-operations-card-wrap {
    position: relative;
    padding-top: 16px;
  }

  .superadmin-issue-pill {
    position: absolute;
    left: 0;
    bottom: 31px;
    height: 38px;
    border: 0;
    border-radius: 13px;
    padding: 0 12px 0 9px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: #d43c3c;
    color: #fff;
    font-weight: 700;
    font-size: 12px;
    box-shadow: 0 14px 24px rgba(212, 60, 60, 0.3);
  }

  .superadmin-issue-dot {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.16);
    display: grid;
    place-items: center;
    font-weight: 600;
  }

  .superadmin-issue-close {
    opacity: 0.9;
    font-size: 17px;
    line-height: 1;
  }

  .superadmin-operations-card {
    height: 60px;
    border-radius: 18px;
    background: linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.04));
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    color: #f8fafc;
  }

  .superadmin-operations-avatar {
    width: 36px;
    height: 36px;
    border-radius: 999px;
    background: linear-gradient(180deg, #9bb3ff 0%, #7996ff 100%);
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 700;
    flex: 0 0 auto;
    letter-spacing: -0.03em;
  }

  .superadmin-operations-copy {
    display: flex;
    flex-direction: column;
    min-width: 0;
    flex: 1;
    padding-top: 1px;
  }

  .superadmin-operations-copy strong {
    font-size: 14px;
    line-height: 1.05;
    font-weight: 700;
  }

  .superadmin-operations-copy span {
    font-size: 10px;
    margin-top: 1px;
    color: #9aa6bc;
  }

  .superadmin-chevron {
    width: 13px;
    height: 13px;
    fill: none;
    stroke: #9aa6bc;
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
    flex: 0 0 auto;
  }

  .superadmin-main {
    flex: 1;
    min-width: 0;
  }

  .superadmin-topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    height: 76px;
    padding: 0 28px 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: linear-gradient(180deg, rgba(250,247,241,0.98), rgba(250,247,241,0.88));
    border-bottom: 1px solid rgba(148, 163, 184, 0.16);
    backdrop-filter: blur(10px);
  }

  .superadmin-title-block h1 {
    margin: 0;
    font-size: 17px;
    line-height: 1.1;
    color: #0f172a;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .superadmin-title-block p {
    margin: 3px 0 0;
    font-size: 14px;
    line-height: 1.2;
    color: #64748b;
  }

  .superadmin-notification-button {
    position: relative;
    width: 46px;
    height: 46px;
    border-radius: 16px;
    border: 0;
    background: #fffdf8;
    display: grid;
    place-items: center;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
    color: #0f172a;
  }

  .superadmin-notification-button svg {
    width: 21px;
    height: 21px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .superadmin-notification-badge {
    position: absolute;
    top: -3px;
    right: -2px;
    min-width: 19px;
    height: 19px;
    padding: 0 4px;
    border-radius: 999px;
    background: #d94c4c;
    color: #fff;
    font-size: 12px;
    line-height: 19px;
    font-weight: 800;
    text-align: center;
    box-shadow: 0 0 0 2px #f7f7f8;
  }

  .superadmin-content {
    padding: 18px 20px 28px;
  }

  .superadmin-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }

  .superadmin-stat-card {
    height: 102px;
    border-radius: 22px;
    background: #fffdf8;
    border: 1px solid rgba(148, 163, 184, 0.18);
    box-shadow: 0 18px 40px rgba(15, 23, 42, 0.05);
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .superadmin-stat-card--blue .superadmin-stat-value { color: #3d63ff; }
  .superadmin-stat-card--green .superadmin-stat-value { color: #0f9d58; }
  .superadmin-stat-card--indigo .superadmin-stat-value { color: #6b6efb; }
  .superadmin-stat-card--amber .superadmin-stat-value { color: #d98b00; }

  .superadmin-stat-value {
    font-size: 28px;
    line-height: 1;
    letter-spacing: -0.05em;
    font-weight: 800;
    margin-bottom: 12px;
  }

  .superadmin-stat-label {
    color: #64748b;
    font-size: 16px;
    line-height: 1.1;
    font-weight: 500;
  }

  .superadmin-panel {
    border-radius: 30px;
    background: #fffdf8;
    border: 1px solid rgba(148, 163, 184, 0.16);
    box-shadow: 0 18px 44px rgba(15, 23, 42, 0.05);
    padding: 18px 18px 16px;
    margin-bottom: 18px;
  }

  .superadmin-panel--services {
    min-height: 458px;
  }

  .superadmin-panel--users {
    min-height: 472px;
  }

  .superadmin-panel--tenants {
    min-height: 272px;
  }

  .superadmin-panel--topics {
    min-height: 438px;
  }

  .superadmin-panel-header {
    padding: 4px 0 14px;
  }

  .superadmin-panel-header h2 {
    margin: 0 0 7px;
    font-size: 22px;
    line-height: 1.05;
    color: #0f172a;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .superadmin-panel-header p {
    margin: 0;
    font-size: 15px;
    line-height: 1.15;
    color: #64748b;
  }

  .superadmin-table-shell {
    overflow: hidden;
    border-radius: 24px;
  }

  .superadmin-table-shell--users {
    overflow: hidden;
    border-radius: 24px;
  }

  .superadmin-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .superadmin-table thead th {
    text-align: left;
    padding: 15px 14px 14px;
    color: #5c6a86;
    font-size: 13px;
    line-height: 1;
    letter-spacing: 0.01em;
    font-weight: 700;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .superadmin-table tbody td {
    padding: 14px 14px;
    border-top: 1px solid rgba(148, 163, 184, 0.18);
    color: #0f172a;
    font-size: 16px;
    line-height: 1.15;
    vertical-align: middle;
  }

  .superadmin-table tbody tr:first-child td {
    border-top: 1px solid rgba(148, 163, 184, 0.18);
  }

  .superadmin-table tbody td strong {
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .superadmin-table tbody td:nth-child(1) { width: 22%; }
  .superadmin-table tbody td:nth-child(2) { width: 10%; }
  .superadmin-table tbody td:nth-child(3) { width: 12%; }
  .superadmin-table tbody td:nth-child(4) { width: 29%; }
  .superadmin-table tbody td:nth-child(5) { width: 13%; }
  .superadmin-table tbody td:nth-child(6) {
    width: 14%;
    white-space: nowrap;
    color: #496086;
  }

  .superadmin-table--users tbody td:nth-child(1) { width: 38%; }
  .superadmin-table--users tbody td:nth-child(2) { width: 20%; }
  .superadmin-table--users tbody td:nth-child(3) { width: 24%; }
  .superadmin-table--users tbody td:nth-child(4) { width: 18%; }

  .superadmin-user-name {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.1;
    margin-bottom: 6px;
  }

  .superadmin-user-email {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.1;
  }

  .superadmin-tenant-cell {
    color: #0f172a;
    font-size: 16px;
    white-space: nowrap;
  }

  .superadmin-role-chip {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    padding: 0 8px;
    border-radius: 6px;
    background: #f5f5f5;
    color: #95a1b6;
    font-size: 11px;
    line-height: 1;
    letter-spacing: 0.02em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  }

  .superadmin-role-chip--super_admin,
  .superadmin-role-chip--alumni_admin,
  .superadmin-role-chip--student_admin,
  .superadmin-role-chip--applicant_admin {
    background: #f6f7f9;
    color: #95a1b6;
  }

  .superadmin-tenant-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .superadmin-tenant-panel {
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 22px;
    padding: 18px 18px 16px;
    background: #fff;
  }

  .superadmin-tenant-topline {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .superadmin-tenant-topline h3 {
    margin: 0 0 5px;
    font-size: 17px;
    line-height: 1.1;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .superadmin-tenant-topline p {
    margin: 0;
    font-size: 13px;
    color: #64748b;
  }

  .superadmin-tenant-badges {
    display: flex;
    gap: 8px;
    align-items: center;
    flex: 0 0 auto;
  }

  .superadmin-tenant-chip {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    text-transform: lowercase;
  }

  .superadmin-tenant-chip--active {
    background: #d8eee4;
    color: #0f7b4e;
  }

  .superadmin-tenant-chip--inactive {
    background: #fae7d0;
    color: #ca7f00;
  }

  .superadmin-tenant-chip--enterprise {
    background: #dce8ff;
    color: #3f6fe0;
  }

  .superadmin-tenant-chip--standard {
    background: #edf2ff;
    color: #5b6f99;
  }

  .superadmin-tenant-modules-wrap {
    margin-top: 16px;
  }

  .superadmin-tenant-modules-label {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 10px;
  }

  .superadmin-tenant-modules-list {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .superadmin-tenant-module-pill {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    background: #fef2df;
    color: #ef8f00;
    font-size: 13px;
    font-weight: 700;
    text-transform: lowercase;
  }

  .superadmin-endpoint-cell {
    overflow: hidden;
  }

  .superadmin-status-cell {
    white-space: nowrap;
    overflow: visible;
    padding-left: 8px;
  }

  .superadmin-endpoint-text {
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #718096;
    font-size: 13px;
    line-height: 1;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  }

  .superadmin-code-chip {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 7px;
    background: #f6f7f9;
    border: 1px solid rgba(148, 163, 184, 0.15);
    color: #5b667c;
    font-size: 14px;
    line-height: 1;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  }

  .superadmin-status-pill {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;
    text-transform: lowercase;
  }

  .superadmin-status-pill--online {
    background: #d8eee4;
    color: #0f7b4e;
  }

  .superadmin-status-pill--degraded {
    background: #fae7d0;
    color: #ca7f00;
  }

  .superadmin-table--topics tbody td:nth-child(1) { width: 29%; }
  .superadmin-table--topics tbody td:nth-child(2) { width: 23%; }
  .superadmin-table--topics tbody td:nth-child(3) { width: 48%; }

  .superadmin-table-shell--topics .superadmin-table tbody td {
    font-size: 16px;
  }

  @media (max-width: 1180px) {
    .superadmin-sidebar {
      width: 244px;
      flex-basis: 244px;
    }

    .superadmin-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 860px) {
    .superadmin-shell {
      flex-direction: column;
    }

    .superadmin-sidebar {
      position: relative;
      width: 100%;
      flex-basis: auto;
      height: auto;
    }

    .superadmin-topbar {
      padding-inline: 16px;
    }

    .superadmin-content {
      padding-inline: 16px;
    }

    .superadmin-stats-grid {
      grid-template-columns: 1fr;
    }
  }
`;
