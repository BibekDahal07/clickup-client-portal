import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from './supabase'

export const supabase = createClientComponentClient<Database>()