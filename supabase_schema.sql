-- Custom Types (Enums) mapping to your TypeScript types
CREATE TYPE product_category AS ENUM ('Chairs', 'Tables', 'Collections');
CREATE TYPE badge_tone AS ENUM ('teal', 'warm', 'dark');
CREATE TYPE option_group AS ENUM ('Top', 'Legs', 'Base');

-- 1. Products Table
-- Maps to your `Product` and base of `CustomizableTable` interfaces
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category product_category NOT NULL,
  base_price NUMERIC NOT NULL DEFAULT 0,
  -- image should be the FULL PUBLIC URL from Supabase Storage (e.g., https://<project>.supabase.co/storage/v1/object/public/...) 
  -- DO NOT use local paths (like '/images/chair.png') if you want it to work on all devices.
  image TEXT NOT NULL, 
  description TEXT,
  dimensions TEXT,
  badge TEXT,
  badge_tone badge_tone,
  is_customizable BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table Options Table
-- Maps to `TableOption` interface. Used to store 'Top', 'Legs', and 'Base' options for customizable tables.
CREATE TABLE table_options (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_group option_group NOT NULL,
  name TEXT NOT NULL,
  price_modifier NUMERIC NOT NULL DEFAULT 0,
  layer_url TEXT NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Option Incompatibilities Table
-- Maps to the `incompatibleWith: string[]` property in `TableOption`
-- This allows a many-to-many relationship for options that can't be used together
CREATE TABLE option_incompatibilities (
  option_id TEXT REFERENCES table_options(id) ON DELETE CASCADE,
  incompatible_with_id TEXT REFERENCES table_options(id) ON DELETE CASCADE,
  PRIMARY KEY (option_id, incompatible_with_id)
);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- Enabling RLS is a Supabase best practice to secure your data.

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE table_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE option_incompatibilities ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the catalog (Public access for SELECT)
CREATE POLICY "Public profiles are viewable by everyone." ON products 
  FOR SELECT USING (true);

CREATE POLICY "Public options are viewable by everyone." ON table_options 
  FOR SELECT USING (true);

CREATE POLICY "Public incompatibilities are viewable by everyone." ON option_incompatibilities 
  FOR SELECT USING (true);

-- (Later, when you add Supabase Auth, you can add policies like below for your admins)
-- CREATE POLICY "Admins can update products" ON products
--   FOR UPDATE USING (auth.role() = 'authenticated');
