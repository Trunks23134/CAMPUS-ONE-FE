export type SuperAdminTab = 'dashboard' | 'services' | 'users' | 'tenants'

export type SuperAdminNavItem = {
  tab: SuperAdminTab
  label: string
  href: string
}

export const superAdminNavItems: SuperAdminNavItem[] = [
  { tab: 'dashboard', label: 'Overview', href: '/admin/super' },
  { tab: 'services', label: 'Services', href: '/admin/super?tab=services' },
  { tab: 'users', label: 'Admin Users', href: '/admin/super?tab=users' },
  { tab: 'tenants', label: 'Tenants', href: '/admin/super?tab=tenants' },
]

export function resolveSuperAdminTab(tab: string | null | undefined): SuperAdminTab {
  if (tab === 'services' || tab === 'users' || tab === 'tenants') {
    return tab
  }

  return 'dashboard'
}