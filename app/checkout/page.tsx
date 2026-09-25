// 'use client'

// import type { User } from '@supabase/supabase-js'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useCart } from '@/lib/CartContext'
// import { createOrder } from '@/lib/services/orderService'
// import { getSafeSession, supabase } from '@/lib/supabase'

// export default function CheckoutPage() {
//   const router = useRouter()
//   const { cart, cartTotal, clearCart } = useCart()
//   const [user, setUser] = useState<User | null>(null)
//   const [formData, setFormData] = useState({
//     name: '',
//     phone: '',
//     address: '',
//     paymentMethod: 'card'
//   })
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     if (!supabase) return

//     const getSession = async () => {
//       const session = await getSafeSession()
//       setUser(session?.user || null)
//     }
//     getSession()
//   }, [])

//   if (cart.length === 0) {
//     router.push('/menu')
//     return null
//   }

//   // Check if user is logged in (only if Supabase is configured)
//   const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
//     process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL'
    
//   if (isSupabaseConfigured && !user) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F8F8] py-16">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
//           <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-serif font-bold text-[#111111] mb-4">Login Required</h2>
//           <p className="text-gray-600 mb-8">
//             Please login to complete your checkout and place your order with Joviter&apos;s Kitchen.
//           </p>
//           <button
//             onClick={() => router.push('/login')}
//             className="w-full bg-[#111111] text-white py-4 rounded-full font-bold text-lg tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300"
//           >
//             Login Now
//           </button>
//         </div>
//       </div>
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsProcessing(true)
//     setError(null)
    
//     try {
//       // Check if Supabase is configured
//       const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
//         process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL'

//       if (isSupabaseConfigured) {
//         // Use real Supabase
//         const result = await createOrder({
//           customerName: formData.name,
//           customerPhone: formData.phone,
//           customerAddress: formData.address,
//           totalAmount: cartTotal,
//           paymentMethod: formData.paymentMethod,
//           items: cart,
//           userId: user?.id
//         })

//         if (result.success && result.orderId) {
//           clearCart()
//           router.push(`/track-order?orderId=${result.orderId}`)
//         } else {
//           throw new Error('Failed to create order')
//         }
//       } else {
//         // Fallback to mock
//         console.log('Using mock order creation (Supabase not configured)')
//         const orderId = Math.random().toString(36).substr(2, 9).toUpperCase()
//         clearCart()
//         router.push(`/track-order?orderId=${orderId}`)
//       }
//     } catch (err) {
//       setError('Something went wrong. Please try again.')
//       console.error('Checkout error:', err)
//     } finally {
//       setIsProcessing(false)
//     }
//   };

//   return (
//     <div className="py-16 md:py-24 bg-[#F8F8F8]">
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="text-center mb-12">
//         <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Complete Your Order</p>
//         <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Checkout</h1>
//         {error && (
//           <p className="mt-4 text-red-500">{error}</p>
//         )}
//       </div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//           <div className="lg:col-span-2">
//             <form onSubmit={handleSubmit} className="bg-white rounded-2xl luxury-shadow-sm p-8 md:p-10">
//               <h2 className="text-2xl font-serif font-semibold mb-8 text-[#111111]">Delivery Information</h2>
              
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-[#666666] mb-2 tracking-wide">Full Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={(e) => setFormData({...formData, name: e.target.value})}
//                     className="w-full px-5 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-colors duration-300 text-[#111111] placeholder-[#999999]"
//                     placeholder="Enter your full name"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-[#666666] mb-2 tracking-wide">Phone Number</label>
//                   <input
//                     type="tel"
//                     required
//                     value={formData.phone}
//                     onChange={(e) => setFormData({...formData, phone: e.target.value})}
//                     className="w-full px-5 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-colors duration-300 text-[#111111] placeholder-[#999999]"
//                     placeholder="+234 812 345 6789"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-[#666666] mb-2 tracking-wide">Delivery Address</label>
//                   <textarea
//                     required
//                     rows={4}
//                     value={formData.address}
//                     onChange={(e) => setFormData({...formData, address: e.target.value})}
//                     className="w-full px-5 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-colors duration-300 text-[#111111] placeholder-[#999999] resize-none"
//                     placeholder="Enter your delivery address"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-[#666666] mb-4 tracking-wide">Payment Method</label>
//                   <div className="space-y-3">
//                     <label className="flex items-center gap-4 p-5 border-2 border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#D4AF37] transition-colors duration-300 bg-white">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="card"
//                         checked={formData.paymentMethod === 'card'}
//                         onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
//                         className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
//                       />
//                       <div className="flex items-center gap-3">
//                         <span className="text-2xl">💳</span>
//                         <span className="text-[#111111] font-medium">Debit/Credit Card</span>
//                       </div>
//                     </label>
//                     <label className="flex items-center gap-4 p-5 border-2 border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#D4AF37] transition-colors duration-300 bg-white">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="transfer"
//                         checked={formData.paymentMethod === 'transfer'}
//                         onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
//                         className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
//                       />
//                       <div className="flex items-center gap-3">
//                         <span className="text-2xl">🏦</span>
//                         <span className="text-[#111111] font-medium">Bank Transfer</span>
//                       </div>
//                     </label>
//                     <label className="flex items-center gap-4 p-5 border-2 border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#D4AF37] transition-colors duration-300 bg-white">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="cash"
//                         checked={formData.paymentMethod === 'cash'}
//                         onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
//                         className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
//                       />
//                       <div className="flex items-center gap-3">
//                         <span className="text-2xl">💵</span>
//                         <span className="text-[#111111] font-medium">Cash on Delivery</span>
//                       </div>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 disabled={isProcessing}
//                 className="w-full mt-10 bg-[#111111] text-white py-5 rounded-full font-bold text-lg tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isProcessing ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </span>
//                 ) : (
//                   <span className="flex items-center justify-center gap-2">
//                     Pay <span className="text-xl font-serif">₦{cartTotal.toLocaleString()}</span>
//                   </span>
//                 )}
//               </button>
//             </form>
//           </div>

//           <div>
//             <div className="bg-white rounded-2xl luxury-shadow-sm p-8 sticky top-28">
//               <h2 className="text-2xl font-serif font-semibold mb-6 text-[#111111]">Order Summary</h2>
//               <div className="space-y-4 mb-6">
//                 {cart.map((item) => (
//                   <div key={item.item.id} className="flex justify-between items-center text-sm">
//                     <span className="text-[#666666]">{item.item.name} x{item.quantity}</span>
//                     <span className="text-[#111111] font-medium">₦{(item.item.price * item.quantity).toLocaleString()}</span>
//                   </div>
//                 ))}
//               </div>
//               <div className="luxury-divider pt-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-[#666666] font-medium text-lg">Total</span>
//                   <span className="text-3xl font-bold text-[#D4AF37] font-serif">₦{cartTotal.toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





'use client'

import type { User } from '@supabase/supabase-js'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/CartContext'
import { createOrder } from '@/lib/services/orderService'
import { getSafeSession, supabase } from '@/lib/supabase'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, cartTotal, clearCart } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card'
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!supabase) return

    const getSession = async () => {
      const session = await getSafeSession()
      setUser(session?.user || null)
    }
    getSession()
  }, [])

  // Redirecting during render (rather than in an effect) can trigger React
  // warnings and interrupt the current render, so this runs after mount.
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/menu')
    }
  }, [cart.length, router])

  if (cart.length === 0) {
    return null
  }

  // Check if user is logged in (only if Supabase is configured)
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL'
    
  if (isSupabaseConfigured && !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#F8F8F8] py-16">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-serif font-bold text-[#111111] mb-4">Login Required</h2>
          <p className="text-gray-600 mb-8">
            Please login to complete your checkout and place your order with Joviter&apos;s Kitchen.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-[#111111] text-white py-4 rounded-full font-bold text-lg tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300"
          >
            Login Now
          </button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)
    
    try {
      // Check if Supabase is configured
      const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL'

      if (isSupabaseConfigured) {
        // Use real Supabase
        const result = await createOrder({
          customerName: formData.name,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          totalAmount: cartTotal,
          paymentMethod: formData.paymentMethod,
          items: cart,
          userId: user?.id
        })

        if (result.success && result.orderId) {
          clearCart()
          router.push(`/track-order?orderId=${result.orderId}`)
        } else {
          throw new Error(
            result.error instanceof Error ? result.error.message : 'Failed to create order'
          )
        }
      } else {
        // Fallback to mock
        console.log('Using mock order creation (Supabase not configured)')
        const orderId = Math.random().toString(36).substr(2, 9).toUpperCase()
        clearCart()
        router.push(`/track-order?orderId=${orderId}`)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('Checkout error:', err)
    } finally {
      setIsProcessing(false)
    }
  };

  return (
    <div className="py-16 md:py-24 bg-[#F8F8F8]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
        <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-3 font-medium">Complete Your Order</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Checkout</h1>
        {error && (
          <p className="mt-4 text-red-500">{error}</p>
        )}
      </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl luxury-shadow-sm p-8 md:p-10">
              <h2 className="text-2xl font-serif font-semibold mb-8 text-[#111111]">Delivery Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-2 tracking-wide">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-colors duration-300 text-[#111111] placeholder-[#999999]"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-2 tracking-wide">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-colors duration-300 text-[#111111] placeholder-[#999999]"
                    placeholder="+234 812 345 6789"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-2 tracking-wide">Delivery Address</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-5 py-4 border-2 border-[#E5E5E5] rounded-xl focus:ring-0 focus:border-[#D4AF37] outline-none transition-colors duration-300 text-[#111111] placeholder-[#999999] resize-none"
                    placeholder="Enter your delivery address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#666666] mb-4 tracking-wide">Payment Method</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-4 p-5 border-2 border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#D4AF37] transition-colors duration-300 bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💳</span>
                        <span className="text-[#111111] font-medium">Debit/Credit Card</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-5 border-2 border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#D4AF37] transition-colors duration-300 bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transfer"
                        checked={formData.paymentMethod === 'transfer'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏦</span>
                        <span className="text-[#111111] font-medium">Bank Transfer</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-4 p-5 border-2 border-[#E5E5E5] rounded-xl cursor-pointer hover:border-[#D4AF37] transition-colors duration-300 bg-white">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💵</span>
                        <span className="text-[#111111] font-medium">Cash on Delivery</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-10 bg-[#111111] text-white py-5 rounded-full font-bold text-lg tracking-wide hover:bg-[#D4AF37] hover:text-[#111111] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Pay <span className="text-xl font-serif">₦{cartTotal.toLocaleString()}</span>
                  </span>
                )}
              </button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-2xl luxury-shadow-sm p-8 sticky top-28">
              <h2 className="text-2xl font-serif font-semibold mb-6 text-[#111111]">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.item.id} className="flex justify-between items-center text-sm">
                    <span className="text-[#666666]">{item.item.name} x{item.quantity}</span>
                    <span className="text-[#111111] font-medium">₦{(item.item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="luxury-divider pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-[#666666] font-medium text-lg">Total</span>
                  <span className="text-3xl font-bold text-[#D4AF37] font-serif">₦{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}