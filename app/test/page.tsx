'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Testing...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('profiles').select('count')
        
        if (error) {
          setStatus(`Error: ${error.message}`)
        } else {
          setStatus('✅ Supabase connection successful!')
        }
      } catch (error: any) {
        setStatus(`Connection failed: ${error.message}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">{status}</div>
    </div>
  )
}