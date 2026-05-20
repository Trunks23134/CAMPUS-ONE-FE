import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminShell } from '../components/layout/AdminShell'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Campus Super Admin',
  description: 'Super admin portal for system administration, tenant management, and service health monitoring.',
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AdminShell>{children}</AdminShell>
        </Providers>
      </body>
    </html>
  )
}
