import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

type Client = SupabaseClient<Database>

let _client: Client | undefined

function getClient(): Client {
  if (!_client) {
    _client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return _client
}

export const supabase = new Proxy({} as Client, {
  get(_target, prop: string | symbol) {
    return getClient()[prop as keyof Client]
  },
})
