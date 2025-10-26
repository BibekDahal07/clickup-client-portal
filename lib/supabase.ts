import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          client_id: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          client_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          contact_email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_email?: string
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          clickup_task_id: string
          client_id: string
          title: string
          description: string | null
          status: string
          due_date: string | null
          priority: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          clickup_task_id: string
          client_id: string
          title: string
          description?: string | null
          status: string
          due_date?: string | null
          priority?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          clickup_task_id?: string
          client_id?: string
          title?: string
          description?: string | null
          status?: string
          due_date?: string | null
          priority?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}