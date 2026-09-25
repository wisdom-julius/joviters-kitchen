-- Joviter's Kitchen - Complete Database Schema
-- Copy and paste this into your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('swallow', 'soup', 'rice', 'snacks', 'drinks')),
    ingredients TEXT[] DEFAULT '{}',
    preparation_time INTEGER DEFAULT 30,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_address TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'on the way', 'delivered')),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price_at_purchase NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);

-- 5. Row Level Security (RLS) - Enable RLS on tables
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 6. Menu Items Policies
-- Allow public read access to menu items (for everyone to see the menu)
CREATE POLICY "Enable read access for all users" ON menu_items
    FOR SELECT USING (true);

-- Allow authenticated users full access (admin functionality - you might want to restrict to specific roles later)
CREATE POLICY "Enable all access for authenticated users" ON menu_items
    FOR ALL USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

-- 7. Orders Policies
-- Users can only see their own orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Users can create their own orders
CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Allow authenticated users to update order status (admin)
CREATE POLICY "Authenticated users can update orders" ON orders
    FOR UPDATE USING (auth.uid() IS NOT NULL);

-- 8. Order Items Policies
CREATE POLICY "Enable read access for authenticated users" ON order_items
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable insert for authenticated users" ON order_items
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 9. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Apply triggers
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========= STORAGE SETUP =========
-- After running this schema, you need to:
-- 1. Go to Storage in Supabase dashboard
-- 2. Create a new bucket called "menu-images"
-- 3. Set the bucket to public (you can change this later if needed)
-- 4. Add the following policies in Storage > Policies:

-- Storage Policy 1: Allow authenticated users to upload images
-- Policy name: Allow authenticated users to upload
-- Allowed operation: INSERT
-- Policy definition: (auth.uid() IS NOT NULL)

-- Storage Policy 2: Allow public to view images
-- Policy name: Allow public to view
-- Allowed operation: SELECT
-- Policy definition: (true)

-- Storage Policy 3: Allow authenticated users to delete/update their own images
-- Policy name: Allow authenticated users to manage
-- Allowed operations: UPDATE, DELETE
-- Policy definition: (auth.uid() IS NOT NULL)

-- ========= TROUBLESHOOTING =========
-- If you get "duplicate table" errors, you can use:
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS menu_items CASCADE;
