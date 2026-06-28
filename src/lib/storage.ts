import { supabase, isSupabaseConfigured } from './supabase'
import type { TaskRecord, NotificationSetting } from './types'

const LOCAL_RECORDS_KEY = 'routine-tracker-records'
const LOCAL_NOTIFICATIONS_KEY = 'routine-tracker-notifications'
const LOCAL_USER_ID_KEY = 'routine-tracker-user-id'

function getLocalUserId(): string {
  let id = localStorage.getItem(LOCAL_USER_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(LOCAL_USER_ID_KEY, id)
  }
  return id
}

export function getUserId(): string {
  return getLocalUserId()
}

function getLocalRecords(): TaskRecord[] {
  const raw = localStorage.getItem(LOCAL_RECORDS_KEY)
  return raw ? JSON.parse(raw) : []
}

function saveLocalRecords(records: TaskRecord[]): void {
  localStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(records))
}

export async function getRecordsForDate(date: string): Promise<TaskRecord[]> {
  const userId = getUserId()

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from('task_records')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)

    if (error) {
      console.error('Supabase error:', error)
      return getLocalRecords().filter((r) => r.date === date && r.user_id === userId)
    }
    return data || []
  }

  return getLocalRecords().filter((r) => r.date === date && r.user_id === userId)
}

export async function getRecordsForDateRange(
  startDate: string,
  endDate: string,
): Promise<TaskRecord[]> {
  const userId = getUserId()

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase!
      .from('task_records')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)

    if (error) {
      console.error('Supabase error:', error)
      return getLocalRecords().filter(
        (r) => r.date >= startDate && r.date <= endDate && r.user_id === userId,
      )
    }
    return data || []
  }

  return getLocalRecords().filter(
    (r) => r.date >= startDate && r.date <= endDate && r.user_id === userId,
  )
}

export async function setTaskMinutes(
  taskId: string,
  date: string,
  minutes: number,
): Promise<void> {
  const userId = getUserId()

  if (isSupabaseConfigured()) {
    if (minutes > 0) {
      await supabase!.from('task_records').upsert(
        { user_id: userId, task_id: taskId, date, actual_minutes: minutes },
        { onConflict: 'user_id,task_id,date' },
      )
    } else {
      await supabase!
        .from('task_records')
        .delete()
        .eq('user_id', userId)
        .eq('task_id', taskId)
        .eq('date', date)
    }
  }

  const local = getLocalRecords()
  const idx = local.findIndex(
    (r) => r.user_id === userId && r.task_id === taskId && r.date === date,
  )

  if (minutes > 0) {
    if (idx >= 0) {
      local[idx].actual_minutes = minutes
    } else {
      local.push({ user_id: userId, task_id: taskId, date, actual_minutes: minutes })
    }
  } else {
    if (idx >= 0) local.splice(idx, 1)
  }

  saveLocalRecords(local)
}

export async function getNotificationSettings(): Promise<NotificationSetting | null> {
  const userId = getUserId()

  if (isSupabaseConfigured()) {
    const { data } = await supabase!
      .from('notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single()
    return data
  }

  const raw = localStorage.getItem(LOCAL_NOTIFICATIONS_KEY)
  if (!raw) return null
  const settings = JSON.parse(raw) as NotificationSetting[]
  return settings.find((s) => s.user_id === userId) || null
}

export async function saveNotificationSettings(
  enabled: boolean,
  time: string,
): Promise<void> {
  const userId = getUserId()
  const setting: NotificationSetting = { user_id: userId, enabled, time }

  if (isSupabaseConfigured()) {
    await supabase!.from('notification_settings').upsert(
      { user_id: userId, enabled, time },
      { onConflict: 'user_id' },
    )
  }

  localStorage.setItem(LOCAL_NOTIFICATIONS_KEY, JSON.stringify([setting]))
}
