// GET /api/cron/daily-reminder
// Called by Vercel Cron at 8am Mon–Sat (America/Denver, UTC-6/7).
// Sends a web push notification to every technician who hasn't yet
// completed today's quiz.
//
// Vercel Cron schedule: "0 14 * * 1-6"  (14:00 UTC = 8:00 AM MDT, UTC-6)
// Adjust offset for your timezone — see vercel.json.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  // Protect against accidental public invocation in production
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]

  // Get all active technicians
  const { data: technicians, error: techErr } = await supabase
    .from('users')
    .select('id, name')
    .eq('role', 'technician')
    .eq('is_active', true)

  if (techErr) {
    return NextResponse.json({ error: techErr.message }, { status: 500 })
  }

  // Get IDs of technicians who already completed today
  const { data: doneSessions } = await supabase
    .from('sessions')
    .select('user_id')
    .eq('date', today)
    .not('completed_at', 'is', null)

  const doneIds = new Set((doneSessions || []).map((s: any) => s.user_id))
  const pendingTechs = (technicians || []).filter((t: any) => !doneIds.has(t.id))

  if (pendingTechs.length === 0) {
    return NextResponse.json({ sent: 0, message: 'All technicians already completed today' })
  }

  // Get push subscriptions for pending technicians
  const pendingIds = pendingTechs.map((t: any) => t.id)
  const { data: subs } = await supabase
    .from('push_subscriptions')
    .select('user_id, endpoint, p256dh, auth')
    .in('user_id', pendingIds)

  if (!subs || subs.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No push subscriptions found' })
  }

  const payload = JSON.stringify({
    title: 'SafetyCheck Reminder',
    body: "Complete your daily safety training now — it only takes 2 minutes!",
    url: '/quiz',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'daily-reminder',
  })

  let sent = 0
  let failed = 0
  const staleSubs: string[] = []

  await Promise.all(
    (subs as any[]).map(async sub => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        )
        sent++
      } catch (err: any) {
        // 404/410 means the subscription is no longer valid — clean it up
        if (err.statusCode === 404 || err.statusCode === 410) {
          staleSubs.push(sub.endpoint)
        }
        failed++
        console.error('[cron/daily-reminder] push error:', err.message, sub.endpoint.slice(-20))
      }
    })
  )

  // Remove stale subscriptions
  if (staleSubs.length > 0) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .in('endpoint', staleSubs)
  }

  return NextResponse.json({
    sent,
    failed,
    staleRemoved: staleSubs.length,
    pending: pendingTechs.length,
    date: today,
  })
}
