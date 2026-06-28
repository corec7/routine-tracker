import { useState, useEffect } from 'react'
import { format, subDays } from 'date-fns'
import { getRecordsForDate } from '../lib/storage'
import { getTasksForDate, isWeekendDate, getWeekendPairDate } from '../lib/tasks'

async function isDayAchieved(date: Date): Promise<boolean> {
  const tasks = getTasksForDate(date)
  if (tasks.length === 0) return true

  const dateStr = format(date, 'yyyy-MM-dd')
  const records = await getRecordsForDate(dateStr)

  if (isWeekendDate(date)) {
    const pairDate = getWeekendPairDate(date)
    const pairStr = format(pairDate, 'yyyy-MM-dd')
    const pairRecords = await getRecordsForDate(pairStr)

    let totalActual = 0
    let totalTarget = 0
    const sharedCounted = new Set<string>()

    for (const task of tasks) {
      const todayMin = records.find((r) => r.task_id === task.id)?.actual_minutes ?? 0
      const pairMin = pairRecords.find((r) => r.task_id === task.id)?.actual_minutes ?? 0

      if (task.weekendShared) {
        if (!sharedCounted.has(task.id)) {
          totalActual += todayMin + pairMin
          totalTarget += task.duration
          sharedCounted.add(task.id)
        }
      } else {
        totalActual += todayMin + pairMin
        totalTarget += task.duration * 2
      }
    }

    return totalTarget > 0 && (totalActual / totalTarget) >= 0.7
  }

  let totalActual = 0
  let totalTarget = 0

  for (const task of tasks) {
    const actual = records.find((r) => r.task_id === task.id)?.actual_minutes ?? 0
    totalActual += actual
    totalTarget += task.duration
  }

  return totalTarget > 0 && (totalActual / totalTarget) >= 0.7
}

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function calculate() {
      setLoading(true)
      let count = 0
      let checkDate = new Date()
      const checkedWeekends = new Set<string>()

      for (let i = 0; i < 365; i++) {
        if (isWeekendDate(checkDate)) {
          const satDate = checkDate.getDay() === 6 ? checkDate : getWeekendPairDate(checkDate)
          const weekendKey = format(satDate, 'yyyy-MM-dd')

          if (checkedWeekends.has(weekendKey)) {
            checkDate = subDays(checkDate, 1)
            continue
          }
          checkedWeekends.add(weekendKey)

          const sunDate = new Date(satDate)
          sunDate.setDate(sunDate.getDate() + 1)

          if (satDate > new Date() && sunDate > new Date()) {
            checkDate = subDays(checkDate, 1)
            continue
          }

          const achieved = await isDayAchieved(satDate)
          if (achieved) {
            count++
            checkDate = subDays(checkDate, 1)
          } else {
            if (satDate <= new Date()) break
            checkDate = subDays(checkDate, 1)
          }
        } else {
          if (checkDate > new Date()) {
            checkDate = subDays(checkDate, 1)
            continue
          }

          const achieved = await isDayAchieved(checkDate)
          if (achieved) {
            count++
            checkDate = subDays(checkDate, 1)
          } else {
            break
          }
        }
      }

      setStreak(count)
      setLoading(false)
    }

    calculate()
  }, [])

  return { streak, loading }
}
