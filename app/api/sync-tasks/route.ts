import { NextRequest, NextResponse } from 'next/server'
import { clickup } from '@/lib/clickup'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { listId, clientEmail, clientId, customField = 'client_email' } = await request.json()

    if (!listId || !clientEmail || !clientId) {
      return NextResponse.json(
        { error: 'Missing required fields: listId, clientEmail, clientId' },
        { status: 400 }
      )
    }

    // Get tasks from ClickUp filtered by client email
    const tasks = await clickup.getTasks(listId, {
      field: customField,
      value: clientEmail
    })

    // Transform tasks
    const tasksToInsert = tasks.map((task: any) => ({
      clickup_task_id: task.id,
      client_id: clientId,
      title: task.name,
      description: task.description || null,
      status: task.status.status,
      due_date: task.due_date ? new Date(task.due_date).toISOString() : null,
      priority: task.priority?.priority || null,
    }))

    // Upsert tasks (update if exists, insert if new)
    const { error } = await supabaseAdmin
      .from('tasks')
      .upsert(tasksToInsert, { onConflict: 'clickup_task_id' })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${tasks.length} tasks for client ${clientEmail}`,
      tasks: tasks.length
    })

  } catch (error: any) {
    console.error('Error syncing tasks:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to sync tasks' },
      { status: 500 }
    )
  }
}