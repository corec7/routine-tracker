import { useState, useEffect } from 'react'
import { requestNotificationPermission, scheduleNotification } from '../lib/notifications'
import { getNotificationSettings, saveNotificationSettings } from '../lib/storage'
import { isSupabaseConfigured } from '../lib/supabase'
import styles from './SettingsPage.module.css'

export function SettingsPage() {
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [notifTime, setNotifTime] = useState('07:00')
  const [notifPermission, setNotifPermission] = useState<string>('default')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission)
    }
    getNotificationSettings().then((settings) => {
      if (settings) {
        setNotifEnabled(settings.enabled)
        setNotifTime(settings.time)
      }
    })
  }, [])

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission()
    setNotifPermission(granted ? 'granted' : 'denied')
  }

  const handleSave = async () => {
    await saveNotificationSettings(notifEnabled, notifTime)
    if (notifEnabled && notifPermission === 'granted') {
      scheduleNotification(notifTime)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Settings</h1>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Push通知</h2>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>通知権限</span>
          {notifPermission === 'granted' ? (
            <span className={styles.permGranted}>許可済み</span>
          ) : (
            <button className={styles.permBtn} onClick={handleRequestPermission}>
              許可する
            </button>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabel}>リマインド通知</span>
          <button
            className={`${styles.toggle} ${notifEnabled ? styles.toggleOn : ''}`}
            onClick={() => setNotifEnabled(!notifEnabled)}
          >
            <div className={styles.toggleKnob} />
          </button>
        </div>

        {notifEnabled && (
          <div className={styles.field}>
            <span className={styles.fieldLabel}>通知時刻</span>
            <input
              type="time"
              value={notifTime}
              onChange={(e) => setNotifTime(e.target.value)}
              className={styles.timeInput}
            />
          </div>
        )}

        <button className={styles.saveBtn} onClick={handleSave}>
          {saved ? '保存しました!' : '保存'}
        </button>
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>データ</h2>
        <div className={styles.field}>
          <span className={styles.fieldLabel}>Supabase</span>
          <span className={isSupabaseConfigured() ? styles.permGranted : styles.permDenied}>
            {isSupabaseConfigured() ? '接続済み' : '未接続'}
          </span>
        </div>
        {!isSupabaseConfigured() && (
          <p className={styles.hint}>
            .envにVITE_SUPABASE_URLとVITE_SUPABASE_ANON_KEYを設定すると複数デバイスでデータを同期できます。
            未設定の場合はローカルストレージに保存されます。
          </p>
        )}
      </div>

      <div className={styles.card}>
        <h2 className={styles.cardTitle}>About</h2>
        <p className={styles.about}>Routine Tracker v1.0</p>
        <p className={styles.aboutSub}>
          PWA対応 - ホーム画面に追加でアプリとして利用可能
        </p>
      </div>
    </div>
  )
}
