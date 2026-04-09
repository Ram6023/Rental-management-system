-- ============================================
-- RentEase — Supabase Auth + PostgreSQL Schema
-- ============================================
-- Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run

-- ============================================
-- 1. HELPER FUNCTION: Check if current user is admin
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- 2. PROFILES TABLE (linked to auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'tenant' CHECK (role IN ('admin', 'owner', 'tenant')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profiles"
    ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow insert for authenticated users"
    ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. AUTO-CREATE PROFILE ON SIGNUP (Trigger)
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, name, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 4. PROPERTIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
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

CREATE POLICY "Anyone can read properties"
    ON properties FOR SELECT USING (true);

CREATE POLICY "Owners can insert own properties"
    ON properties FOR INSERT WITH CHECK (
        auth.uid() = owner_id AND
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('owner', 'admin'))
    );

CREATE POLICY "Owners can update own properties"
    ON properties FOR UPDATE USING (
        auth.uid() = owner_id OR is_admin()
    );

CREATE POLICY "Owners can delete own properties"
    ON properties FOR DELETE USING (
        auth.uid() = owner_id OR is_admin()
    );

-- ============================================
-- 5. MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id INT DEFAULT NULL REFERENCES properties(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own messages"
    ON messages FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = receiver_id
    );

CREATE POLICY "Authenticated users can send messages"
    ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Receivers can mark as read"
    ON messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ============================================
-- 6. PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
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

CREATE POLICY "Users can read own payments or admin all"
    ON payments FOR SELECT USING (
        auth.uid() = user_id OR is_admin()
    );

-- ============================================
-- 7. WISHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, property_id)
);

ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own wishlist"
    ON wishlist FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own wishlist"
    ON wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from own wishlist"
    ON wishlist FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 8. SUPABASE STORAGE BUCKET FOR IMAGES
-- ============================================
-- Run this separately if storage isn't already set up:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

-- ============================================
-- NOTE: Sample data must be inserted AFTER you
-- create real users via Supabase Auth (sign up).
-- The profiles will auto-create via trigger.
-- ============================================
