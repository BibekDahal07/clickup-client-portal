import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { supabase } from '@/lib/supabase'

// Simple admin check - you can enhance this with proper role-based auth later
const ADMIN_EMAILS = ['bibekdahal0807@gmail.com', 'muraridahal0807@gmail.com'] // Add your admin emails

export const useAdmin = () => {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setIsAdmin(ADMIN_EMAILS.includes(user.email!))
      setLoading(false)
    } else {
      setIsAdmin(false)
      setLoading(false)
    }
  }, [user])

  return { isAdmin, loading }
}