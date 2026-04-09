'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ManagerPage() {
  const [user, setUser] = useState<any>(null)
  const [reports, setReports] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const initManager = async () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      if (!userData.id || (userData.role !== 'manager' && userData.role !== 'admin')) {
        router.push('/login')
        return
      }
      setUser(userData)

      // Get all users
      const { data: allUsers } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)

      setUsers(allUsers || [])

      // Get recent sessions for reporting
      const { data: sessions } = await supabase
        .from('sessions')
        .select(`
          *,
          users:user_id (
            name,
            role
          )
        `)
        .order('date', { ascending: false })
        .limit(100)

      setReports(sessions || [])
    }

    initManager()
  }, [router])

  const getWeeklyReport = () => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weeklySessions = reports.filter(session =>
      new Date(session.date) >= weekAgo
    )

    const userStats = users.map(user => {
      const userSessions = weeklySessions.filter(s => s.user_id === user.id)
      return {
        user: user.name,
        completed: userSessions.length,
        missed: 7 - userSessions.length
      }
    })

    return userStats
  }

  const getShortAnswerReviews = () => {
    return reports.filter(session => {
      const answers = session.answers || {}
      return Object.values(answers).some((answer: any) =>
        typeof answer === 'string' && answer.length > 50 // Assume short answers are longer
      )
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const weeklyStats = getWeeklyReport()
  const shortAnswers = getShortAnswerReviews()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">WWW</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">Manager Dashboard</h1>
              <p className="text-sm text-gray-600">SafetyCheck Reports</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('user')
              router.push('/login')
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Weekly Completion Report</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Technician</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-900">Completed</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-900">Missed</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {weeklyStats.map((stat, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 text-gray-900">{stat.user}</td>
                    <td className="py-3 px-4 text-center text-green-600 font-medium">{stat.completed}</td>
                    <td className="py-3 px-4 text-center text-red-600 font-medium">{stat.missed}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stat.missed === 0 ? 'bg-green-100 text-green-800' :
                        stat.missed <= 2 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {stat.missed === 0 ? 'Perfect' :
                         stat.missed <= 2 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {shortAnswers.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Short Answer Responses for Review</h2>
            <div className="space-y-4">
              {shortAnswers.map((session, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{session.users?.name}</p>
                      <p className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(session.answers || {}).map(([questionId, answer]: [string, any]) => {
                      if (typeof answer === 'string' && answer.length > 50) {
                        const question = session.questions?.find((q: any) => q.id === questionId)
                        return (
                          <div key={questionId}>
                            <p className="text-sm font-medium text-gray-700">{question?.question}</p>
                            <p className="text-sm text-gray-600 mt-1">{answer}</p>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">User Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-900">Hire Date</th>
                  <th className="text-center py-2 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b">
                    <td className="py-3 px-4 text-gray-900">{u.name}</td>
                    <td className="py-3 px-4 text-gray-600 capitalize">{u.role}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {u.hire_date ? new Date(u.hire_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}