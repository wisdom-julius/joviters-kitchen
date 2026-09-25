'use client'

import type { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSafeSession, onSafeAuthStateChange, supabase } from './supabase'

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(supabase))
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!supabase) {
      return
    }

    const getSession = async () => {
      const session = await getSafeSession()
      setUser(session?.user || null)
      setIsLoading(false)
      
      if (!session?.user && pathname.startsWith('/admin')) {
        router.push('/admin/login')
      }
    }

    getSession()

    const unsubscribe = onSafeAuthStateChange((_event, session) => {
      setUser(session?.user || null)
      setIsLoading(false)
      
      if (!session?.user && pathname.startsWith('/admin')) {
        router.push('/admin/login')
      } else if (session?.user && pathname === '/admin/login') {
        router.push('/admin')
      }
    })

    return unsubscribe
  }, [pathname, router])

  // Admin status is read from app_metadata, which is embedded in the JWT
  // and can only be set server-side (e.g. via SQL), so a customer can never
  // grant themselves this by signing up. See database/admin_security_fix.sql.
  const isAdmin = user?.app_metadata?.role === 'admin'

  return { user, isLoading, isAdmin }
}
