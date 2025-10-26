'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

type Client = Database['public']['Tables']['clients']['Row'] & {
  clickup_config?: {
    list_id: string
    custom_field_id: string
  }
}

export const ClickUpConfig = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [configs, setConfigs] = useState<Record<string, { listId: string; customFieldId: string }>>({})

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name')

      if (error) throw error

      setClients(data || [])
      
      // Initialize configs
      const initialConfigs: Record<string, { listId: string; customFieldId: string }> = {}
      data?.forEach(client => {
        initialConfigs[client.id] = { listId: '', customFieldId: 'client_email' } // Default custom field
      })
      setConfigs(initialConfigs)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async (clientId: string) => {
    setSaving(clientId)
    
    try {
      // In a real app, you'd store this in a separate table
      // For now, we'll just alert the configuration
      alert(`Configuration for client ${clientId}:
List ID: ${configs[clientId]?.listId}
Custom Field: ${configs[clientId]?.customFieldId || 'client_email'}

This would be saved to your database in a real implementation.`)
      
      // Example of how you'd save it:
      // const { error } = await supabase
      //   .from('client_clickup_config')
      //   .upsert({
      //     client_id: clientId,
      //     list_id: configs[clientId].listId,
      //     custom_field_id: configs[clientId].customFieldId
      //   })
      
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Error saving configuration')
    } finally {
      setSaving(null)
    }
  }

  const updateConfig = (clientId: string, field: 'listId' | 'customFieldId', value: string) => {
    setConfigs(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [field]: value
      }
    }))
  }

  if (loading) {
    return <div className="bg-white rounded-lg shadow p-6">Loading clients...</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">ClickUp Setup Instructions</h2>
        <div className="prose prose-sm">
          <ol className="list-decimal list-inside space-y-2">
            <li>Create a custom field in ClickUp named "client_email" (Text type)</li>
            <li>Add this field to your task list and set the value to the client's email</li>
            <li>Get your List ID from ClickUp list URL</li>
            <li>Configure each client below with their specific list</li>
          </ol>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Client Configurations</h2>
        </div>
        
        <div className="divide-y">
          {clients.map((client) => (
            <div key={client.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium">{client.name}</h3>
                  <p className="text-gray-600">{client.contact_email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ClickUp List ID
                  </label>
                  <input
                    type="text"
                    value={configs[client.id]?.listId || ''}
                    onChange={(e) => updateConfig(client.id, 'listId', e.target.value)}
                    placeholder="Enter ClickUp List ID"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Found in your ClickUp list URL
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Field ID
                  </label>
                  <input
                    type="text"
                    value={configs[client.id]?.customFieldId || 'client_email'}
                    onChange={(e) => updateConfig(client.id, 'customFieldId', e.target.value)}
                    placeholder="client_email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Usually "client_email" if you followed the setup
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={() => saveConfig(client.id)}
                  disabled={saving === client.id || !configs[client.id]?.listId}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving === client.id ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}