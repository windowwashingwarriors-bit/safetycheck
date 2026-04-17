'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Step = 'current' | 'new' | 'confirm' | 'success'

export default function ChangePinPage() {
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<Step>('current')
  const [currentPin, setCurrentPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}')
    if (!userData.id) {
      router.push('/login')
      return
    }
    setUser(userData)
  }, [router])

  // Active PIN value for the current step
  const activePin =
    step === 'current' ? currentPin :
    step === 'new'     ? newPin :
    step === 'confirm' ? confirmPin : ''

  const setActivePin = (val: string) => {
    if (step === 'current') setCurrentPin(val)
    else if (step === 'new') setNewPin(val)
    else if (step === 'confirm') setConfirmPin(val)
  }

  const handleKey = (digit: string) => {
    if (activePin.length < 6) setActivePin(activePin + digit)
  }

  const handleBackspace = () => setActivePin(activePin.slice(0, -1))

  const handleNext = async () => {
    setError('')

    if (step === 'current') {
      // Verify current PIN against DB
      const { data, error: dbErr } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .eq('pin', currentPin)
        .single()

      if (dbErr || !data) {
        setError('Incorrect PIN. Try again.')
        setCurrentPin('')
        return
      }
      setStep('new')

    } else if (step === 'new') {
      if (newPin.length < 4) {
        setError('PIN must be at least 4 digits.')
        return
      }
      if (newPin === currentPin) {
        setError('New PIN must be different from your current PIN.')
        setNewPin('')
        return
      }
      setStep('confirm')

    } else if (step === 'confirm') {
      if (confirmPin !== newPin) {
        setError("PINs don't match. Try again.")
        setConfirmPin('')
        return
      }

      setSaving(true)
      const { error: updateErr } = await supabase
        .from('users')
        .update({ pin: newPin, updated_at: new Date().toISOString() })
        .eq('id', user.id)

      setSaving(false)

      if (updateErr) {
        setError('Failed to save. Please try again.')
        return
      }

      // Update localStorage so the session stays current
      localStorage.setItem('user', JSON.stringify({ ...user, pin: newPin }))
      setStep('success')
    }
  }

  const stepConfig: Record<Exclude<Step, 'success'>, { title: string; subtitle: string; pinLength: number }> = {
    current: { title: 'Enter current PIN',  subtitle: 'Confirm it\'s you',          pinLength: 4 },
    new:     { title: 'Choose a new PIN',   subtitle: 'At least 4 digits',           pinLength: 4 },
    confirm: { title: 'Confirm new PIN',    subtitle: 'Enter it one more time',      pinLength: 4 },
  }

  const canSubmit = activePin.length >= 4 && !saving

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-8 py-6 text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-blue-600 text-xl font-black">WWW</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Change PIN</h1>
          <p className="text-blue-100 text-sm mt-1">{user.name}</p>
        </div>

        <div className="px-8 py-6">
          {step === 'success' ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">PIN Updated</h2>
              <p className="text-gray-500 text-sm mb-8">Your new PIN is active. Use it next time you sign in.</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 font-semibold transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => {
                  if (step === 'current') router.push('/dashboard')
                  else if (step === 'new') { setStep('current'); setNewPin(''); setError('') }
                  else if (step === 'confirm') { setStep('new'); setConfirmPin(''); setError('') }
                }}
                className="flex items-center text-blue-600 text-sm mb-5 hover:text-blue-800"
              >
                ← Back
              </button>

              {/* Step indicator */}
              <div className="flex gap-1.5 justify-center mb-5">
                {(['current', 'new', 'confirm'] as const).map((s, i) => (
                  <div
                    key={s}
                    className={`h-1.5 rounded-full transition-all ${
                      s === step ? 'w-8 bg-blue-600' :
                      ['current', 'new', 'confirm'].indexOf(step) > i ? 'w-4 bg-blue-300' :
                      'w-4 bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <p className="text-center text-gray-800 font-semibold text-lg mb-1">
                {stepConfig[step].title}
              </p>
              <p className="text-center text-gray-500 text-sm mb-6">
                {stepConfig[step].subtitle}
              </p>

              {/* PIN dots */}
              <div className="flex justify-center gap-3 mb-6">
                {Array.from({ length: Math.max(4, activePin.length) }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-colors ${
                      i < activePin.length
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
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) =>
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
                      onClick={() => handleKey(key)}
                      className="h-14 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-900 text-xl font-semibold transition-colors active:scale-95"
                    >
                      {key}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={!canSubmit}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                {saving ? 'Saving…' : step === 'confirm' ? 'Save New PIN' : 'Continue'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
