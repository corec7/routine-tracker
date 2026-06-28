import { useState } from 'react'
import { format, addDays, subDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { getTasksForDate, isWeekendDate } from '../lib/tasks'
import { useTaskRecords } from '../hooks/useTaskCompletions'
import { useStreak } from '../hooks/useStreak'
import { DailyChecklist } from '../components/DailyChecklist'
import { StreakCounter } from '../components/StreakCounter'
import styles from './TodayPage.module.css'

export function TodayPage() {
  const [date, setDate] = useState(new Date())
  const tasks = getTasksForDate(date)
  const { getMinutes, getWeekendTotalMinutes, updateMinutes, loading } = useTaskRecords(date)
  const { streak, loading: streakLoading } = useStreak()
  const isWeekend = isWeekendDate(date)

  const isToday =
    format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')

  let totalActual = 0
  let totalTarget = 0
  for (const t of tasks) {
    totalActual += getMinutes(t.id)
    totalTarget += t.duration
  }
  const pct = totalTarget > 0 ? Math.round((totalActual / totalTarget) * 100) : 0
  const cappedPct = Math.min(pct, 100)

  return (
    <div className={styles.page}>
      <div className={styles.dateNav}>
        <button className={styles.arrowBtn} onClick={() => setDate(subDays(date, 1))}>
          ‹
        </button>
        <div className={styles.dateDisplay}>
          <span className={styles.dateMain}>
            {format(date, 'M月d日 (E)', { locale: ja })}
          </span>
          {isWeekend && <span className={styles.weekendBadge}>週末</span>}
          {!isToday && (
            <button className={styles.todayBtn} onClick={() => setDate(new Date())}>
              今日
            </button>
          )}
        </div>
        <button className={styles.arrowBtn} onClick={() => setDate(addDays(date, 1))}>
          ›
        </button>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressRing}>
          <svg viewBox="0 0 100 100" className={styles.ringSvg}>
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke={pct >= 70 ? 'var(--accent-blue)' : pct > 0 ? 'var(--accent-orange)' : 'var(--border)'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(cappedPct / 100) * 264} 264`}
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          <div className={styles.ringText}>
            <span className={styles.ringPct}>{pct}</span>
            <span className={styles.ringPercent}>%</span>
          </div>
        </div>
        <div className={styles.progressInfo}>
          {totalActual}分 / {totalTarget}分
        </div>
      </div>

      <StreakCounter streak={streak} loading={streakLoading} />

      {loading ? (
        <div className={styles.loadingText}>Loading...</div>
      ) : (
        <DailyChecklist
          tasks={tasks}
          getMinutes={getMinutes}
          getWeekendTotal={getWeekendTotalMinutes}
          onUpdateMinutes={updateMinutes}
          isWeekend={isWeekend}
        />
      )}
    </div>
  )
}
