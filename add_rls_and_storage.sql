-- 1. Enable Inserts to Products Table 
-- This allows anyone to insert products.
-- Note: In a real production app, restrict this to authenticated admins!
CREATE POLICY "Allow public inserts" ON products
  FOR INSERT WITH CHECK (true);

-- 2. Create the Storage Bucket for Product Images
-- This creates a public bucket called 'product-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. (Skipped) Supabase already enables RLS on storage.objects.
-- We do not need to ALTER it.

-- 4. Allow public read access to the bucket
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- 5. Allow public inserts to the bucket
CREATE POLICY "Public Insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images');
