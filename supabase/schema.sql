-- =========================================================
-- FarmFresh Platform Database Schema (PostgreSQL / Supabase)
-- Master v3 Consolidated Spec
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'buyer', 'transporter', 'cold_storage', 'admin')),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  state TEXT DEFAULT 'Gujarat',
  district TEXT DEFAULT 'Anand',
  city_village TEXT,
  pincode TEXT,
  date_of_birth DATE,
  preferred_language VARCHAR(10) DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'gu')),
  is_verified BOOLEAN DEFAULT false,
  rating NUMERIC(3,2) DEFAULT 4.8,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Farmer Specific Details
CREATE TABLE IF NOT EXISTS farmer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  farm_size_acres NUMERIC(6,2),
  primary_crops TEXT[],
  soil_type TEXT,
  irrigation_source TEXT,
  kisan_credit_card BOOLEAN DEFAULT false,
  soil_health_card_number TEXT,
  upi_id TEXT,
  bank_account_verified BOOLEAN DEFAULT true
);

-- 3. Products / Produce Listings
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Organic')),
  variety TEXT,
  grade VARCHAR(10) DEFAULT 'A' CHECK (grade IN ('A+', 'A', 'B', 'C')),
  quantity_kg NUMERIC(10,2) NOT NULL,
  available_kg NUMERIC(10,2) NOT NULL,
  price_per_kg NUMERIC(8,2) NOT NULL,
  harvest_date DATE NOT NULL,
  shelf_life_days INT DEFAULT 7,
  freshness_score INT DEFAULT 95 CHECK (freshness_score BETWEEN 0 AND 100),
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT NOT NULL,
  is_organic BOOLEAN DEFAULT false,
  certifications TEXT[],
  image_url TEXT,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Live Auctions & Bids
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  farmer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  starting_price_per_kg NUMERIC(8,2) NOT NULL,
  current_highest_bid NUMERIC(8,2),
  highest_bidder_id UUID REFERENCES profiles(id),
  min_quantity_kg NUMERIC(10,2) NOT NULL,
  total_quantity_kg NUMERIC(10,2) NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bid_amount_per_kg NUMERIC(8,2) NOT NULL,
  quantity_kg NUMERIC(10,2) NOT NULL,
  placed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Orders & Escrow
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  buyer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  farmer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  transporter_id UUID REFERENCES profiles(id),
  cold_storage_id UUID REFERENCES profiles(id),
  quantity_kg NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(12,2) NOT NULL,
  farmer_payout NUMERIC(12,2) NOT NULL,
  platform_fee NUMERIC(10,2) DEFAULT 0,
  transport_fee NUMERIC(10,2) DEFAULT 0,
  delivery_address TEXT NOT NULL,
  delivery_district TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  delivery_pincode TEXT NOT NULL,
  payment_method TEXT DEFAULT 'upi',
  payment_status VARCHAR(20) DEFAULT 'escrow_hold' CHECK (payment_status IN ('pending', 'escrow_hold', 'released', 'refunded', 'failed')),
  order_status VARCHAR(30) DEFAULT 'order_placed' CHECK (order_status IN ('order_placed', 'confirmed', 'harvesting', 'packed', 'in_transit', 'delivered', 'cancelled')),
  tracking_id TEXT,
  estimated_delivery TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Cold Storage Facilities & Bookings
CREATE TABLE IF NOT EXISTS cold_storages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  facility_name TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  total_capacity_mt NUMERIC(10,2) NOT NULL,
  available_capacity_mt NUMERIC(10,2) NOT NULL,
  temperature_range TEXT NOT NULL,
  rate_per_quintal_per_month NUMERIC(8,2) NOT NULL,
  fssai_approved BOOLEAN DEFAULT true,
  solar_powered BOOLEAN DEFAULT false,
  amenities TEXT[],
  phone TEXT NOT NULL,
  lat NUMERIC(9,6),
  lng NUMERIC(9,6),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS storage_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  storage_id UUID REFERENCES cold_storages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  quantity_quintals NUMERIC(10,2) NOT NULL,
  duration_months INT NOT NULL,
  total_cost NUMERIC(10,2) NOT NULL,
  payment_status VARCHAR(20) DEFAULT 'completed',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6b. Government Schemes Catalog
CREATE TABLE IF NOT EXISTS government_schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT UNIQUE NOT NULL,
  acronym TEXT,
  ministry TEXT NOT NULL,
  subsidy_benefit TEXT NOT NULL,
  category TEXT NOT NULL,
  eligibility_criteria TEXT NOT NULL,
  official_portal_url TEXT NOT NULL,
  helpline_number TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Transport Vehicles & Deliveries
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  vehicle_number TEXT UNIQUE NOT NULL,
  vehicle_type TEXT NOT NULL,
  capacity_kg NUMERIC(10,2) NOT NULL,
  is_refrigerated BOOLEAN DEFAULT false,
  base_rate_per_km NUMERIC(6,2) NOT NULL,
  operating_routes TEXT[],
  current_location TEXT,
  is_available BOOLEAN DEFAULT true,
  driver_name TEXT,
  driver_phone TEXT,
  rating NUMERIC(3,2) DEFAULT 4.9,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS deliveries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  transporter_id UUID REFERENCES profiles(id),
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  distance_km NUMERIC(8,2) NOT NULL,
  freight_charge NUMERIC(10,2) NOT NULL,
  current_lat NUMERIC(9,6),
  current_lng NUMERIC(9,6),
  status VARCHAR(30) DEFAULT 'assigned' CHECK (status IN ('assigned', 'picked_up', 'in_transit', 'near_destination', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Payments Abstraction Log
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  related_type VARCHAR(30) NOT NULL CHECK (related_type IN ('order', 'auction', 'cold_storage', 'transport')),
  related_id UUID,
  amount NUMERIC(12,2) NOT NULL,
  payment_gateway TEXT DEFAULT 'Razorpay_Demo',
  payment_mode VARCHAR(20) DEFAULT 'upi',
  status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('initiated', 'processing', 'success', 'failed', 'cancelled')),
  gateway_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Notifications Center
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(30) DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('order', 'payment', 'delivery', 'cold_storage', 'product_quality', 'other')),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Demand Data Intelligence Table
CREATE TABLE IF NOT EXISTS demand_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_name TEXT NOT NULL,
  location TEXT NOT NULL,
  demand_score INT NOT NULL CHECK (demand_score BETWEEN 0 AND 100),
  trend TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Crop Diversification & Suggestions Table
CREATE TABLE IF NOT EXISTS crop_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_name TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'underused',
  rough_climate_note TEXT NOT NULL,
  avg_days_to_harvest INT NOT NULL,
  demand_level VARCHAR(20) DEFAULT 'high',
  region_tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert into demand_data (matches existing schema: product_name, location, demand_score, trend, date)
INSERT INTO demand_data (product_name, location, demand_score, trend, date)
VALUES
  ('Mushroom (Button)', 'National', 88, '+12.2%', CURRENT_DATE),
  ('Mushroom (Button)', 'Uttar Pradesh', 90, '+13.1%', CURRENT_DATE),
  ('Mushroom (Button)', 'Bihar', 92, '+15.4%', CURRENT_DATE),
  ('Mushroom (Button)', 'Odisha', 87, '+11.8%', CURRENT_DATE),
  ('Mushroom (Button)', 'Maharashtra', 85, '+10.9%', CURRENT_DATE),
  ('Mushroom (Button)', 'Uttarakhand', 84, '+10.2%', CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Insert into crop_suggestions (matches existing schema: crop_name, category, rough_climate_note, avg_days_to_harvest, demand_level, region_tag)
INSERT INTO crop_suggestions (crop_name, category, rough_climate_note, avg_days_to_harvest, demand_level, region_tag)
VALUES
  (
    'Button Mushroom',
    'underused',
    'Cool, shaded, humidity-controlled space (indoor cultivation, no large land needed); ideal 18-22°C',
    30,
    'high',
    'Uttar Pradesh, Bihar, Odisha, Maharashtra, Uttarakhand'
  )
ON CONFLICT DO NOTHING;
