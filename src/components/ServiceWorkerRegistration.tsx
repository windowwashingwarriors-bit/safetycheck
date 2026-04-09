'use client'

import { useEffect } from 'react'

// Called from the dashboard when a user is logged in.
// Requests notification permission then subscribes to web push.
export async function subscribeToPush(userId: string): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false

  try {
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return false

    const reg = await navigator.serviceWorker.ready

    // Check if already subscribed
    let sub = await reg.pushManager.getSubscription()

    if (!sub) {
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
    }

    // Save to server
    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, subscription: sub.toJSON() }),
    })

    return res.ok
  } catch (err) {
    console.warn('[push] subscription failed:', err)
    return false
  }
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const arr = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i)
  return arr.buffer as ArrayBuffer
}

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => console.log('[SW] registered:', reg.scope))
        .catch(err => console.warn('[SW] registration failed:', err))
    }
  }, [])

  return null
}
