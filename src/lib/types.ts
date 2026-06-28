export type Category = 'english' | 'code' | 'exercise'

export type Schedule = 'weekday' | 'weekend' | 'mon_wed_fri'

export interface TaskDefinition {
  id: string
  name: string
  category: Category
  duration: number
  schedule: Schedule
  timeSlot?: string
  weekendShared?: boolean
}

export interface TaskRecord {
  id?: string
  user_id: string
  task_id: string
  date: string
  actual_minutes: number
}

export interface TimeStats {
  actualMinutes: number
  targetMinutes: number
  percentage: number
}

export interface WeeklyStats {
  category: Category
  label: string
  actualMinutes: number
  targetMinutes: number
  percentage: number
}

export interface WeeklyDetailedStats {
  overall: TimeStats
  byCategory: WeeklyStats[]
  weekday: TimeStats
  weekend: TimeStats
}

export interface NotificationSetting {
  id?: string
  user_id: string
  enabled: boolean
  time: string
}
