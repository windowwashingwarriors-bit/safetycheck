// ── Season detection ────────────────────────────────────────────────────────
// Summer: April (4) through October (10)
// Winter: November (11) through March (3)
export function getCurrentSeason(): 'summer' | 'winter' {
  const month = new Date().getMonth() + 1 // 1–12
  return month >= 4 && month <= 10 ? 'summer' : 'winter'
}

// ── New-hire detection ───────────────────────────────────────────────────────
// A user is a new hire for their first 3 calendar months.
export function isNewHire(user: { hire_date: string }): boolean {
  if (!user.hire_date) return false
  const hired = new Date(user.hire_date)
  const cutoff = new Date(hired)
  cutoff.setMonth(cutoff.getMonth() + 3)
  return new Date() < cutoff
}

// ── Question-pool builder ────────────────────────────────────────────────────
type Question = {
  id: string
  category: 'safety' | 'summer_service' | 'winter_service' | 'policy'
  season: 'year_round' | 'summer' | 'winter'
  type: 'multiple_choice' | 'short_answer'
  [key: string]: unknown
}

export type QuestionPools = {
  safety: Question[]
  service: Question[]   // season-appropriate service questions
  policy: Question[]
}

export function buildPools(allQuestions: Question[]): QuestionPools {
  const season = getCurrentSeason()
  const serviceCategory = season === 'summer' ? 'summer_service' : 'winter_service'

  return {
    safety:  allQuestions.filter(q => q.category === 'safety'),
    service: allQuestions.filter(q => q.category === serviceCategory),
    policy:  allQuestions.filter(q => q.category === 'policy'),
  }
}

// ── Cycling helper ───────────────────────────────────────────────────────────
// Returns unused questions from the pool.
// If ALL questions in the pool have been used, returns the full pool (reset).
function unusedFrom(pool: Question[], usedIds: Set<string>): Question[] {
  const unused = pool.filter(q => !usedIds.has(q.id))
  return unused.length > 0 ? unused : [...pool] // reset when exhausted
}

// Simple seeded-ish shuffle using the user-id as entropy so different users
// pick different questions from the same pool on the same day.
function shuffleForUser(arr: Question[], userId: string): Question[] {
  // Simple deterministic sort using userId as a salt
  const salt = userId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return [...arr].sort((a, b) => {
    const ha = hashStr(a.id + userId + salt)
    const hb = hashStr(b.id + userId + salt)
    return ha - hb
  })
}

function hashStr(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return h >>> 0
}

// ── Daily question selector ──────────────────────────────────────────────────
// Rules:
//   New hire  → 2 safety  + 1 service
//   Veteran   → 1 safety  + 1 service + 1 policy
//   Max 1 short_answer per session
//
// usedQuestionIds: IDs of questions the user has already been assigned
export function selectDailyQuestions(
  user: { id: string; hire_date: string },
  pools: QuestionPools,
  usedQuestionIds: string[]
): Question[] {
  const usedSet = new Set(usedQuestionIds)
  const newHire = isNewHire(user)

  // Get fresh (unused) pools, shuffled per-user for variety
  const freshSafety  = shuffleForUser(unusedFrom(pools.safety,  usedSet), user.id)
  const freshService = shuffleForUser(unusedFrom(pools.service, usedSet), user.id)
  const freshPolicy  = shuffleForUser(unusedFrom(pools.policy,  usedSet), user.id)

  let selected: Question[]
  if (newHire) {
    // 2 safety + 1 service
    selected = [
      ...freshSafety.slice(0, 2),
      ...freshService.slice(0, 1),
    ]
  } else {
    // 1 safety + 1 service + 1 policy
    selected = [
      ...freshSafety.slice(0, 1),
      ...freshService.slice(0, 1),
      ...freshPolicy.slice(0, 1),
    ]
  }

  // Enforce max 1 short_answer per session.
  // If multiple short_answer questions were selected, replace extras with MC.
  const shortAnswerIndices = selected
    .map((q, i) => (q.type === 'short_answer' ? i : -1))
    .filter(i => i !== -1)

  if (shortAnswerIndices.length > 1) {
    // Keep only the first short_answer; replace the rest with MC alternatives
    for (let k = 1; k < shortAnswerIndices.length; k++) {
      const idx = shortAnswerIndices[k]
      const category = selected[idx].category
      const usedInSelection = new Set(selected.map(q => q.id))

      // Find an MC alternative from the same category that isn't already selected
      const pool =
        category === 'safety' ? pools.safety :
        category === 'policy' ? pools.policy :
        pools.service

      const mcAlternative = pool.find(
        q => q.type === 'multiple_choice' && !usedInSelection.has(q.id)
      )
      if (mcAlternative) selected[idx] = mcAlternative
    }
  }

  return selected
}

// ── Daily quote selector ─────────────────────────────────────────────────────
// Same quote for all users on the same day, rotating through the bank.
export function getDailyQuote<T extends { sort_order: number | null }>(quotes: T[]): T | null {
  if (!quotes.length) return null
  const sorted = [...quotes].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const dayOfYear = getDayOfYear(new Date())
  return sorted[dayOfYear % sorted.length]
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
