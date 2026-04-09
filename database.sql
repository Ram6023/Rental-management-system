-- ============================================
-- RentEase — Supabase Schema (NO TRIGGER VERSION)
-- ============================================
-- Profiles are created from the client JS, not triggers.
-- This avoids all trigger-related errors.
-- ============================================

-- CLEAN UP
DROP TABLE IF EXISTS wishlist CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Remove old trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL DEFAULT 'User',
    phone TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'tenant' CHECK (role IN ('admin', 'owner', 'tenant')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. ADMIN HELPER
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. PROPERTIES
-- ============================================
CREATE TABLE properties (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    location TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    bhk INT NOT NULL,
    image_url TEXT DEFAULT '',
    phone TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read properties" ON properties FOR SELECT USING (true);
CREATE POLICY "Owners can insert" ON properties FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin'))
);
CREATE POLICY "Owners can update" ON properties FOR UPDATE USING (auth.uid() = owner_id OR is_admin());
CREATE POLICY "Owners can delete" ON properties FOR DELETE USING (auth.uid() = owner_id OR is_admin());

-- ============================================
-- 4. MESSAGES
-- ============================================
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id INT DEFAULT NULL REFERENCES properties(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Send" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Mark read" ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ============================================
-- 5. PAYMENTS
-- ============================================
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id INT DEFAULT NULL REFERENCES properties(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('paid', 'pending')),
    payment_date DATE DEFAULT NULL,
    receipt_number TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own or admin" ON payments FOR SELECT USING (auth.uid() = user_id OR is_admin());

-- ============================================
-- 6. WISHLIST
-- ============================================
CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, property_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own" ON wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Add own" ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Remove own" ON wishlist FOR DELETE USING (auth.uid() = user_id);

-- DONE!
