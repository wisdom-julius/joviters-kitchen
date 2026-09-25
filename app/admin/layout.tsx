// 'use client'

// import Link from 'next/link'
// import { usePathname } from 'next/navigation'
// import { useSupabaseAuth } from '@/lib/useSupabaseAuth'
// import { signOutSafely, supabase } from '@/lib/supabase'

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const pathname = usePathname()
//   const { user, isLoading } = useSupabaseAuth()

//   const navItems = [
//     { href: '/admin', label: 'Dashboard' },
//     { href: '/admin/menu', label: 'Menu' },
//     { href: '/admin/orders', label: 'Orders' },
//   ]

//   const handleLogout = async () => {
//     if (supabase) {
//       await signOutSafely()
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
//         <div className="animate-pulse text-lg">Loading...</div>
//       </div>
//     )
//   }

//   if (!supabase) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-8">
//         <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
//           <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
//           <h1 className="text-2xl font-serif font-bold text-[#111111] mb-4">Supabase Not Configured</h1>
//           <p className="text-gray-600 mb-6">
//             Please set up your Supabase environment variables to use the admin panel.
//           </p>
//           <Link 
//             href="/"
//             className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#111111] px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Home
//           </Link>
//         </div>
//       </div>
//     )
//   }

//   if (pathname === '/admin/login') {
//     return <>{children}</>
//   }

//   if (!user) {
//     return null
//   }

//   return (
//     <div className="flex min-h-screen bg-[#F8F8F8]">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#111111] text-white flex flex-col">
//         <div className="p-6 border-b border-[rgba(212,175,55,0.3)]">
//           <Link href="/admin" className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D4AF37] text-[#111111] text-lg font-serif">
//               JK
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold tracking-wider font-serif">Admin Panel</h2>
//               <p className="text-xs tracking-[0.2em] text-[#D4AF37] uppercase">Joviter&apos;s Kitchen</p>
//             </div>
//           </Link>
//         </div>
//         <nav className="flex-1 p-4 space-y-2">
//           {navItems.map((item) => (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
//                 pathname === item.href 
//                   ? 'bg-[#D4AF37] text-[#111111] font-semibold' 
//                   : 'text-gray-300 hover:bg-[rgba(212,175,55,0.1)] hover:text-white'
//               }`}
//             >
//               {item.label}
//             </Link>
//           ))}
//         </nav>
//         <div className="p-4 border-t border-[rgba(212,175,55,0.3)] space-y-2">
//           <div className="px-4 py-2 text-xs text-gray-400">
//             {user.email}
//           </div>
//           <button 
//             onClick={handleLogout}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-900/20 transition-colors duration-200"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </button>
//           <Link 
//             href="/" 
//             className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Site
//           </Link>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1">
//         {children}
//       </main>
//     </div>
//   )
// }



'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabaseAuth } from '@/lib/useSupabaseAuth'
import { signOutSafely, supabase } from '@/lib/supabase'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, isLoading, isAdmin } = useSupabaseAuth()

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/menu', label: 'Menu' },
    { href: '/admin/orders', label: 'Orders' },
  ]

  const handleLogout = async () => {
    if (supabase) {
      await signOutSafely()
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-yellow-500 text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-serif font-bold text-[#111111] mb-4">Supabase Not Configured</h1>
          <p className="text-gray-600 mb-6">
            Please set up your Supabase environment variables to use the admin panel.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#111111] px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!user) {
    return null
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F8F8] p-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="text-red-500 text-4xl mb-4">⛔</div>
          <h1 className="text-2xl font-serif font-bold text-[#111111] mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            This account doesn&apos;t have admin access. Please sign in with an administrator account.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#111111] px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] text-white flex flex-col">
        <div className="p-6 border-b border-[rgba(212,175,55,0.3)]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#D4AF37] text-[#111111] text-lg font-serif">
              JK
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-wider font-serif">Admin Panel</h2>
              <p className="text-xs tracking-[0.2em] text-[#D4AF37] uppercase">Joviter&apos;s Kitchen</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                pathname === item.href 
                  ? 'bg-[#D4AF37] text-[#111111] font-semibold' 
                  : 'text-gray-300 hover:bg-[rgba(212,175,55,0.1)] hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-[rgba(212,175,55,0.3)] space-y-2">
          <div className="px-4 py-2 text-xs text-gray-400">
            {user.email}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-red-900/20 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <Link 
            href="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
