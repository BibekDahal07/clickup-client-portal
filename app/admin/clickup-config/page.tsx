'use client'
import { useAuth } from '@/contexts/auth-context'
import { useAdmin } from '@/hooks/useAdmin'
import { ClickUpConfig } from '@/components/ClickUpConfig'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ClickUpConfigPage() {
  const { user, loading: authLoading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    } else if (!authLoading && !adminLoading && !isAdmin) {
      router.push('/dashboard')
    }
  }, [user, authLoading, adminLoading, isAdmin, router])

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin')}
            className="text-blue-600 hover:text-blue-500 mb-4"
          >
            ← Back to Admin Panel
          </button>
          <h1 className="text-3xl font-bold text-gray-900">ClickUp Configuration</h1>
          <p className="text-gray-600 mt-2">Configure your ClickUp integration settings</p>
        </div>
        
        <ClickUpConfig />
      </div>
    </div>
  )
}