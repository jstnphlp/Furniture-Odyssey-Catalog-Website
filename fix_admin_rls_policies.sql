-- Run this in Supabase SQL Editor to allow admin dashboard writes from publishable key clients.
-- WARNING: These policies allow public mutations. Keep only for internal/admin-only setups.

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public update products" ON products;
CREATE POLICY "Public update products" ON products
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete products" ON products;
CREATE POLICY "Public delete products" ON products
  FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public insert table options" ON table_options;
CREATE POLICY "Public insert table options" ON table_options
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update table options" ON table_options;
CREATE POLICY "Public update table options" ON table_options
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public delete table options" ON table_options;
CREATE POLICY "Public delete table options" ON table_options
  FOR DELETE USING (true);
