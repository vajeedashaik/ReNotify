-- Service Centers table
CREATE TABLE IF NOT EXISTS service_centers (
  service_center_id TEXT PRIMARY KEY,
  service_center_name TEXT NOT NULL,
  service_center_type TEXT,
  parent_partner TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  supported_brands TEXT[],
  supported_categories TEXT[],
  warranty_supported BOOLEAN DEFAULT false,
  amc_supported BOOLEAN DEFAULT false,
  rating FLOAT,
  contact_number TEXT,
  opening_hours TEXT,
  latitude FLOAT,
  longitude FLOAT,
  last_verified_at DATE,
  active_status BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on service_centers
ALTER TABLE service_centers ENABLE ROW LEVEL SECURITY;

-- Service Centers policies - Public read, admin write
CREATE POLICY "Anyone can view active service centers"
  ON service_centers FOR SELECT
  USING (active_status = true);

CREATE POLICY "Admins can view all service centers"
  ON service_centers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can insert service centers"
  ON service_centers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update service centers"
  ON service_centers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can delete service centers"
  ON service_centers FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_centers_pincode ON service_centers(pincode);
CREATE INDEX IF NOT EXISTS idx_service_centers_city ON service_centers(city);
CREATE INDEX IF NOT EXISTS idx_service_centers_active_status ON service_centers(active_status);
CREATE INDEX IF NOT EXISTS idx_service_centers_rating ON service_centers(rating);
CREATE INDEX IF NOT EXISTS idx_service_centers_warranty_supported ON service_centers(warranty_supported);
CREATE INDEX IF NOT EXISTS idx_service_centers_amc_supported ON service_centers(amc_supported);
CREATE INDEX IF NOT EXISTS idx_service_centers_location ON service_centers(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
