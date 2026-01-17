-- Migration: Add data isolation for admins
-- This ensures each admin can only see their own uploaded datasets and products

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all datasets" ON datasets;
DROP POLICY IF EXISTS "Admins can access all customer products" ON customer_products;

-- Create new policies with data isolation
CREATE POLICY "Admins can view their own datasets"
  ON datasets FOR SELECT
  USING (
    uploaded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
  );

-- Admins can only access products from their own uploaded datasets
CREATE POLICY "Admins can access their own customer products"
  ON customer_products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND role = 'ADMIN'
    )
    AND EXISTS (
      SELECT 1 FROM datasets
      WHERE datasets.id = customer_products.dataset_id
      AND datasets.uploaded_by = auth.uid()
    )
  );
