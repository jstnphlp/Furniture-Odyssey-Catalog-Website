-- Seed default page content values
-- Run this in the Supabase SQL Editor after creating the page_content table

INSERT INTO page_content (id, page, section, field_key, field_value) VALUES
-- ═══ HOME PAGE ═══
('home-hero-eyebrow', 'home', 'hero', 'eyebrow', 'A New Way to Sit'),
('home-hero-title', 'home', 'hero', 'title', 'Sculpting'),
('home-hero-italic', 'home', 'hero', 'italic', 'Silence'),
('home-hero-description', 'home', 'hero', 'description', 'Discover the harmony between form and living craft. Every piece is designed to bring a sense of quiet permanence to your contemporary sanctuary.'),
('home-hero-btn1', 'home', 'hero', 'btn1_label', 'Explore the Collection'),
('home-hero-btn2', 'home', 'hero', 'btn2_label', 'Our Story'),
('home-hero-image1', 'home', 'hero', 'image1', '/images/wooden-cabinet.png'),
('home-hero-image2', 'home', 'hero', 'image2', '/images/chair-sage.png'),

('home-curators-eyebrow', 'home', 'curators_pick', 'eyebrow', 'a daily focus on modern, distinctive classics, handcrafted furniture and more.'),
('home-curators-title', 'home', 'curators_pick', 'title', 'The Digital Curator''s Pick'),

('home-materials-title', 'home', 'honest_materials', 'title', 'Honest Materials.'),
('home-materials-italic', 'home', 'honest_materials', 'italic', 'Eternal Design.'),
('home-materials-description', 'home', 'honest_materials', 'description', 'We believe furniture should tell a story worth repeating. In a world of disposable convenience, our "Honest Material" movement — where the wood grain is embraced and the visible construction provides testament to the artisan''s touch.'),
('home-materials-description2', 'home', 'honest_materials', 'description2', 'Every piece at Furniture Odyssey is crafted to ensure the finest for us, preserving all of nature''s warmth for your home''s next chapter.'),
('home-materials-btn', 'home', 'honest_materials', 'btn_label', 'Browse the Craftsmanship →'),
('home-materials-image', 'home', 'honest_materials', 'image', '/images/craftsman.png'),
('home-materials-quote', 'home', 'honest_materials', 'quote', 'Every grain tells a story of patient hands.'),

('home-story-eyebrow', 'home', 'featured_story', 'eyebrow', 'Featured Story'),
('home-story-title', 'home', 'featured_story', 'title', 'From Workshop'),
('home-story-italic', 'home', 'featured_story', 'italic', 'to Sanctuary'),
('home-story-description', 'home', 'featured_story', 'description', 'Follow the journey of a single slab of oak as it transforms from raw timber into a dining table designed to last for generations.'),
('home-story-btn', 'home', 'featured_story', 'btn_label', 'Read the Story →'),
('home-story-image', 'home', 'featured_story', 'image', '/images/modern-sideboard.png'),

-- ═══ CHAIRS PAGE ═══
('chairs-hero-eyebrow', 'chairs', 'hero', 'eyebrow', 'The Seat You Deserve'),
('chairs-hero-title', 'chairs', 'hero', 'title', 'Sculpted'),
('chairs-hero-italic', 'chairs', 'hero', 'italic', 'Comfort.'),
('chairs-hero-description', 'chairs', 'hero', 'description', 'Discover sculpted silhouettes, classic designs and tactile fabrics — from artisanal studios to your sanctuary. In a chair, every piece is a sanctuary of its own.'),

-- ═══ TABLES PAGE ═══
('tables-hero-eyebrow', 'tables', 'hero', 'eyebrow', 'The Custom Collection'),
('tables-hero-title', 'tables', 'hero', 'title', 'Gathering'),
('tables-hero-italic', 'tables', 'hero', 'italic', 'Redefined.'),
('tables-hero-description', 'tables', 'hero', 'description', 'Crafted from solid oak and steel married, our tables are built to be the heart of your home. Turn every deliberation to your sanctuary.'),
('tables-hero-btn', 'tables', 'hero', 'btn_label', 'Start Gathering'),
('tables-hero-image', 'tables', 'hero', 'image', '/images/wood-grain.png'),
('tables-hero-quote', 'tables', 'hero', 'quote', 'Every chair follows a table worth sitting around.'),
('tables-catalog-title', 'tables', 'catalog', 'title', 'Curated Catalog'),

-- ═══ COLLECTIONS PAGE ═══
('collections-hero-title', 'collections', 'hero', 'title', 'Curating Your'),
('collections-hero-italic', 'collections', 'hero', 'italic', 'Sanctuary'),
('collections-hero-description', 'collections', 'hero', 'description', 'Explore our latest ensemble of curated finished pieces, designed to bring quiet elegance and enduring warmth. A luxury curation of your home.'),
('collections-hero-btn', 'collections', 'hero', 'btn_label', 'View Catalog')

ON CONFLICT (id) DO NOTHING;