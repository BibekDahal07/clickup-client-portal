import { AuthProvider } from '@/contexts/auth-context'
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClickUp Client Portal',
  description: 'Client portal for ClickUp tasks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}