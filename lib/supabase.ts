import { createClient, type AuthChangeEvent, type Session } from '@supabase/supabase-js'

// These are placeholders - you'll need to replace them with your actual Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

// Check if we have valid configuration
const isConfigured = supabaseUrl !== 'YOUR_SUPABASE_URL' && 
                     supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
                     (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))

const supabaseProjectRef = (() => {
  if (!isConfigured) {
    return null
  }

  try {
    return new URL(supabaseUrl).hostname.split('.')[0]
  } catch {
    return null
  }
})()

function isAuthFetchError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }

  return /failed to fetch|networkerror|load failed/i.test(error.message)
}

function clearStoredAuthState() {
  if (typeof window === 'undefined' || !supabaseProjectRef) {
    return
  }

  const storagePrefix = `sb-${supabaseProjectRef}-`

  for (const key of Object.keys(window.localStorage)) {
    if (key.startsWith(storagePrefix)) {
      window.localStorage.removeItem(key)
    }
  }
}

// Only create the client if properly configured
export let supabase: ReturnType<typeof createClient> | undefined = undefined

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: typeof window !== 'undefined',
        detectSessionInUrl: typeof window !== 'undefined',
        persistSession: typeof window !== 'undefined',
      },
    })
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error)
  }
}

// Helper to check if Supabase is available
export function hasSupabaseClient(): boolean {
  return typeof supabase !== 'undefined'
}

export async function getSafeSession(): Promise<Session | null> {
  if (!supabase) {
    return null
  }

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    return data.session ?? null
  } catch (error) {
    if (isAuthFetchError(error)) {
      clearStoredAuthState()
    }

    console.warn('Supabase session recovery failed:', error)
    return null
  }
}

export function onSafeAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
): () => void {
  if (!supabase) {
    return () => {}
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback)

  return () => subscription.unsubscribe()
}

export async function signOutSafely() {
  if (!supabase) {
    return
  }

  try {
    await supabase.auth.signOut()
  } catch (error) {
    if (isAuthFetchError(error)) {
      clearStoredAuthState()
    }

    console.warn('Supabase sign-out failed:', error)
  }
}
