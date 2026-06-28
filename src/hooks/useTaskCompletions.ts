import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import type { TaskRecord } from '../lib/types'
import { getRecordsForDate, setTaskMinutes } from '../lib/storage'
import { isWeekendDate, getWeekendPairDate } from '../lib/tasks'

export function useTaskRecords(date: Date) {
  const [records, setRecords] = useState<TaskRecord[]>([])
  const [pairRecords, setPairRecords] = useState<TaskRecord[]>([])
  const [loading, setLoading] = useState(true)
  const dateStr = format(date, 'yyyy-MM-dd')
  const isWeekend = isWeekendDate(date)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await getRecordsForDate(dateStr)
    setRecords(data)

    if (isWeekend) {
      const pairDate = getWeekendPairDate(date)
      const pairStr = format(pairDate, 'yyyy-MM-dd')
      const pairData = await getRecordsForDate(pairStr)
      setPairRecords(pairData)
    } else {
      setPairRecords([])
    }

    setLoading(false)
  }, [dateStr, isWeekend])

  useEffect(() => {
    load()
  }, [load])

  const updateMinutes = useCallback(
    async (taskId: string, minutes: number) => {
      setRecords((prev) => {
        const idx = prev.findIndex((r) => r.task_id === taskId)
        if (minutes > 0) {
          if (idx >= 0) {
            return prev.map((r) =>
              r.task_id === taskId ? { ...r, actual_minutes: minutes } : r,
            )
          }
          return [
            ...prev,
            { user_id: '', task_id: taskId, date: dateStr, actual_minutes: minutes },
          ]
        }
        if (idx >= 0) return prev.filter((r) => r.task_id !== taskId)
        return prev
      })

      await setTaskMinutes(taskId, dateStr, minutes)
    },
    [dateStr],
  )

  const getMinutes = useCallback(
    (taskId: string) => {
      const record = records.find((r) => r.task_id === taskId)
      return record?.actual_minutes ?? 0
    },
    [records],
  )

  const getWeekendTotalMinutes = useCallback(
    (taskId: string) => {
      const todayMin = records.find((r) => r.task_id === taskId)?.actual_minutes ?? 0
      const pairMin = pairRecords.find((r) => r.task_id === taskId)?.actual_minutes ?? 0
      return todayMin + pairMin
    },
    [records, pairRecords],
  )

  return { records, pairRecords, loading, updateMinutes, getMinutes, getWeekendTotalMinutes, reload: load }
}
