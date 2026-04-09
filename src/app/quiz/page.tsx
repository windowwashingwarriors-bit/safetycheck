'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { buildPools, selectDailyQuestions, getDailyQuote } from '@/lib/quiz-utils'

type Question = {
  id: string
  category: string
  season: string
  type: 'multiple_choice' | 'short_answer'
  question: string
  options: string[] | null
  correct_answer: string | null
  grading_guidance: string | null
  reference: string | null
  video_url: string | null
}

type Quote = {
  id: string
  quote: string
  author: string
  sort_order: number | null
}

export default function QuizPage() {
  const [user, setUser] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const initQuiz = async () => {
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      if (!userData.id) {
        router.push('/login')
        return
      }
      setUser(userData)

      const today = new Date().toISOString().split('T')[0]

      // Check if already completed today
      const { data: existingSession } = await supabase
        .from('sessions')
        .select('id')
        .eq('user_id', userData.id)
        .eq('date', today)
        .single()

      if (existingSession) {
        router.push('/dashboard')
        return
      }

      // Load all data in parallel
      const [allQuestionsRes, historyRes, quotesRes] = await Promise.all([
        supabase.from('questions').select('*'),
        supabase
          .from('question_history')
          .select('question_id')
          .eq('user_id', userData.id),
        supabase.from('quotes').select('*').order('sort_order'),
      ])

      const allQuestions = (allQuestionsRes.data || []) as Question[]
      const usedIds = (historyRes.data || []).map((r: any) => r.question_id)
      const quotes = (quotesRes.data || []) as Quote[]

      // Build category pools and select today's questions
      const pools = buildPools(allQuestions as any)
      const selected = selectDailyQuestions(userData, pools as any, usedIds)
      setQuestions(selected as Question[])

      // Daily quote (same for all users today)
      setQuote(getDailyQuote(quotes))

      setLoading(false)
    }

    initQuiz()
  }, [router])

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.')
      return
    }

    setSubmitting(true)
    const today = new Date().toISOString().split('T')[0]

    try {
      // Save session
      const { error: sessionErr } = await supabase.from('sessions').insert({
        user_id: user.id,
        date: today,
        questions: questions as any,
        answers: answers as any,
        completed_at: new Date().toISOString(),
        signature: user.name,
      })

      if (sessionErr) throw sessionErr

      // Record questions in history for cycling (upsert to handle edge cases)
      const historyRows = questions.map(q => ({
        user_id: user.id,
        question_id: q.id,
        used_date: today,
      }))

      await supabase.from('question_history').upsert(historyRows, {
        onConflict: 'user_id,question_id',
      })

      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      alert('Failed to submit quiz. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No questions available for today.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 text-blue-600 underline"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const isAnswered = !!answers[question?.id]
  const allAnswered = Object.keys(answers).length === questions.length
  const isLast = currentQuestion === questions.length - 1

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
              <p className="text-sm text-gray-500">Hi, {user?.name}</p>
            </div>
          </div>
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
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Daily quote */}
        {quote && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-r-lg">
            <p className="text-blue-800 font-medium text-sm">Daily Motivation</p>
            <p className="text-blue-700 mt-1 italic">"{quote.quote}"</p>
            <p className="text-blue-500 text-sm mt-1">— {quote.author}</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-900">Daily Safety Quiz</h2>
              <span className="text-sm text-gray-500">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          {question && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    question.category === 'safety'
                      ? 'bg-red-100 text-red-700'
                      : question.category === 'policy'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {question.category.replace('_', ' ')}
                  </span>
                  {question.type === 'short_answer' && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                      written response
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
                {question.reference && (
                  <p className="text-xs text-gray-400 mt-1">Ref: {question.reference}</p>
                )}
              </div>

              {/* Multiple choice */}
              {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-3">
                  {question.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[question.id] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswer(question.id, option)}
                        className="text-blue-600"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Short answer */}
              {question.type === 'short_answer' && (
                <div>
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={e => handleAnswer(question.id, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    rows={5}
                    placeholder="Type your answer here…"
                  />
                  {question.grading_guidance && (
                    <p className="text-xs text-gray-400 mt-2">
                      Think about: {question.grading_guidance}
                    </p>
                  )}
                </div>
              )}

              {/* Incorrect answer — show video link if available */}
              {question.type === 'multiple_choice' &&
                answers[question.id] &&
                answers[question.id] !== question.correct_answer &&
                question.video_url && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 font-medium text-sm">Review this topic:</p>
                    <a
                      href={question.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm underline mt-1 inline-block"
                    >
                      Watch Training Video →
                    </a>
                  </div>
                )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {!isLast ? (
              <button
                onClick={() => setCurrentQuestion(prev => prev + 1)}
                disabled={!isAnswered}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || submitting}
                className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-colors"
              >
                {submitting ? 'Submitting…' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
