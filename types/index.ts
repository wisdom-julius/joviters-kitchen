export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  ingredients: string[];
  preparationTime: number;
  isAvailable: boolean;
}

export type MenuCategory = 'swallow' | 'soup' | 'rice' | 'snacks' | 'drinks';

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  estimatedDeliveryTime: Date;
  deliveryLocation: {
    lat: number;
    lng: number;
  };
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'on the way' | 'delivered';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface DeliveryTracking {
  orderId: string;
  status: OrderStatus;
  currentLocation: {
    lat: number;
    lng: number;
  };
  estimatedTimeRemaining: number;
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  timestamp: Date;
  status: OrderStatus;
  message: string;
}


// ## 🚀 To Connect Your Supabase:
// 1. Create Supabase Project
// 2. Run Schema - copy database/schema.sql into Supabase SQL Editor and run
// 3. Create Storage Bucket - name "menu-images", set public
// 4. Add Storage Policies - follow instructions in database/schema.sql
// 5. Update Environment Variables - in .env.local , add your Supabase URL and anon key
// 6. Restart Dev Server - for changes to take effect
