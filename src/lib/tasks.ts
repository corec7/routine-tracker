import type { TaskDefinition } from './types'

export const TASKS: TaskDefinition[] = [
  // 英語（平日）
  {
    id: 'eng-vocab-wd',
    name: '単語 (mikan)',
    category: 'english',
    duration: 15,
    schedule: 'weekday',
    timeSlot: '通勤往路',
  },
  {
    id: 'eng-shadow-wd',
    name: 'シャドーイング (CNN English Express)',
    category: 'english',
    duration: 30,
    schedule: 'weekday',
    timeSlot: '朝/通勤',
  },
  {
    id: 'eng-reading-wd',
    name: '精読速読',
    category: 'english',
    duration: 20,
    schedule: 'weekday',
    timeSlot: '夜',
  },
  {
    id: 'eng-writing-wd',
    name: '英作文（口頭）',
    category: 'english',
    duration: 15,
    schedule: 'weekday',
    timeSlot: '夜',
  },

  // 英語（土日）
  {
    id: 'eng-vocab-we',
    name: '単語 (mikan)',
    category: 'english',
    duration: 20,
    schedule: 'weekend',
  },
  {
    id: 'eng-shadow-we',
    name: 'シャドーイング (CNN English Express)',
    category: 'english',
    duration: 45,
    schedule: 'weekend',
  },
  {
    id: 'eng-reading-we',
    name: '精読速読',
    category: 'english',
    duration: 30,
    schedule: 'weekend',
  },
  {
    id: 'eng-writing-we',
    name: '英作文（口頭）',
    category: 'english',
    duration: 30,
    schedule: 'weekend',
  },

  // Code（平日）
  {
    id: 'code-input',
    name: 'インプット（記事・教材）',
    category: 'code',
    duration: 30,
    schedule: 'weekday',
    timeSlot: '通勤復路',
  },
  {
    id: 'code-practice',
    name: '実践',
    category: 'code',
    duration: 45,
    schedule: 'mon_wed_fri',
  },

  // Code（土日）
  {
    id: 'code-intensive',
    name: '集中学習',
    category: 'code',
    duration: 90,
    schedule: 'weekend',
  },

  // 運動（平日）
  {
    id: 'training',
    name: '筋トレ',
    category: 'exercise',
    duration: 10,
    schedule: 'weekday',
    timeSlot: '夜',
  },

  // 運動（土日）- 週末合算
  {
    id: 'futsal',
    name: 'フットサル',
    category: 'exercise',
    duration: 120,
    schedule: 'weekend',
    weekendShared: true,
  },
]

export function getTasksForDate(date: Date): TaskDefinition[] {
  const day = date.getDay()
  const isWeekend = day === 0 || day === 6
  const isMonWedFri = day === 1 || day === 3 || day === 5

  return TASKS.filter((task) => {
    switch (task.schedule) {
      case 'weekday':
        return !isWeekend
      case 'weekend':
        return isWeekend
      case 'mon_wed_fri':
        return isMonWedFri
      default:
        return false
    }
  })
}

export function isWeekendDate(date: Date): boolean {
  const day = date.getDay()
  return day === 0 || day === 6
}

export function getWeekendPairDate(date: Date): Date {
  const day = date.getDay()
  const pair = new Date(date)
  if (day === 6) pair.setDate(pair.getDate() + 1)
  else if (day === 0) pair.setDate(pair.getDate() - 1)
  return pair
}

export function getCategoryLabel(category: string): string {
  switch (category) {
    case 'english':
      return '英語'
    case 'code':
      return 'Code'
    case 'exercise':
      return '運動'
    default:
      return category
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'english':
      return '📖'
    case 'code':
      return '💻'
    case 'exercise':
      return '🏃'
    default:
      return '📋'
  }
}
