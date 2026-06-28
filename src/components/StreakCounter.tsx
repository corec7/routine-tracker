import styles from './StreakCounter.module.css'

interface Props {
  streak: number
  loading: boolean
}

export function StreakCounter({ streak, loading }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.flame}>🔥</div>
      <div className={styles.count}>{loading ? '-' : streak}</div>
      <div className={styles.label}>日連続達成</div>
    </div>
  )
}
