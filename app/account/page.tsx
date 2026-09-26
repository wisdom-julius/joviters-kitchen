
'use client'

import type { User } from '@supabase/supabase-js'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getSafeSession, onSafeAuthStateChange, signOutSafely, supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getUserOrders } from '@/lib/services/orderService'
import { uploadAvatarImage } from '@/lib/services/profileService'

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'on the way' | 'delivered'

interface Order {
  id: string
  customer_name: string
  total_amount: number
  status: OrderStatus
  created_at: string
}

const statusConfig: Record<OrderStatus, { bg: string; text: string; badge: string }> = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-200 text-gray-700' },
  preparing: { bg: 'bg-amber-50', text: 'text-amber-800', badge: 'bg-amber-200 text-amber-800' },
  ready: { bg: 'bg-blue-50', text: 'text-blue-800', badge: 'bg-blue-200 text-blue-800' },
  'on the way': { bg: 'bg-purple-50', text: 'text-purple-800', badge: 'bg-purple-200 text-purple-800' },
  delivered: { bg: 'bg-green-50', text: 'text-green-800', badge: 'bg-green-200 text-green-800' },
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(supabase))
  const [updating, setUpdating] = useState(false)
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(Boolean(supabase))

  const loadOrders = useCallback(async (userId: string) => {
    setOrdersLoading(true)
    try {
      const userOrders = await getUserOrders(userId)
      setOrders(userOrders as Order[])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabase) {
      return
    }

    const getSession = async () => {
      const session = await getSafeSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      setFullName(session.user.user_metadata?.full_name || '')
      setAvatarUrl(session.user.user_metadata?.avatar_url || '')
      setIsLoading(false)
      
      await loadOrders(session.user.id)
    }

    getSession()

    const unsubscribe = onSafeAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      setFullName(session.user.user_metadata?.full_name || '')
      setAvatarUrl(session.user.user_metadata?.avatar_url || '')
      setIsLoading(false)
      loadOrders(session.user.id)
    })

    return unsubscribe
  }, [loadOrders, router])

  const handleSignOut = async () => {
    if (supabase) {
      await signOutSafely()
    }
  }

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !user || !supabase) return

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please choose an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image must be smaller than 5MB.')
      return
    }

    setAvatarError(null)
    setUploadingAvatar(true)
    try {
      const url = await uploadAvatarImage(user.id, file)
      if (!url) {
        setAvatarError('Failed to upload photo. Please try again.')
        return
      }

      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: url }
      })
      if (error) {
        setAvatarError('Uploaded, but failed to save to your profile. Please try again.')
        return
      }

      setAvatarUrl(url)
      setUser({ ...user, user_metadata: { ...user.user_metadata, avatar_url: url } })
    } catch (error) {
      console.error('Error updating avatar:', error)
      setAvatarError('Failed to upload photo. Please try again.')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !user) return
    
    setUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })
      if (!error) {
        setUser({ ...user, user_metadata: { ...user.user_metadata, full_name: fullName } })
      }
    } finally {
      setUpdating(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">Loading your account...</p>
        </div>
      </div>
    )
  }

  const userInitial = (fullName || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#111111] to-[#222222] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="relative flex-shrink-0 group">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="w-28 h-28 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8941F] flex items-center justify-center shadow-2xl border-4 border-white/10 overflow-hidden relative"
                aria-label="Change profile photo"
              >
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Profile photo" fill sizes="112px" className="object-cover" />
                ) : (
                  <span className="text-4xl font-bold font-serif text-[#111111]">{userInitial}</span>
                )}
                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  {uploadingAvatar ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
            <div className="flex-1">
              <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2 font-medium">My Account</p>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">
                {fullName || user?.email?.split('@')[0] || 'Welcome'}
              </h1>
              <p className="text-gray-300 text-sm">{user?.email}</p>
              {avatarError && (
                <p className="text-red-400 text-sm mt-2">{avatarError}</p>
              )}
            </div>
            <button
              onClick={handleSignOut}
              className="px-8 py-3 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold tracking-wide rounded-full hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl luxury-shadow-sm p-8 sticky top-32">
              <h2 className="text-2xl font-serif font-semibold text-[#111111] mb-8 pb-4 border-b border-[#E5E5E5]">Profile</h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-3 tracking-wide">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-5 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 text-[#111111]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-3 tracking-wide">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-5 py-4 border-2 border-[#E5E5E5] rounded-xl bg-[#F8F8F8] text-[#999999] cursor-not-allowed"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-[#111111] text-white py-4 rounded-full font-semibold tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300 disabled:opacity-50"
                >
                  {updating ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </div>
                  ) : 'Update Profile'}
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-[#E5E5E5]">
                <Link href="/" className="flex items-center gap-2 text-[#666666] hover:text-[#D4AF37] transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl luxury-shadow-sm p-8">
              <h2 className="text-2xl font-serif font-semibold text-[#111111] mb-8 pb-4 border-b border-[#E5E5E5]">Order History</h2>
              
              {ordersLoading ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                  <p className="text-[#666666] tracking-wide">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-24 h-24 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#111111] mb-3">No Orders Yet</h3>
                  <p className="text-[#666666] mb-8 max-w-sm mx-auto leading-relaxed">
                    Start your culinary journey with our authentic Nigerian dishes!
                  </p>
                  <Link href="/menu" className="inline-flex items-center gap-2 bg-[#111111] text-white px-8 py-4 rounded-full font-semibold tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300">
                    Browse Menu
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className={`p-6 rounded-2xl border-2 border-transparent hover:border-[rgba(212,175,55,0.3)] transition-all duration-300 ${statusConfig[order.status].bg}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                        <div>
                          <p className="text-xs tracking-[0.2em] uppercase text-[#999999] mb-1">Order ID</p>
                          <p className="font-serif font-semibold text-[#111111] text-lg">#{order.id.slice(0, 8).toUpperCase()}</p>
                        </div>
                        <span className={`px-5 py-2 rounded-full text-xs font-bold tracking-wide ${statusConfig[order.status].badge}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[#E5E5E5]/50">
                        <div>
                          <p className="text-xs tracking-[0.2em] uppercase text-[#999999] mb-1">Date</p>
                          <p className="text-[#666666] text-sm">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs tracking-[0.2em] uppercase text-[#999999] mb-1">Total</p>
                          <p className="text-[#D4AF37] font-bold font-serif text-2xl">₦{Number(order.total_amount).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-[#E5E5E5]/50 flex justify-end">
                        <Link 
                          href={`/track-order?orderId=${order.id}`} 
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#B8941F] transition-colors duration-300"
                        >
                          Track Order
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
