import { useState, useEffect } from 'react'
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import type { WeeklyDetailedStats, WeeklyStats, TimeStats, Category } from '../lib/types'
import { getRecordsForDateRange } from '../lib/storage'
import { getTasksForDate, getCategoryLabel, isWeekendDate } from '../lib/tasks'

export function useWeeklyStats(referenceDate: Date) {
  const [stats, setStats] = useState<WeeklyDetailedStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const weekStart = startOfWeek(referenceDate, { weekStartsOn: 1 })
      const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 1 })

      const startStr = format(weekStart, 'yyyy-MM-dd')
      const endStr = format(weekEnd, 'yyyy-MM-dd')

      const records = await getRecordsForDateRange(startStr, endStr)
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

      const catActual: Record<Category, number> = { english: 0, code: 0, exercise: 0 }
      const catTarget: Record<Category, number> = { english: 0, code: 0, exercise: 0 }

      let weekdayActual = 0
      let weekdayTarget = 0
      let weekendActual = 0
      let weekendTarget = 0

      const weekendSharedTargetAdded = new Set<string>()

      for (const day of days) {
        if (day > new Date()) break
        const dayStr = format(day, 'yyyy-MM-dd')
        const dayTasks = getTasksForDate(day)
        const isWe = isWeekendDate(day)

        for (const task of dayTasks) {
          let taskTarget: number

          if (task.weekendShared) {
            if (weekendSharedTargetAdded.has(task.id)) {
              taskTarget = 0
            } else {
              taskTarget = task.duration
              weekendSharedTargetAdded.add(task.id)
            }
          } else {
            taskTarget = task.duration
          }

          const record = records.find(
            (r) => r.task_id === task.id && r.date === dayStr,
          )
          const actual = record?.actual_minutes ?? 0

          catActual[task.category] += actual
          catTarget[task.category] += taskTarget

          if (isWe) {
            weekendActual += actual
            weekendTarget += taskTarget
          } else {
            weekdayActual += actual
            weekdayTarget += taskTarget
          }
        }
      }

      const pct = (a: number, t: number) => (t > 0 ? Math.round((a / t) * 100) : 0)

      const byCategory: WeeklyStats[] = (['english', 'code', 'exercise'] as Category[]).map(
        (cat) => ({
          category: cat,
          label: getCategoryLabel(cat),
          actualMinutes: catActual[cat],
          targetMinutes: catTarget[cat],
          percentage: pct(catActual[cat], catTarget[cat]),
        }),
      )

      const totalActual = catActual.english + catActual.code + catActual.exercise
      const totalTarget = catTarget.english + catTarget.code + catTarget.exercise

      const overall: TimeStats = {
        actualMinutes: totalActual,
        targetMinutes: totalTarget,
        percentage: pct(totalActual, totalTarget),
      }

      const weekday: TimeStats = {
        actualMinutes: weekdayActual,
        targetMinutes: weekdayTarget,
        percentage: pct(weekdayActual, weekdayTarget),
      }

      const weekend: TimeStats = {
        actualMinutes: weekendActual,
        targetMinutes: weekendTarget,
        percentage: pct(weekendActual, weekendTarget),
      }

      setStats({ overall, byCategory, weekday, weekend })
      setLoading(false)
    }

    load()
  }, [referenceDate])

  return { stats, loading }
}
