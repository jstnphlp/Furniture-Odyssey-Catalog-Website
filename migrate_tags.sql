-- ═══════════════════════════════════════════════════════
-- Tag Filtering System Migration
-- Run this in the Supabase SQL Editor
-- ═══════════════════════════════════════════════════════

-- 1. Tags lookup table (global pool)
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Product ↔ Tag many-to-many join table
CREATE TABLE IF NOT EXISTS product_tag_assignments (
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 3. Row Level Security
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "Tags viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Tag assignments viewable by everyone" ON product_tag_assignments FOR SELECT USING (true);

-- Allow write (admin uses anon key + RLS; tighten later with auth)
CREATE POLICY "Tags manageable by everyone" ON tags FOR INSERT WITH CHECK (true);
CREATE POLICY "Tags deletable by everyone" ON tags FOR DELETE USING (true);
CREATE POLICY "Tag assignments manageable by everyone" ON product_tag_assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Tag assignments deletable by everyone" ON product_tag_assignments FOR DELETE USING (true);

-- 4. Seed default tags
INSERT INTO tags (id, name) VALUES
  ('tag-new-arrivals', 'New Arrivals'),
  ('tag-dining', 'Dining'),
  ('tag-lounge', 'Lounge'),
  ('tag-accent', 'Accent'),
  ('tag-coffee', 'Coffee'),
  ('tag-storage', 'Storage'),
  ('tag-modular', 'Modular'),
  ('tag-decor', 'Decor'),
  ('tag-art', 'Art'),
  ('tag-classic', 'Classic'),
  ('tag-modern', 'Modern'),
  ('tag-handcrafted', 'Handcrafted')
ON CONFLICT (id) DO NOTHING;

-- 5. Assign random tags to existing seed products
-- Chairs
INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-lounge')) AS t(tag_id)
WHERE p.id = 'seed-chair-artisan-lounge' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-dining'), ('tag-modern')) AS t(tag_id)
WHERE p.id = 'seed-chair-modern-dining' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-accent'), ('tag-new-arrivals')) AS t(tag_id)
WHERE p.id = 'seed-chair-sage' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-dining'), ('tag-classic')) AS t(tag_id)
WHERE p.id = 'seed-dining-chair' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-lounge'), ('tag-handcrafted')) AS t(tag_id)
WHERE p.id = 'seed-ember-lounge' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-modern'), ('tag-new-arrivals')) AS t(tag_id)
WHERE p.id = 'seed-white-stool' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

-- Tables
INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-storage'), ('tag-modern')) AS t(tag_id)
WHERE p.id = 'seed-console-table' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-dining'), ('tag-handcrafted')) AS t(tag_id)
WHERE p.id = 'seed-hero-table' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-dining'), ('tag-classic')) AS t(tag_id)
WHERE p.id = 'seed-pedestal-table' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-storage'), ('tag-new-arrivals')) AS t(tag_id)
WHERE p.id = 'seed-modern-sideboard' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-storage'), ('tag-handcrafted')) AS t(tag_id)
WHERE p.id = 'seed-wooden-cabinet' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-lounge'), ('tag-new-arrivals')) AS t(tag_id)
WHERE p.id = 'seed-hero-chair' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

-- Collections
INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-modular'), ('tag-modern')) AS t(tag_id)
WHERE p.id = 'seed-cloud-modular' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-art'), ('tag-handcrafted')) AS t(tag_id)
WHERE p.id = 'seed-craftsman-story' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-art'), ('tag-decor')) AS t(tag_id)
WHERE p.id = 'seed-portrait-art' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-decor'), ('tag-new-arrivals')) AS t(tag_id)
WHERE p.id = 'seed-shelf-decor' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;

INSERT INTO product_tag_assignments (product_id, tag_id)
SELECT p.id, t.tag_id FROM products p
CROSS JOIN (VALUES ('tag-decor'), ('tag-classic')) AS t(tag_id)
WHERE p.id = 'seed-wood-grain' AND EXISTS (SELECT 1 FROM tags WHERE id = t.tag_id)
ON CONFLICT DO NOTHING;
