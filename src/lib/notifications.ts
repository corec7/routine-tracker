export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function scheduleNotification(time: string): number | null {
  if (Notification.permission !== 'granted') return null

  const now = new Date()
  const [hours, minutes] = time.split(':').map(Number)
  const target = new Date(now)
  target.setHours(hours, minutes, 0, 0)

  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }

  const delay = target.getTime() - now.getTime()

  const timerId = window.setTimeout(() => {
    new Notification('Routine Tracker', {
      body: '今日のルーティンを確認しましょう！',
      icon: '/icons/icon-192.png',
    })
    scheduleNotification(time)
  }, delay)

  return timerId
}

function formatMinutes(min: number): string {
  if (min < 60) return `${min}分`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}h${m}m` : `${h}h`
}

export function generateXPostText(stats: {
  english: { actualMinutes: number; targetMinutes: number }
  code: { actualMinutes: number; targetMinutes: number }
  exercise: { actualMinutes: number; targetMinutes: number }
  streak: number
  weekLabel: string
}): string {
  const pct = (a: number, t: number) => (t > 0 ? Math.round((a / t) * 100) : 0)

  const engPct = pct(stats.english.actualMinutes, stats.english.targetMinutes)
  const codePct = pct(stats.code.actualMinutes, stats.code.targetMinutes)
  const exPct = pct(stats.exercise.actualMinutes, stats.exercise.targetMinutes)

  const lines = [
    `📊 Weekly Report (${stats.weekLabel})`,
    '',
    `📖 英語: ${engPct}% (${formatMinutes(stats.english.actualMinutes)}/${formatMinutes(stats.english.targetMinutes)})`,
    `💻 Code: ${codePct}% (${formatMinutes(stats.code.actualMinutes)}/${formatMinutes(stats.code.targetMinutes)})`,
    `🏃 運動: ${exPct}% (${formatMinutes(stats.exercise.actualMinutes)}/${formatMinutes(stats.exercise.targetMinutes)})`,
    '',
    `🔥 連続達成: ${stats.streak}日`,
    '',
    '#ルーティン記録 #習慣化',
  ]

  return lines.join('\n')
}
