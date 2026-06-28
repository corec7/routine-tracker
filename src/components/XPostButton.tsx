import { useState } from 'react'
import { generateXPostText } from '../lib/notifications'
import type { WeeklyDetailedStats } from '../lib/types'
import styles from './XPostButton.module.css'

interface Props {
  stats: WeeklyDetailedStats
  streak: number
  weekLabel: string
}

export function XPostButton({ stats, streak, weekLabel }: Props) {
  const [copied, setCopied] = useState(false)

  const getStatsForCategory = (category: string) => {
    const s = stats.byCategory.find((st) => st.category === category)
    return s
      ? { actualMinutes: s.actualMinutes, targetMinutes: s.targetMinutes }
      : { actualMinutes: 0, targetMinutes: 0 }
  }

  const text = generateXPostText({
    english: getStatsForCategory('english'),
    code: getStatsForCategory('code'),
    exercise: getStatsForCategory('exercise'),
    streak,
    weekLabel,
  })

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePost = () => {
    const encoded = encodeURIComponent(text)
    window.open(`https://x.com/intent/tweet?text=${encoded}`, '_blank')
  }

  return (
    <div className={styles.container}>
      <div className={styles.preview}>{text}</div>
      <div className={styles.actions}>
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button className={styles.postBtn} onClick={handlePost}>
          Post to X
        </button>
      </div>
    </div>
  )
}
