// 'use client'

// import { useEffect, useState } from 'react'
// import { getMenuItems } from '@/lib/services/menuService'
// import { getAllOrders } from '@/lib/services/orderService'
// import Link from 'next/link'

// type OrderStatus = 'pending' | 'preparing' | 'ready' | 'on the way' | 'delivered'

// interface Order {
//   id: string
//   customer_name: string
//   customer_phone: string
//   total_amount: number
//   status: OrderStatus
//   created_at: string
// }

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalMenuItems: 0,
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalRevenue: 0,
//   })
//   const [isLoading, setIsLoading] = useState(true)
//   const [recentOrders, setRecentOrders] = useState<Order[]>([])

//   useEffect(() => {
//     async function loadStats() {
//       try {
//         setIsLoading(true)
//         const menuItems = await getMenuItems()
//         const orders = await getAllOrders()
        
//         const ordersList = orders as Order[]
        
//         setStats({
//           totalMenuItems: menuItems.length,
//           totalOrders: ordersList.length,
//           pendingOrders: ordersList.filter(o => o.status === 'pending').length,
//           totalRevenue: ordersList.reduce((sum, order) => sum + Number(order.total_amount), 0),
//         })
        
//         setRecentOrders(ordersList.slice(0, 5))
//       } catch (error) {
//         console.error('Failed to load stats:', error)
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadStats()
//   }, [])

//   const statusConfig: Record<OrderStatus, { bg: string; text: string }> = {
//     pending: { bg: 'bg-gray-100', text: 'text-gray-800' },
//     preparing: { bg: 'bg-amber-100', text: 'text-amber-800' },
//     ready: { bg: 'bg-blue-100', text: 'text-blue-800' },
//     'on the way': { bg: 'bg-purple-100', text: 'text-purple-800' },
//     delivered: { bg: 'bg-green-100', text: 'text-green-800' }
//   }

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr)
//     const now = new Date()
//     const diffMs = now.getTime() - date.getTime()
//     const diffMins = Math.floor(diffMs / 60000)
    
//     if (diffMins < 1) return 'Just now'
//     if (diffMins < 60) return `${diffMins} min ago`
//     if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
//     return date.toLocaleDateString()
//   }

//   const statCards = [
//     { 
//       label: 'Total Menu Items', 
//       value: stats.totalMenuItems, 
//       icon: (
//         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//         </svg>
//       ),
//       color: 'bg-[#D4AF37]'
//     },
//     { 
//       label: 'Total Orders', 
//       value: stats.totalOrders, 
//       icon: (
//         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//         </svg>
//       ),
//       color: 'bg-[#111111]'
//     },
//     { 
//       label: 'Pending Orders', 
//       value: stats.pendingOrders, 
//       icon: (
//         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       color: 'bg-amber-500'
//     },
//     { 
//       label: 'Total Revenue', 
//       value: `₦${stats.totalRevenue.toLocaleString()}`, 
//       icon: (
//         <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       color: 'bg-green-600'
//     },
//   ]

//   return (
//     <div className="p-8 bg-[#F8F8F8] min-h-screen">
//       <div className="mb-10">
//         <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2 font-medium">ADMINISTRATION</p>
//         <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Dashboard</h1>
//         <p className="text-gray-500 mt-2">Welcome back! Here's what's happening in your restaurant today.</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
//         {isLoading ? (
//           [...Array(4)].map((_, idx) => (
//             <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
//               <div className="w-14 h-14 bg-gray-100 rounded-full animate-pulse mb-4" />
//               <div className="h-8 bg-gray-100 rounded animate-pulse w-2/3 mb-2" />
//               <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
//             </div>
//           ))
//         ) : (
//           statCards.map((stat, idx) => (
//             <div key={idx} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
//               <div className="flex items-center justify-between mb-5">
//                 <div className={`w-14 h-14 rounded-full ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
//                   {stat.icon}
//                 </div>
//               </div>
//               <p className="text-3xl font-serif font-bold text-[#111111]">{stat.value}</p>
//               <p className="text-gray-500 text-sm mt-2 tracking-wide">{stat.label}</p>
//             </div>
//           ))
//         )}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Recent Orders */}
//         <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
//           <div className="flex items-center justify-between mb-7">
//             <h3 className="text-xl font-serif font-semibold text-[#111111]">Recent Orders</h3>
//             <Link href="/admin/orders" className="text-sm text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200">
//               View All
//             </Link>
//           </div>
          
//           {isLoading ? (
//             <div className="space-y-4">
//               {[...Array(3)].map((_, idx) => (
//                 <div key={idx} className="p-4 bg-gray-50 rounded-xl animate-pulse">
//                   <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
//                   <div className="h-4 bg-gray-200 rounded w-1/2" />
//                 </div>
//               ))}
//             </div>
//           ) : recentOrders.length === 0 ? (
//             <div className="text-center py-10">
//               <p className="text-gray-400">No orders yet</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {recentOrders.map((order) => (
//                 <div key={order.id} className="flex items-center justify-between p-5 bg-[#F8F8F8] rounded-xl hover:bg-gray-100 transition-colors duration-300">
//                   <div>
//                     <p className="font-serif font-semibold text-[#111111]">#{order.id.slice(0, 8).toUpperCase()}</p>
//                     <p className="text-sm text-gray-500 mt-1">{order.customer_name}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-[#D4AF37] font-serif text-lg">₦{Number(order.total_amount).toLocaleString()}</p>
//                     <span className={`inline-block text-xs px-3 py-1 rounded-full mt-1 font-semibold uppercase tracking-wide ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
//                       {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                     </span>
//                     <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
//           <h3 className="text-xl font-serif font-semibold text-[#111111] mb-7">Quick Actions</h3>
//           <div className="space-y-4">
//             <Link href="/admin/menu" className="flex items-center justify-between p-5 bg-[#F8F8F8] rounded-xl hover:bg-gray-100 transition-all duration-300 group">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-[#111111]">Add New Menu Item</p>
//                   <p className="text-sm text-gray-500">Add dishes to your menu</p>
//                 </div>
//               </div>
//               <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </Link>
            
//             <Link href="/admin/orders" className="flex items-center justify-between p-5 bg-[#F8F8F8] rounded-xl hover:bg-gray-100 transition-all duration-300 group">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-[#111111]/10 rounded-full flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors duration-300">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-[#111111]">Manage Orders</p>
//                   <p className="text-sm text-gray-500">Track and update orders</p>
//                 </div>
//               </div>
//               <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </Link>

//             <Link href="/menu" className="flex items-center justify-between p-5 bg-[#F8F8F8] rounded-xl hover:bg-gray-100 transition-all duration-300 group">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
//                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 </div>
//                 <div>
//                   <p className="font-semibold text-[#111111]">View Live Menu</p>
//                   <p className="text-sm text-gray-500">See your customer-facing menu</p>
//                 </div>
//               </div>
//               <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





'use client'

import { useEffect, useState } from 'react'
import { getMenuItems } from '@/lib/services/menuService'
import { getAllOrders } from '@/lib/services/orderService'
import Link from 'next/link'

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'on the way' | 'delivered'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  total_amount: number
  status: OrderStatus
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalMenuItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true)
        const menuItems = await getMenuItems()
        const orders = await getAllOrders()
        
        const ordersList = orders as Order[]
        
        setStats({
          totalMenuItems: menuItems.length,
          totalOrders: ordersList.length,
          pendingOrders: ordersList.filter(o => o.status === 'pending').length,
          totalRevenue: ordersList.reduce((sum, order) => sum + Number(order.total_amount), 0),
        })
        
        setRecentOrders(ordersList.slice(0, 5))
      } catch (error) {
        console.error('Failed to load stats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadStats()
  }, [])

  const statusConfig: Record<OrderStatus, { bg: string; text: string }> = {
    pending: { bg: 'bg-gray-100', text: 'text-gray-800' },
    preparing: { bg: 'bg-amber-100', text: 'text-amber-800' },
    ready: { bg: 'bg-blue-100', text: 'text-blue-800' },
    'on the way': { bg: 'bg-purple-100', text: 'text-purple-800' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800' }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`
    return date.toLocaleDateString()
  }

  const statCards = [
    { 
      label: 'Total Menu Items', 
      value: stats.totalMenuItems, 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-[#D4AF37]'
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      color: 'bg-[#111111]'
    },
    { 
      label: 'Pending Orders', 
      value: stats.pendingOrders, 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-amber-500'
    },
    { 
      label: 'Total Revenue', 
      value: `₦${stats.totalRevenue.toLocaleString()}`, 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-600'
    },
  ]

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="mb-10">
        <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2 font-medium">ADMINISTRATION</p>
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here&apos;s what&apos;s happening in your restaurant today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {isLoading ? (
          [...Array(4)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-gray-100 rounded-full animate-pulse mb-4" />
              <div className="h-8 bg-gray-100 rounded animate-pulse w-2/3 mb-2" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
            </div>
          ))
        ) : (
          statCards.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center justify-between mb-5">
                <div className={`w-14 h-14 rounded-full ${stat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-3xl font-serif font-bold text-[#111111]">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-2 tracking-wide">{stat.label}</p>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-7">
            <h3 className="text-xl font-serif font-semibold text-[#111111]">Recent Orders</h3>
            <Link href="/admin/orders" className="text-sm text-[#D4AF37] hover:text-[#B8941F] font-medium transition-colors duration-200">
              View All
            </Link>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-5 bg-[#F8F8F8] rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <div>
                    <p className="font-serif font-semibold text-[#111111]">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-500 mt-1">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#D4AF37] font-serif text-lg">₦{Number(order.total_amount).toLocaleString()}</p>
                    <span className={`inline-block text-xs px-3 py-1 rounded-full mt-1 font-semibold uppercase tracking-wide ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-serif font-semibold text-[#111111] mb-7">Quick Actions</h3>
          <div className="space-y-4">
            <Link href="/admin/menu" className="flex items-center justify-between p-5 bg-[#F8F8F8] rounded-xl hover:bg-gray-100 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#D4AF37]/10 rounded-full flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#111111]">Add New Menu Item</p>
                  <p className="text-sm text-gray-500">Add dishes to your menu</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link href="/admin/orders" className="flex items-center justify-between p-5 bg-[#F8F8F8] rounded-xl hover:bg-gray-100 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#111111]/10 rounded-full flex items-center justify-center text-[#111111] group-hover:bg-[#111111] group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#111111]">Manage Orders</p>
                  <p className="text-sm text-gray-500">Track and update orders</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>

            <Link href="/menu" className="flex items-center justify-between p-5 bg-[#F8F8F8] rounded-xl hover:bg-gray-100 transition-all duration-300 group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-[#111111]">View Live Menu</p>
                  <p className="text-sm text-gray-500">See your customer-facing menu</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-[#D4AF37] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
