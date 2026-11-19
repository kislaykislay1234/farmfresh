-- Row Level Security (RLS) Policies for FarmFresh

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cold_storages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE freshness_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can read basic public profiles, users can update their own
CREATE POLICY "Public profiles are readable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Products: Everyone can read available products; farmers can insert/update their own
CREATE POLICY "Products readable by all" ON products FOR SELECT USING (true);
CREATE POLICY "Farmers can insert products" ON products FOR INSERT WITH CHECK (auth.uid() = farmer_id);
CREATE POLICY "Farmers can update own products" ON products FOR UPDATE USING (auth.uid() = farmer_id);

-- Orders: Visible to participants (buyer, farmer, transporter, cold_storage, admin)
CREATE POLICY "Orders visible to participants" ON orders FOR SELECT USING (
  auth.uid() = buyer_id OR 
  auth.uid() = farmer_id OR 
  auth.uid() = transporter_id OR 
  auth.uid() = cold_storage_id
);
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Participants can update order status" ON orders FOR UPDATE USING (
  auth.uid() = buyer_id OR auth.uid() = farmer_id OR auth.uid() = transporter_id
);

-- Cold storages and Vehicles readable by all
CREATE POLICY "Cold storages readable by all" ON cold_storages FOR SELECT USING (true);
CREATE POLICY "Vehicles readable by all" ON vehicles FOR SELECT USING (true);

-- Government schemes public read-only
CREATE POLICY "Schemes readable by all" ON government_schemes FOR SELECT USING (true);
