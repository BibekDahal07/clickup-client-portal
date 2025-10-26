import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useProfile } from './useProfile'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Task = Database['public']['Tables']['tasks']['Row']

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { profile } = useProfile()

  useEffect(() => {
    if (user && profile?.client_id) {
      fetchTasks()
    } else {
      setLoading(false)
    }
  }, [user, profile])

  const fetchTasks = async () => {
    try {
      if (!profile?.client_id) return

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('client_id', profile.client_id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshTasks = async () => {
    if (!profile?.client_id) return
    
    try {
      // Call sync API to get latest tasks from ClickUp
      const response = await fetch('/api/sync-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          listId: 'your_default_list_id', // You'll set this
          clientEmail: user?.email,
          clientId: profile.client_id
        }),
      })

      if (response.ok) {
        await fetchTasks() // Refresh local tasks
      }
    } catch (error) {
      console.error('Error refreshing tasks:', error)
    }
  }

  return { tasks, loading, refreshTasks }
}