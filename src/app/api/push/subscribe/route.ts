// POST /api/push/subscribe
// Saves or refreshes a push subscription for a user.
// Body: { userId: string, subscription: PushSubscriptionJSON }

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)

  if (!body?.userId || !body?.subscription?.endpoint) {
    return NextResponse.json({ error: 'Missing userId or subscription' }, { status: 400 })
  }

  const { userId, subscription } = body
  const { endpoint, keys } = subscription

  if (!keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Missing subscription keys' }, { status: 400 })
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert(
      { user_id: userId, endpoint, p256dh: keys.p256dh, auth: keys.auth },
      { onConflict: 'user_id,endpoint' }
    )

  if (error) {
    console.error('[push/subscribe] DB error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// DELETE /api/push/subscribe
// Removes a subscription (e.g. when user revokes permission).
// Body: { userId: string, endpoint: string }

export async function DELETE(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.userId || !body?.endpoint) {
    return NextResponse.json({ error: 'Missing userId or endpoint' }, { status: 400 })
  }

  await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', body.userId)
    .eq('endpoint', body.endpoint)

  return NextResponse.json({ ok: true })
}
