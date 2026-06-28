import type { TaskDefinition, Category } from '../lib/types'
import { getCategoryLabel, getCategoryIcon } from '../lib/tasks'
import { TaskItem } from './TaskItem'
import styles from './DailyChecklist.module.css'

interface Props {
  tasks: TaskDefinition[]
  getMinutes: (taskId: string) => number
  getWeekendTotal: (taskId: string) => number
  onUpdateMinutes: (taskId: string, minutes: number) => void
  isWeekend: boolean
}

export function DailyChecklist({ tasks, getMinutes, getWeekendTotal, onUpdateMinutes, isWeekend }: Props) {
  const categories: Category[] = ['english', 'code', 'exercise']

  return (
    <div className={styles.checklist}>
      {categories.map((cat) => {
        const catTasks = tasks.filter((t) => t.category === cat)
        if (catTasks.length === 0) return null

        let catActual = 0
        let catTarget = 0
        for (const t of catTasks) {
          catActual += getMinutes(t.id)
          catTarget += t.duration
        }
        const catPct = catTarget > 0 ? Math.round((catActual / catTarget) * 100) : 0

        return (
          <div key={cat} className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>{getCategoryIcon(cat)}</span>
              <span className={styles.sectionTitle}>{getCategoryLabel(cat)}</span>
              <span className={styles.sectionTime}>
                {catActual}
                <span className={styles.timeSep}>/</span>
                {catTarget}分
              </span>
              <span className={`${styles.sectionPct} ${catPct >= 70 ? styles.pctGood : catActual > 0 ? styles.pctWarn : styles.pctEmpty}`}>
                {catPct}%
              </span>
            </div>
            <div className={styles.taskList}>
              {catTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  actualMinutes={getMinutes(task.id)}
                  weekendTotal={isWeekend && task.weekendShared ? getWeekendTotal(task.id) : undefined}
                  onUpdateMinutes={(m) => onUpdateMinutes(task.id, m)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
