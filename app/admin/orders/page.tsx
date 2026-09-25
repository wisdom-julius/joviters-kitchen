'use client'

import { useState, useEffect } from 'react'
import { getAllOrders, updateOrderStatus, subscribeToOrders } from '@/lib/services/orderService'

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'on the way' | 'delivered'

interface Order {
  id: string
  customer_name: string
  customer_phone: string
  customer_address: string
  total_amount: number
  status: OrderStatus
  payment_method: string
  created_at: string
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All')

  const statusConfig: Record<OrderStatus, { bg: string; text: string; color: string }> = {
    pending: { bg: 'bg-gray-100', text: 'text-gray-800', color: 'text-gray-600' },
    preparing: { bg: 'bg-amber-100', text: 'text-amber-800', color: 'text-amber-600' },
    ready: { bg: 'bg-blue-100', text: 'text-blue-800', color: 'text-blue-600' },
    'on the way': { bg: 'bg-purple-100', text: 'text-purple-800', color: 'text-purple-600' },
    delivered: { bg: 'bg-green-100', text: 'text-green-800', color: 'text-green-600' }
  }

  const statusSequence: OrderStatus[] = ['pending', 'preparing', 'ready', 'on the way', 'delivered']

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const data = await getAllOrders()
      setOrders(data as Order[])
    } catch (error) {
      console.error('Failed to load orders:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
    const unsubscribe = subscribeToOrders(() => {
      loadOrders()
    })
    return unsubscribe
  }, [])

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus)
    await loadOrders()
  }

  const filteredOrders = filter === 'All'
    ? orders
    : orders.filter(order => order.status === filter)

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

  return (
    <div className="p-8 bg-[#F8F8F8] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <p className="text-[#D4AF37] text-sm tracking-[0.3em] uppercase mb-2 font-medium">ADMINISTRATION</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#111111]">Orders</h1>
          <p className="text-gray-500 mt-2">Manage and track all customer orders from your restaurant</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {(['All', ...statusSequence] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 border-2 ${
                filter === status
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-[#D4AF37] hover:text-[#D4AF37]'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <div className="w-6 h-6 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            <span className="tracking-wide">Loading orders...</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredOrders.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                No orders found
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-serif font-semibold text-[#111111] text-lg">#{order.id.slice(0, 8).toUpperCase()}</div>
                      <div className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</div>
                    </div>
                    <span className="font-bold font-serif text-xl text-[#D4AF37]">₦{Number(order.total_amount).toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-[#111111] font-medium">{order.customer_name}</div>
                  <div className="text-xs text-gray-400 mt-1">{order.customer_phone}</div>
                  <div className="text-xs text-gray-400 mt-1">{order.customer_address}</div>
                  <div className="text-xs text-gray-500 font-medium capitalize mt-2">Payment: {order.payment_method}</div>
                  <div className="flex items-center justify-between gap-3 mt-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className="text-sm border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-full px-4 py-2 focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 bg-white flex-1 max-w-[160px]"
                    >
                      {statusSequence.map((status) => (
                        <option key={status} value={status} className="text-gray-700">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#111111]">
                <tr>
                  <th className="text-left py-6 px-8 font-semibold text-white tracking-wide">Order ID</th>
                  <th className="text-left py-6 px-8 font-semibold text-white tracking-wide">Customer</th>
                  <th className="text-left py-6 px-8 font-semibold text-white tracking-wide">Total</th>
                  <th className="text-left py-6 px-8 font-semibold text-white tracking-wide">Payment</th>
                  <th className="text-center py-6 px-8 font-semibold text-white tracking-wide">Status & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F8F8F8] transition-colors duration-300">
                    <td className="py-6 px-8">
                      <div className="font-serif font-semibold text-[#111111] text-lg">#{order.id.slice(0, 8).toUpperCase()}</div>
                      <div className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="font-medium text-[#111111]">{order.customer_name}</div>
                      <div className="text-xs text-gray-400 mt-1">{order.customer_phone}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs mt-1">{order.customer_address}</div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="font-bold font-serif text-2xl text-[#D4AF37]">₦{Number(order.total_amount).toLocaleString()}</span>
                    </td>
                    <td className="py-6 px-8">
                      <span className="text-sm text-gray-500 font-medium capitalize">{order.payment_method}</span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex flex-col items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide ${statusConfig[order.status].bg} ${statusConfig[order.status].text}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                          className="text-sm border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-full px-4 py-2 focus:ring-0 focus:border-[#D4AF37] outline-none transition-all duration-300 bg-white w-full max-w-[160px]"
                        >
                          {statusSequence.map((status) => (
                            <option key={status} value={status} className="text-gray-700">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        No orders found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
