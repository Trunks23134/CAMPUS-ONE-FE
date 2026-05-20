'use client'

import { useSearchParams } from 'next/navigation'
import { SectionCard } from '../../../components/common/SectionCard'
import { resolveSuperAdminTab, superAdminNavItems, type SuperAdminTab } from '../../../components/layout/superAdminNavigation'

type ServiceModule = 'alumni' | 'enrollment' | 'application' | 'graduation'
type ModuleStatus = 'online' | 'degraded' | 'offline'

type ServiceHealth = {
  module: ServiceModule
  status: ModuleStatus
  port: number
  version: string
  lastChecked: string
}

type AdminUser = {
  id: string
  full_name: string
  email: string
  role: string
  tenant_id: string
  status: 'active' | 'suspended'
}

const MOCK_HEALTH: ServiceHealth[] = [
  { module: 'alumni', status: 'online', port: 3002, version: '1.0.0', lastChecked: new Date().toISOString() },
  { module: 'enrollment', status: 'online', port: 3001, version: '1.0.0', lastChecked: new Date().toISOString() },
  { module: 'application', status: 'online', port: 3003, version: '1.0.0', lastChecked: new Date().toISOString() },
  { module: 'graduation', status: 'degraded', port: 3004, version: '1.0.0', lastChecked: new Date().toISOString() },
]

const MOCK_USERS: AdminUser[] = [
  { id: 'su-001', full_name: 'Super Admin', email: 'super@campus-one.edu', role: 'SUPER_ADMIN', tenant_id: 'global', status: 'active' },
  { id: 'aa-001', full_name: 'Alumni Admin', email: 'alumni.admin@campus-one.edu', role: 'ALUMNI_ADMIN', tenant_id: 'campus-one', status: 'active' },
  { id: 'sa-001', full_name: 'Student Admin', email: 'student.admin@campus-one.edu', role: 'STUDENT_ADMIN', tenant_id: 'campus-one', status: 'active' },
  { id: 'aa-002', full_name: 'Applicant Admin', email: 'app.admin@campus-one.edu', role: 'APPLICANT_ADMIN', tenant_id: 'campus-one', status: 'suspended' },
]

const MOCK_TENANTS = [
  { id: 'campus-one', name: 'Campus One (UST)', modules: ['alumni', 'enrollment', 'application', 'graduation'], status: 'active', plan: 'enterprise' },
]

export default function SuperAdminPage() {
  const searchParams = useSearchParams()
  const activeTab: SuperAdminTab = resolveSuperAdminTab(searchParams.get('tab'))

  const getStatusBadgeClass = (status: ModuleStatus | string): string => {
    if (status === 'online' || status === 'active') return 'status-pill success'
    if (status === 'degraded') return 'status-pill warning'
    if (status === 'offline' || status === 'suspended') return 'status-pill danger'
    return 'status-pill neutral'
  }

  return (
    <section className="dashboard-screen">
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <>
          <section className="dashboard-stats" aria-label="System summary">
            <article className="dashboard-stat">
              <strong className="tone-blue">{MOCK_HEALTH.filter(h => h.status === 'online').length}/{MOCK_HEALTH.length}</strong>
              <span>Services Online</span>
            </article>
            <article className="dashboard-stat">
              <strong className="tone-green">{MOCK_USERS.filter(u => u.status === 'active').length}</strong>
              <span>Active Admin Users</span>
            </article>
            <article className="dashboard-stat">
              <strong className="tone-violet">{MOCK_TENANTS.length}</strong>
              <span>Active Tenants</span>
            </article>
            <article className="dashboard-stat">
              <strong className="tone-amber">{MOCK_HEALTH.filter(h => h.status === 'degraded').length}</strong>
              <span>Degraded Services</span>
            </article>
          </section>

          <SectionCard title="Service Status" subtitle="Real-time health monitoring of all microservices.">
            <div className="resource-table-wrap">
              <table className="resource-table">
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
                  {MOCK_HEALTH.map((s) => (
                    <tr key={s.module}>
                      <td><strong>{s.module}</strong></td>
                      <td>{s.port}</td>
                      <td>v{s.version}</td>
                      <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666', fontSize: '0.85rem' }}>/api/v1/{s.module}/health</code></td>
                      <td><span className={getStatusBadgeClass(s.status)}>{s.status}</span></td>
                      <td className="muted">{new Date(s.lastChecked).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Event Bus Topics (Kafka)" subtitle="Async communication between microservices.">
            <div className="resource-table-wrap">
              <table className="resource-table">
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Module</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666' }}>graduation.verified.v1</code></td>
                    <td>graduation → alumni</td>
                    <td>Triggers alumni log creation and push notification</td>
                  </tr>
                  <tr>
                    <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666' }}>enrollment.subject.selected.v1</code></td>
                    <td>enrollment</td>
                    <td>Student adds subject to cart</td>
                  </tr>
                  <tr>
                    <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666' }}>enrollment.checkout.submitted.v1</code></td>
                    <td>enrollment</td>
                    <td>Enrollment confirmed button clicked</td>
                  </tr>
                  <tr>
                    <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666' }}>alumni.registration.submitted.v1</code></td>
                    <td>alumni</td>
                    <td>Alumni registration submitted (internal or legacy)</td>
                  </tr>
                  <tr>
                    <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666' }}>alumni.record.requested.v1</code></td>
                    <td>alumni</td>
                    <td>Document request (TOR, Diploma, etc.) submitted</td>
                  </tr>
                  <tr>
                    <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666' }}>auth.user.login.v1</code></td>
                    <td>auth</td>
                    <td>User login attempt</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        </>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <SectionCard title="Microservice Health" subtitle="Detailed view of all running microservices and their status.">
          <div className="resource-table-wrap">
            <table className="resource-table">
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
                {MOCK_HEALTH.map((s) => (
                  <tr key={s.module}>
                    <td><strong>{s.module}</strong></td>
                    <td>{s.port}</td>
                    <td>v{s.version}</td>
                    <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666', fontSize: '0.85rem' }}>/api/v1/{s.module}/health</code></td>
                    <td><span className={getStatusBadgeClass(s.status)}>{s.status}</span></td>
                    <td className="muted">{new Date(s.lastChecked).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <SectionCard title="Admin Users" subtitle="Manage administrator accounts and their roles across tenants.">
          <div className="resource-table-wrap">
            <table className="resource-table">
              <thead>
                <tr>
                  <th>Admin User</th>
                  <th>Role</th>
                  <th>Tenant</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div><strong>{u.full_name}</strong></div>
                      <div className="muted" style={{ marginTop: '4px', fontSize: '0.85rem' }}>{u.email}</div>
                    </td>
                    <td><code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '6px', color: '#666' }}>{u.role}</code></td>
                    <td>{u.tenant_id}</td>
                    <td><span className={getStatusBadgeClass(u.status)}>{u.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Tenants Tab */}
      {activeTab === 'tenants' && (
        <SectionCard title="Tenant Management" subtitle="Manage and monitor all registered tenants on the platform.">
          <div>
            {MOCK_TENANTS.map((t) => (
              <div key={t.id} className="dashboard-action-card" style={{ marginBottom: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>{t.name}</strong>
                      <span className="muted" style={{ marginTop: '4px', display: 'block', fontSize: '0.9rem' }}>tenant_id: {t.id}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span className={getStatusBadgeClass(t.status)}>{t.status}</span>
                      <span className="status-pill info" style={{ background: 'rgba(47, 128, 237, 0.12)', color: '#2f80ed' }}>{t.plan}</span>
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#666', display: 'block', marginBottom: '8px' }}>Enabled Modules:</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {t.modules.map((m) => (
                        <span key={m} className="status-pill warning" style={{ background: 'rgba(217, 119, 6, 0.12)', color: '#d97706', padding: '6px 12px', fontSize: '0.85rem' }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

    </section>
  )
}