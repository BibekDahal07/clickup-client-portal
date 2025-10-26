'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Profile = Database['public']['Tables']['profiles']['Row'] & {
  clients?: Database['public']['Tables']['clients']['Row']
  auth_users?: { email: string }[]
}
type Client = Database['public']['Tables']['clients']['Row']

export const UserManager = () => {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // First get all profiles with their client info
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          clients (*)
        `)
        .order('created_at', { ascending: false })

      if (profilesError) throw profilesError

      // Get clients list
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('name')

      if (clientsError) throw clientsError

      setProfiles(profilesData || [])
      setClients(clientsData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateUserClient = async (profileId: string, clientId: string | null) => {
    setUpdating(profileId)
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ client_id: clientId })
        .eq('id', profileId)

      if (error) throw error

      await fetchData() // Refresh data
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error updating user')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return <div className="p-6">Loading users...</div>
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">User Management</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {profiles.map((profile) => (
              <tr key={profile.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {profile.full_name || 'No name set'}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {profile.id.substring(0, 8)}...
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {profile.clients?.name || 'Not assigned'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <select
                      value={profile.client_id || ''}
                      onChange={(e) => updateUserClient(profile.id, e.target.value || null)}
                      disabled={updating === profile.id}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">No client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    {updating === profile.id && (
                      <span className="text-xs text-gray-500">Updating...</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(profile.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {profiles.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No users found. Users will appear here when they sign up.
          </div>
        )}
      </div>
    </div>
  )
}