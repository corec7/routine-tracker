import type { WeeklyDetailedStats, TimeStats } from '../lib/types'
import { getCategoryIcon } from '../lib/tasks'
import styles from './WeeklyScoreboard.module.css'

interface Props {
  stats: WeeklyDetailedStats | null
  loading: boolean
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}分`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${m}m` : `${h}h`
}

function StatBar({ label, stat }: { label: string; stat: TimeStats }) {
  const capped = Math.min(stat.percentage, 100)
  return (
    <div className={styles.splitCard}>
      <div className={styles.splitHeader}>
        <span className={styles.splitLabel}>{label}</span>
        <span className={`${styles.splitPct} ${stat.percentage >= 70 ? styles.good : styles.warning}`}>
          {stat.percentage}%
        </span>
      </div>
      <div className={styles.splitDetail}>
        {formatTime(stat.actualMinutes)} / {formatTime(stat.targetMinutes)}
      </div>
      <div className={styles.progressBar}>
        <div
          className={`${styles.progressFill} ${stat.percentage >= 70 ? styles.progressGood : styles.progressWarning}`}
          style={{ width: `${capped}%` }}
        />
      </div>
    </div>
  )
}

export function WeeklyScoreboard({ stats, loading }: Props) {
  if (loading || !stats) {
    return <div className={styles.loading}>Loading...</div>
  }

  return (
    <div className={styles.scoreboard}>
      <div className={styles.overallCard}>
        <div className={styles.overallLabel}>WEEKLY SCORE</div>
        <div className={`${styles.overallScore} ${stats.overall.percentage < 70 ? styles.warning : styles.good}`}>
          {stats.overall.percentage}
          <span className={styles.percent}>%</span>
        </div>
        <div className={styles.overallSub}>
          {formatTime(stats.overall.actualMinutes)} / {formatTime(stats.overall.targetMinutes)}
        </div>
      </div>

      <div className={styles.categories}>
        {stats.byCategory.map((stat) => {
          const capped = Math.min(stat.percentage, 100)
          return (
            <div key={stat.category} className={styles.categoryCard}>
              <div className={styles.catHeader}>
                <span className={styles.catIcon}>{getCategoryIcon(stat.category)}</span>
                <span className={styles.catLabel}>{stat.label}</span>
              </div>
              <div className={styles.scoreRow}>
                <span
                  className={`${styles.catScore} ${stat.percentage < 70 ? styles.warning : styles.good}`}
                >
                  {stat.percentage}%
                </span>
                <span className={styles.catDetail}>
                  {formatTime(stat.actualMinutes)}
                  <span className={styles.separator}> / </span>
                  {formatTime(stat.targetMinutes)}
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${stat.percentage < 70 ? styles.progressWarning : styles.progressGood}`}
                  style={{ width: `${capped}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.splitSection}>
        <div className={styles.splitTitle}>平日 / 週末</div>
        <div className={styles.splitGrid}>
          <StatBar label="平日 (月〜金)" stat={stats.weekday} />
          <StatBar label="週末 (土日)" stat={stats.weekend} />
        </div>
      </div>
    </div>
  )
}
