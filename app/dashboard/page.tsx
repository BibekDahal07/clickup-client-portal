'use client'
import { useAuth } from '@/contexts/auth-context'
import { useProfile } from '@/hooks/useProfile'
import { useTasks } from '@/hooks/useTasks'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAdmin } from '@/hooks/useAdmin'

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useProfile()
  const { tasks, loading: tasksLoading, refreshTasks } = useTasks()
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()
  const { isAdmin } = useAdmin()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleSyncTasks = async () => {
    setSyncing(true)
    await refreshTasks()
    setSyncing(false)
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'todo': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-orange-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex gap-4">
            {isAdmin && (
              <button
                onClick={() => router.push('/admin')}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={handleSyncTasks}
              disabled={syncing || !profile?.client_id}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Tasks'}
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to your Client Portal!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
              <p className="text-gray-600"><strong>Name:</strong> {profile?.full_name || 'Not set'}</p>
              <p className="text-gray-600"><strong>Client ID:</strong> {profile?.client_id ? 'Assigned' : 'Not assigned'}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-blue-800">
                <strong>Next Steps:</strong> Click "Sync Tasks" to load your tasks from ClickUp.
                {!profile?.client_id && (
                  <span className="block mt-2 text-orange-600">
                    Note: Your account needs to be assigned to a client to see tasks.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tasks Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Your Tasks</h3>
            <div className="text-sm text-gray-500">
              {tasksLoading ? 'Loading...' : `${tasks.length} tasks`}
            </div>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {profile?.client_id 
                  ? "No tasks found. Click 'Sync Tasks' to load tasks from ClickUp."
                  : "Your account is not yet assigned to a client. Please contact support."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{task.title}</h4>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      {task.priority && (
                        <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority} priority
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Due: {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}</span>
                    <span>Updated: {new Date(task.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
