import { useState, useRef } from 'react'
import type { TaskDefinition } from '../lib/types'
import styles from './TaskItem.module.css'

interface Props {
  task: TaskDefinition
  actualMinutes: number
  weekendTotal?: number
  onUpdateMinutes: (minutes: number) => void
}

export function TaskItem({ task, actualMinutes, weekendTotal, onUpdateMinutes }: Props) {
  const [editing, setEditing] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const pct = task.duration > 0 ? Math.round((actualMinutes / task.duration) * 100) : 0
  const achieved = pct >= 70

  const weekendPct = weekendTotal !== undefined && task.weekendShared && task.duration > 0
    ? Math.round((weekendTotal / task.duration) * 100)
    : undefined

  const handleStartEdit = () => {
    setInputValue(actualMinutes > 0 ? String(actualMinutes) : '')
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handleConfirm = () => {
    const val = parseInt(inputValue, 10)
    onUpdateMinutes(isNaN(val) || val < 0 ? 0 : val)
    setEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConfirm()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <div
      className={`${styles.item} ${achieved ? styles.achieved : actualMinutes > 0 ? styles.partial : ''}`}
    >
      <div className={styles.left}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{task.name}</span>
          {task.timeSlot && <span className={styles.slot}>{task.timeSlot}</span>}
        </div>
        <div className={styles.targetRow}>
          <span className={styles.target}>目標 {task.duration}分</span>
          {task.weekendShared && <span className={styles.shared}>週末合算</span>}
        </div>
        {weekendPct !== undefined && (
          <div className={styles.weekendInfo}>
            週末合計: {weekendTotal}分 ({weekendPct}%)
          </div>
        )}
      </div>
      <div className={styles.right}>
        {editing ? (
          <div className={styles.editGroup}>
            <input
              ref={inputRef}
              type="number"
              inputMode="numeric"
              min="0"
              className={styles.minuteInput}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleConfirm}
            />
            <span className={styles.unitLabel}>分</span>
          </div>
        ) : (
          <button className={styles.minuteDisplay} onClick={handleStartEdit}>
            <span className={`${styles.minuteValue} ${achieved ? styles.valueGood : actualMinutes > 0 ? styles.valuePartial : styles.valueEmpty}`}>
              {actualMinutes > 0 ? actualMinutes : '-'}
            </span>
            <span className={styles.minuteUnit}>分</span>
          </button>
        )}
        {actualMinutes > 0 && (
          <span className={`${styles.pctBadge} ${achieved ? styles.badgeGood : styles.badgeWarn}`}>
            {pct}%
          </span>
        )}
      </div>
    </div>
  )
}
