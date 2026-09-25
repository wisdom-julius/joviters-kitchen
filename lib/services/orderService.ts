import { supabase, hasSupabaseClient } from '../supabase'
import { CartItem } from '@/types'

interface CreateOrderData {
  customerName: string
  customerPhone: string
  customerAddress: string
  totalAmount: number
  paymentMethod: string
  items: CartItem[]
  userId?: string
}

export async function createOrder(orderData: CreateOrderData) {
  try {
    // Check if Supabase is configured and available
    if (!hasSupabaseClient() || !supabase) {
      // Fallback: return a mock order id
      const mockId = Math.random().toString(36).substr(2, 9).toUpperCase()
      console.log('Using mock order creation (Supabase not configured)')
      return { orderId: mockId, success: true }
    }

    const supabaseAny = supabase as any;

    // Start a database transaction-like operation
    // 1. First create the order
    const { data: order, error: orderError } = await supabaseAny
      .from('orders')
      .insert({
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        customer_address: orderData.customerAddress,
        total_amount: orderData.totalAmount,
        payment_method: orderData.paymentMethod,
        status: 'pending',
        payment_status: 'pending',
        user_id: orderData.userId
      })
      .select()
      .single();

    if (orderError) throw orderError;

    if (!order) {
      throw new Error('Failed to create order');
    }

    // 2. Then create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      menu_item_id: item.item.id,
      quantity: item.quantity,
      price_at_purchase: item.item.price
    }));

    const { error: itemsError } = await supabaseAny
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { orderId: order.id, success: true };
  } catch (error) {
    console.error('Error creating order:', error);
    return { success: false, error };
  }
}

export async function getOrderById(id: string) {
  try {
    // Check if Supabase is configured and available
    if (!hasSupabaseClient() || !supabase) {
      // Fallback to mock data
      console.log('Using mock order data (Supabase not configured)')
      return null
    }

    const supabaseAny = supabase as any;

    // Get order
    const { data: order, error: orderError } = await supabaseAny
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) throw orderError;

    if (!order) return null;

    // Get order items
    const { data: orderItems, error: itemsError } = await supabaseAny
      .from('order_items')
      .select(`
        *,
        menu_item:menu_items(*)
      `)
      .eq('order_id', id);

    if (itemsError) throw itemsError;

    return {
      order,
      orderItems
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Get all orders (for admin)
export async function getAllOrders() {
  try {
    if (!hasSupabaseClient() || !supabase) {
      return []
    }

    const supabaseAny = supabase as any;

    const { data: orders, error } = await supabaseAny
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return orders || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Get orders for a specific user
export async function getUserOrders(userId: string) {
  try {
    if (!hasSupabaseClient() || !supabase) {
      return []
    }

    const supabaseAny = supabase as any;

    const { data: orders, error } = await supabaseAny
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return orders || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
}

// Update order status
export async function updateOrderStatus(id: string, status: string) {
  try {
    if (!hasSupabaseClient() || !supabase) {
      return false;
    }

    const supabaseAny = supabase as any;

    const { error } = await supabaseAny
      .from('orders')
      .update({ status })
      .eq('id', id);

    return !error;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

// Subscribe to real-time order updates
export function subscribeToOrders(callback: (payload: any) => void) {
  if (!hasSupabaseClient() || !supabase) {
    return () => {};
  }

  const supabaseAny = supabase as any;

  const channel = supabaseAny
    .channel('orders')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
      },
      callback
    )
    .subscribe();

  return () => {
    supabaseAny.removeChannel(channel);
  };
}
