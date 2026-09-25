'use client'

import type { User } from '@supabase/supabase-js'
import CustomAuth from '@/components/CustomAuth'
import { onSafeAuthStateChange, supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function UserLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(Boolean(supabase))
  const error = supabase ? null : 'Supabase not configured. Please set up your environment variables.'

  useEffect(() => {
    if (!supabase) {
      return
    }

    const unsubscribe = onSafeAuthStateChange((_event, session) => {
      if ((session?.user as User | undefined)?.id) {
        // User logged in, redirect to home or account page
        router.push('/')
      }
      setIsLoading(false)
    })

    return unsubscribe
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#111111] to-gray-900 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-serif font-bold text-[#111111] mb-4">Setup Required</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-500 text-sm">
            Check SUPABASE_SETUP.md for instructions
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#D4AF37] mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-serif font-bold text-[#111111]">JK</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-[#111111]">Welcome</h1>
          <p className="text-gray-500 mt-2">Sign in or create an account with Joviter&apos;s Kitchen</p>
        </div>
        <CustomAuth onSuccess={() => router.push('/')} />
      </div>
    </div>
  )
}
