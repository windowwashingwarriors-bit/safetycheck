'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  name: string
  role: string
  hire_date: string
  is_active: boolean
}

export default function LoginPage() {
  const [step, setStep] = useState<'select' | 'pin'>('select')
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase
      .from('users')
      .select('id, name, role, hire_date, is_active')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => {
        setUsers(data || [])
        setLoading(false)
      })
  }, [])

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setPin('')
    setError('')
    setStep('pin')
  }

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { data: fullUser, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', selectedUser!.id)
      .eq('pin', pin)
      .eq('is_active', true)
      .single()

    if (dbError || !fullUser) {
      setError('Incorrect PIN. Try again.')
      setPin('')
      return
    }

    localStorage.setItem('user', JSON.stringify(fullUser))

    if (fullUser.role === 'manager' || fullUser.role === 'admin') {
      router.push('/manager')
    } else {
      router.push('/dashboard')
    }
  }

  const handlePinKey = (digit: string) => {
    if (pin.length < 6) setPin(prev => prev + digit)
  }

  const handleBackspace = () => setPin(prev => prev.slice(0, -1))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-blue-600 text-xl font-black">WWW</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SafetyCheck</h1>
          <p className="text-blue-100 text-sm mt-1">Window Washing Warriors</p>
        </div>

        <div className="px-8 py-6">
          {step === 'select' && (
            <>
              <p className="text-center text-gray-600 mb-5 font-medium">Who are you?</p>
              <div className="grid grid-cols-2 gap-3">
                {users
                  .filter(u => u.role === 'technician')
                  .map(user => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectUser(user)}
                      className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 hover:border-blue-400 rounded-xl py-4 px-3 text-blue-900 font-semibold text-sm transition-colors active:scale-95"
                    >
                      {user.name}
                    </button>
                  ))}
              </div>

              {users.filter(u => u.role === 'manager' || u.role === 'admin').length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-center text-gray-400 text-xs mb-3 uppercase tracking-wide">Management</p>
                  <div className="grid grid-cols-2 gap-3">
                    {users
                      .filter(u => u.role === 'manager' || u.role === 'admin')
                      .map(user => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          className="bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-400 rounded-xl py-4 px-3 text-gray-700 font-semibold text-sm transition-colors active:scale-95"
                        >
                          {user.name}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}

          {step === 'pin' && selectedUser && (
            <>
              <button
                onClick={() => { setStep('select'); setError('') }}
                className="flex items-center text-blue-600 text-sm mb-5 hover:text-blue-800"
              >
                ← Back
              </button>

              <p className="text-center text-gray-800 font-semibold text-lg mb-1">
                Hi, {selectedUser.name}
              </p>
              <p className="text-center text-gray-500 text-sm mb-6">Enter your PIN</p>

              {/* PIN dots */}
              <div className="flex justify-center gap-3 mb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      i < pin.length
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-white border-gray-300'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-center text-red-500 text-sm mb-4">{error}</p>
              )}

              {/* Number pad */}
              <form onSubmit={handlePinSubmit}>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) => (
                    key === '' ? (
                      <div key={i} />
                    ) : key === '⌫' ? (
                      <button
                        key={i}
                        type="button"
                        onClick={handleBackspace}
                        className="h-14 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xl font-medium transition-colors active:scale-95"
                      >
                        ⌫
                      </button>
                    ) : (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handlePinKey(key)}
                        className="h-14 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-900 text-xl font-semibold transition-colors active:scale-95"
                      >
                        {key}
                      </button>
                    )
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={pin.length < 4}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-colors"
                >
                  Sign In
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
