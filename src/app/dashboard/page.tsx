'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { subscribeToPush } from '@/components/ServiceWorkerRegistration'

type Session = {
  id: string
  date: string
  completed_at: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [completedToday, setCompletedToday] = useState(false)
  const [loading, setLoading] = useState(true)
  const [notifStatus, setNotifStatus] = useState<'unknown' | 'granted' | 'denied' | 'unsupported'>('unknown')
  const router = useRouter()

  // Check current notification permission state after mount
  useEffect(() => {
    if (!('Notification' in window)) {
      setNotifStatus('unsupported')
    } else if (Notification.permission === 'granted') {
      setNotifStatus('granted')
    } else if (Notification.permission === 'denied') {
      setNotifStatus('denied')
    }
  }, [])

  const handleEnableNotifications = async () => {
    if (!user) return
    const ok = await subscribeToPush(user.id)
    setNotifStatus(ok ? 'granted' : 'denied')
  }

  useEffect(() => {
    const initDashboard = async () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      if (!userData.id) {
        router.push('/login')
        return
      }
      setUser(userData)

      const today = new Date().toISOString().split('T')[0]

      const { data } = await supabase
        .from('sessions')
        .select('id, date, completed_at')
        .eq('user_id', userData.id)
        .order('date', { ascending: false })

      const sessionList = (data || []) as Session[]
      setSessions(sessionList)

      const todayDone = sessionList.some(s => s.date === today)
      setCompletedToday(todayDone)

      setLoading(false)
    }

    initDashboard()
  }, [router])

  const calculateStreak = (sessionList: Session[]) => {
    if (!sessionList.length) return 0
    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < 365; i++) {
      const expected = new Date(today)
      expected.setDate(today.getDate() - i)
      const dateStr = expected.toISOString().split('T')[0]
      if (sessionList.some(s => s.date === dateStr)) {
        streak++
      } else {
        break
      }
    }
    return streak
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const streak = calculateStreak(sessions)
  const lastCompleted = sessions.length > 0 ? sessions[0].date : null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">WWW</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">SafetyCheck</h1>
              <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {(user?.role === 'manager' || user?.role === 'admin') && (
              <button
                onClick={() => router.push('/manager')}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Reports
              </button>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('user')
                router.push('/login')
              }}
              className="text-gray-500 hover:text-gray-800 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Notification prompt — only for technicians who haven't granted yet */}
        {user?.role === 'technician' && notifStatus === 'unknown' && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium text-blue-900 text-sm">Get 8 AM reminders</p>
              <p className="text-blue-700 text-xs mt-0.5">We'll remind you Mon–Sat so you never miss a quiz.</p>
            </div>
            <button
              onClick={handleEnableNotifications}
              className="shrink-0 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Enable
            </button>
          </div>
        )}
        {user?.role === 'technician' && notifStatus === 'denied' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-yellow-800 text-sm">
              Notifications are blocked. Enable them in your browser settings to receive 8 AM reminders.
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-5">Your Stats</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{sessions.length}</div>
              <div className="text-sm text-gray-500 mt-1">Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">{streak}</div>
              <div className="text-sm text-gray-500 mt-1">Day Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {lastCompleted
                  ? new Date(lastCompleted + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : '—'}
              </div>
              <div className="text-sm text-gray-500 mt-1">Last Quiz</div>
            </div>
          </div>
        </div>

        {/* Today's quiz */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Today's Quiz</h2>
          {completedToday ? (
            <div className="flex items-center gap-3 py-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900">All done for today!</p>
                <p className="text-sm text-gray-500">Come back tomorrow for your next quiz.</p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-5 text-sm">
                Complete your daily safety training to stay compliant and keep the team safe.
              </p>
              <button
                onClick={() => router.push('/quiz')}
                className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-semibold transition-colors"
              >
                Start Today's Quiz
              </button>
            </>
          )}
        </div>

        {/* Recent history */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent History</h2>
            <div className="space-y-2">
              {sessions.slice(0, 10).map(session => (
                <div key={session.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700 text-sm">
                    {new Date(session.date + 'T12:00:00').toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </span>
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
