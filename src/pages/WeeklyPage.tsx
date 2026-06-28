import { format, startOfWeek, endOfWeek } from 'date-fns'
import { ja } from 'date-fns/locale'
import { useWeeklyStats } from '../hooks/useWeeklyStats'
import { useStreak } from '../hooks/useStreak'
import { WeeklyScoreboard } from '../components/WeeklyScoreboard'
import { XPostButton } from '../components/XPostButton'
import styles from './WeeklyPage.module.css'

export function WeeklyPage() {
  const today = new Date()
  const { stats, loading } = useWeeklyStats(today)
  const { streak } = useStreak()

  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  const weekLabel = `${format(weekStart, 'M/d', { locale: ja })} - ${format(weekEnd, 'M/d', { locale: ja })}`

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Weekly Report</h1>
      <div className={styles.weekLabel}>{weekLabel}</div>

      <WeeklyScoreboard stats={stats} loading={loading} />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>X Post</h2>
        {stats && (
          <XPostButton stats={stats} streak={streak} weekLabel={weekLabel} />
        )}
      </div>
    </div>
  )
}
