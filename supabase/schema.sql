-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table: Maps Supabase auth users to roles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('ADMIN', 'CUSTOMER')) NOT NULL,
  customer_mobile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Datasets table: Tracks uploaded files
CREATE TABLE IF NOT EXISTS datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  row_count INTEGER DEFAULT 0
);

-- Enable RLS on datasets
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- Datasets policies
CREATE POLICY "Admins can view all datasets"
  ON datasets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can insert datasets"
  ON datasets FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- Customer Products table: Main data table
CREATE TABLE IF NOT EXISTS customer_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_mobile TEXT NOT NULL,
  consent_flag BOOLEAN NOT NULL DEFAULT false,
  retailer_name TEXT,
  invoice_id TEXT,
  purchase_date DATE,
  product_category TEXT,
  product_name TEXT NOT NULL,
  brand TEXT,
  model_number TEXT,
  serial_number TEXT,
  warranty_start DATE,
  warranty_end DATE NOT NULL,
  warranty_type TEXT,
  amc_active BOOLEAN DEFAULT false,
  amc_end_date DATE,
  next_service_due DATE,
  city TEXT,
  pincode TEXT,
  dataset_id UUID REFERENCES datasets(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on customer_products
ALTER TABLE customer_products ENABLE ROW LEVEL SECURITY;

-- Customer Products policies
CREATE POLICY "Customers can view their own products"
  ON customer_products FOR SELECT
  USING (
    customer_mobile = (
      SELECT customer_mobile FROM profiles
      WHERE profiles.id = auth.uid()
    )
  );

CREATE POLICY "Admins can access all customer products"
  ON customer_products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can insert customer products"
  ON customer_products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customer_products_mobile ON customer_products(customer_mobile);
CREATE INDEX IF NOT EXISTS idx_customer_products_consent ON customer_products(consent_flag);
CREATE INDEX IF NOT EXISTS idx_customer_products_warranty_end ON customer_products(warranty_end);
CREATE INDEX IF NOT EXISTS idx_customer_products_amc_end ON customer_products(amc_end_date);
CREATE INDEX IF NOT EXISTS idx_customer_products_service_due ON customer_products(next_service_due);
CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON profiles(customer_mobile);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role)
  VALUES (NEW.id, 'CUSTOMER');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
