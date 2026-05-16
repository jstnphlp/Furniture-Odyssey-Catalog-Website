SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict kCche4lvz4EhsQ5RG0fuoz7chJlA9bffErhvRQ8JH6DBBnfzc0ydtw5u7CD8SvQ

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "name", "category", "base_price", "image", "description", "dimensions", "badge", "badge_tone", "is_customizable", "created_at", "updated_at", "features", "colorways_count", "cta_label", "tags", "featured_on_collection", "is_homepage_featured") VALUES
	('monoblock-chair-1776399773268', 'Monoblock Chair', 'Chairs', 100, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/monoblock-chair-1776399773268.webp', 'upuan na blue', NULL, 'Gatherable', 'warm', false, '2026-04-17 04:22:54.4304+00', '2026-04-17 04:22:54.4304+00', '{plastic}', 1, NULL, '{}', false, false),
	('seed-chair-artisan-lounge', 'Artisan Lounge Chair', 'Chairs', 4200, '/images/chair-artisan-lounge.png', 'Hand-finished lounge chair with a sculpted profile.', '74W x 82D x 88H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', NULL, NULL, NULL, '{}', false, false),
	('seed-hero-table', 'Hero Dining Table', 'Tables', 9800, '/images/hero-table.png', 'Statement dining table crafted for warm gatherings.', '200W x 95D x 76H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', NULL, NULL, NULL, '{}', false, false),
	('seed-pedestal-table', 'Pedestal Table', 'Tables', 7600, '/images/pedestal-table.png', 'Balanced pedestal form with generous surface area.', '120W x 120D x 74H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', NULL, NULL, NULL, '{}', false, false),
	('seed-modern-sideboard', 'Modern Sideboard', 'Tables', 8400, '/images/modern-sideboard.png', 'Versatile storage sideboard with minimalist lines.', '180W x 45D x 78H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', NULL, NULL, NULL, '{}', false, false),
	('seed-wooden-cabinet', 'Wooden Cabinet', 'Tables', 8900, '/images/wooden-cabinet.png', 'Solid wood cabinet built for timeless interiors.', '160W x 48D x 82H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', NULL, NULL, NULL, '{}', false, false),
	('seed-cloud-modular', 'Cloud Modular', 'Collections', 12400, '/images/cloud-modular.png', 'Modular seating composition for flexible living rooms.', 'Variable configuration', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', NULL, NULL, NULL, '{}', false, false),
	('seed-shelf-decor', 'Shelf Decor Set', 'Collections', 1400, '/images/shelf-decor.png', 'Decorative shelf objects for layered styling.', 'Assorted set', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', NULL, NULL, NULL, '{}', false, false),
	('seed-wood-grain', 'Wood Grain Collection', 'Collections', 1700, '/images/wood-grain.png', 'Material study panel celebrating natural wood textures.', '120W x 3D x 80H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', NULL, NULL, NULL, '{}', false, false),
	('seed-console-table', 'Console Table', 'Tables', 6100, '/images/console-table.png', 'Slim profile table suited for entryways and galleries.', '140W x 38D x 80H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{}', NULL, NULL, '{}', false, false),
	('prod-1777343160081', 'Dining Table', 'Tables', 1000, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1777343159086-9hv4ro.webp', 'Wooden Dining Table', '100x100', NULL, NULL, false, '2026-04-28 02:26:09.54184+00', '2026-04-28 02:26:09.54184+00', NULL, NULL, NULL, '{}', false, false),
	('prod-1776403125142', 'isa pa', 'Collections', 100, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1776403124720-rmouxg.webp', '', '220W * 360H', NULL, NULL, false, '2026-04-17 05:18:45.287438+00', '2026-04-17 05:18:45.287438+00', '{}', NULL, NULL, '{}', false, false),
	('seed-dining-chair', 'Heritage Dining Chair', 'Chairs', 3300, '/images/dining-chair.png', 'Classic proportions with sturdy handcrafted detailing.', '50W x 56D x 84H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{}', NULL, NULL, '{}', false, false),
	('prod-1776403094607', 'White Table Set', 'Collections', 2000, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1776403093746-pi84ed.webp', 'maangas', '10x10', NULL, NULL, false, '2026-04-17 05:18:14.802376+00', '2026-04-17 05:18:14.802376+00', '{__homepage_featured__}', NULL, NULL, '{}', false, false),
	('seed-chair-modern-dining', 'Modern Dining Chair', 'Chairs', 3600, '/images/chair-modern-dining.png', 'A refined dining chair designed for everyday comfort.', '52W x 57D x 82H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{}', NULL, NULL, '{}', false, false),
	('prod-1776483544316', 'Testingpol', 'Chairs', 4500, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1776483543609-pygme5.svg', 'Testing', '23423', NULL, NULL, false, '2026-04-18 03:39:01.309682+00', '2026-04-18 03:39:01.309682+00', '{}', NULL, NULL, '{}', false, false),
	('seed-hero-chair', 'Hero Lounge Chair', 'Chairs', 4300, '/images/hero-chair.png', 'Hero-piece lounge chair with tailored upholstery.', '76W x 82D x 88H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{}', NULL, NULL, '{}', false, false),
	('seed-craftsman-story', 'Craftsman Editorial', 'Collections', 1200, '/images/craftsman.png', 'Editorial showcase highlighting artisan workshop process. With what now', 'Gallery piece', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{}', NULL, NULL, '{}', false, false),
	('seed-portrait-art', 'Portrait Art Piece', 'Collections', 2100, '/images/portrait-art.png', 'Curated framed portrait to complete living spaces. Yup', '90W x 4D x 120H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{}', NULL, NULL, '{}', false, false),
	('seed-white-stool', 'White Counter Stool', 'Chairs', 2400, '/images/white-stool.png', 'Minimal counter-height stool with a clean modern form.', '44W x 44D x 66H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{}', NULL, NULL, '{}', false, false),
	('seed-ember-lounge', 'Ember Lounge', 'Chairs', 4500, '/images/ember-lounge.png', 'A low, inviting lounge silhouette for relaxed spaces.', '78W x 84D x 80H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{__homepage_featured__}', NULL, NULL, '{}', false, false),
	('chair-005', 'Artisan Leather Lounge', 'Chairs', 3200, '/images/chair-artisan-lounge.png', 'Premium brown leather with visible stitching, solid walnut armrests. A masterpiece of mid-century luxuryssssss', '80W × 84D × 88H cm', NULL, NULL, false, '2026-04-18 08:50:04.801342+00', '2026-04-18 08:50:04.801342+00', '{}', NULL, NULL, '{}', false, false),
	('prod-1777343370586', 'Autumn Collection', 'Collections', 10000, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1777343370033-6ccu7.jpg', 'Inspired by autumn.', '120x120', NULL, NULL, false, '2026-04-28 02:29:39.980742+00', '2026-04-28 02:29:39.980742+00', NULL, NULL, NULL, '{}', false, false),
	('seed-chair-sage', 'Sage Accent Chair', 'Chairs', 3900, '/images/chair-sage.png', 'Soft contours and plush upholstery in a calming tone.', '70W x 78D x 86H cm', NULL, NULL, false, '2026-04-17 05:11:17.828848+00', '2026-04-17 05:11:17.828848+00', '{}', NULL, NULL, '{}', false, false),
	('prod-1777287925530', 'Testing 2', 'Chairs', 1999, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1777287922522-7ptf5l.svg', 'testing description', '1x1x1', NULL, NULL, false, '2026-04-27 11:05:25.687537+00', '2026-04-27 11:05:25.687537+00', NULL, NULL, NULL, '{}', false, false),
	('prod-1777287538386', 'Testing 1 change', 'Chairs', 1000, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1777287536091-9rhf45.svg', 'Testing Description change', '1x1x1', NULL, NULL, false, '2026-04-27 10:58:58.596371+00', '2026-04-27 10:58:58.596371+00', '{}', NULL, NULL, '{}', false, false),
	('chair-001', 'Heritage Grey Lounge Set', 'Chairs', 1049, '/images/hero-chair.png', 'A deep-settled lounge profile with hand-finished wood contours and soft, breathable upholstery designed for long evenings.', '78W × 82D × 85H cm', NULL, NULL, false, '2026-04-28 02:21:42.224133+00', '2026-04-28 02:21:42.224133+00', '{}', NULL, NULL, '{}', false, false),
	('table-003', 'The Gathering Island', 'Tables', 5200, '/images/console-table.png', 'Modular table system designed for hosting, conversation, and daily rituals. Configure with legs and finish.', '280W × 120D × 76H cm', NULL, NULL, true, '2026-05-06 11:39:00.779106+00', '2026-05-06 11:38:58.016+00', '{}', NULL, NULL, '{}', false, false),
	('prod-1778065921772', 'Modern Sofa', 'Chairs', 1000, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1778065920970-kviijv.jpg', 'This is a modern sofa crafted from the hands of someone great.', '200x200', NULL, NULL, false, '2026-05-06 11:12:04.297219+00', '2026-05-06 11:49:16.063+00', '{}', NULL, NULL, '{}', false, false),
	('prod-1778735974798', 'Sample', 'Collections', 0, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1778735974072-433see.png', '12343234321', '', NULL, NULL, false, '2026-05-14 05:19:35.419983+00', '2026-05-14 05:19:34.799+00', NULL, NULL, NULL, '{}', false, false),
	('prod-1778231890830', 'Sofa', 'Chairs', 12000, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/1778231889714-buqir.png', 'Gray Sofa', '100x100', NULL, NULL, false, '2026-05-08 09:18:12.148305+00', '2026-05-09 01:44:42.797+00', '{__homepage_featured__}', NULL, NULL, '{}', false, false);


--
-- Data for Name: table_options; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."table_options" ("id", "product_id", "option_group", "name", "price_modifier", "layer_url", "available", "created_at") VALUES
	('opt-1776489890859-ayrj8q', 'prod-1776483544316', 'Color', 'What', 0, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/var-1776489751490-lwy4e6.svg', true, '2026-04-18 05:24:54.626201+00'),
	('opt-1776489897713-acyazl', 'prod-1776483544316', 'Color', 'Green', 0, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/var-1776489890859-hdqu5.svg', true, '2026-04-18 05:24:54.626201+00'),
	('opt-1776489897713-lj1jdo', 'prod-1776483544316', 'Size', 'Large', 200, '', true, '2026-04-18 05:24:54.626201+00'),
	('opt-1776489897713-8c4lg', 'prod-1776483544316', 'Size', 'Small', 100, '', true, '2026-04-18 05:24:54.626201+00'),
	('opt-1777287929973-a5xzh', 'prod-1777287925530', 'Color', 'White', 0, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/var-1777287926271-c0jo2l.svg', true, '2026-04-27 11:05:30.11373+00'),
	('opt-1777288062669-48it7', 'prod-1777287538386', 'Color', 'Color 1', 200, '', true, '2026-04-27 11:07:42.813068+00'),
	('opt-1777288062669-a8khd', 'prod-1777287538386', 'Color', 'Color 2', 0, '', true, '2026-04-27 11:07:42.813068+00'),
	('opt-1777288062669-6c8pzm', 'prod-1777287538386', 'Size', 'Small', 0, '', true, '2026-04-27 11:07:42.813068+00'),
	('opt-1777288062669-o1gk7m', 'prod-1777287538386', 'Size', 'Large', 0, '', true, '2026-04-27 11:07:42.813068+00'),
	('opt-1777343162814-chj97', 'prod-1777343160081', 'Color', 'White', 100, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/var-1777343160764-k10ro8n.png', true, '2026-04-28 02:26:13.579985+00'),
	('opt-1777343164433-sjda0d', 'prod-1777343160081', 'Color', 'Black', 100, 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/var-1777343162814-xparw.png', true, '2026-04-28 02:26:13.579985+00'),
	('opt-1777343371205-ecdbg', 'prod-1777343370586', 'Size', '200x200', 1000, '', true, '2026-04-28 02:29:40.328333+00');


--
-- Data for Name: option_incompatibilities; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: page_content; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."page_content" ("id", "page", "section", "field_key", "field_value", "updated_at") VALUES
	('home-hero-eyebrow', 'home', 'hero', 'eyebrow', 'Furniture', '2026-05-08 09:11:00.267+00'),
	('home-materials-title', 'home', 'honest_materials', 'title', 'Honest Materials.', '2026-05-09 01:41:01.96+00'),
	('home-materials-italic', 'home', 'honest_materials', 'italic', 'Eternal Design', '2026-05-09 01:41:02.969+00'),
	('home-materials-description', 'home', 'honest_materials', 'description', 'We believe furniture should tell a story worth repeating. In a world of disposable convenience, our "Honest Material" movement — where the wood grain is embraced and the visible construction provides testament to the artisan''s touch.', '2026-05-09 01:41:04.618+00'),
	('home-curators-eyebrow', 'home', 'curators_pick', 'eyebrow', 'a daily focus on modern, distinctive classics, handcrafted furniture and more.', '2026-05-09 01:40:20.39+00'),
	('home-story-description', 'home', 'featured_story', 'description', 'Follow the journey of a single slab of oak as it transforms from raw timber into a dining table designed to last for generations.', '2026-05-09 01:42:36.245+00'),
	('home-story-btn', 'home', 'featured_story', 'btn_label', 'Read the Story → ', '2026-05-09 01:42:39.55+00'),
	('chairs-hero-eyebrow', 'chairs', 'hero', 'eyebrow', 'The Seat You Deserves', '2026-05-09 01:43:42.688+00'),
	('home-hero-title', 'home', 'hero', 'title', 'Furniture', '2026-05-09 01:37:15.825+00'),
	('tables-hero-image', 'tables', 'hero', 'image', 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/page-content-1777343089263-bnyvj6.png', '2026-04-28 02:24:51.541+00'),
	('home-materials-quote', 'home', 'honest_materials', 'quote', 'Every grain tells a story of patient hands. ', '2026-05-09 01:41:25.868+00'),
	('tables-catalog-title', 'tables', 'catalog', 'title', 'Curated Catalog', '2026-04-28 02:25:08.207+00'),
	('home-hero-italic', 'home', 'hero', 'italic', 'Odyssey', '2026-05-09 01:37:17.415+00'),
	('chairs-hero-title', 'chairs', 'hero', 'title', 'Sculpted', '2026-05-09 01:43:43.734+00'),
	('home-materials-btn', 'home', 'honest_materials', 'btn_label', 'Browse the Craftsmanship →', '2026-05-06 09:47:42.864+00'),
	('home-hero-image2', 'home', 'hero', 'image2', 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/page-content-1777286031906-42jgpq.png', '2026-04-27 10:33:53.306+00'),
	('tables-hero-eyebrow', 'tables', 'hero', 'eyebrow', 'The Custom Collections', '2026-05-06 09:48:10.618+00'),
	('tables-hero-title', 'tables', 'hero', 'title', 'Gatherings', '2026-05-06 09:48:12.041+00'),
	('tables-hero-italic', 'tables', 'hero', 'italic', 'Redefined.', '2026-05-06 09:48:13.496+00'),
	('tables-hero-description', 'tables', 'hero', 'description', 'Crafted from solid oak and steeadl married, our tables are built to be the heart of your home. Turn every deliberation to your sanctuary. ', '2026-05-06 09:48:17.173+00'),
	('home-materials-image', 'home', 'honest_materials', 'image', 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/page-content-1778060735354-yhpgvf.png', '2026-05-06 09:45:37.241+00'),
	('tables-hero-quote', 'tables', 'hero', 'quote', 'Every chair follows a table worth sitting around.', '2026-05-06 09:48:20.413+00'),
	('home-materials-description2', 'home', 'honest_materials', 'description2', 'Every piece at Furniture Odyssey is crafted to ensure the finest for us, preserving all of nature''s warmth for your home''s next chapter.', '2026-05-09 01:40:54.515+00'),
	('tables-hero-btn', 'tables', 'hero', 'btn_label', 'Start Gathering', '2026-05-06 09:48:24.036+00'),
	('collections-hero-title', 'collections', 'hero', 'title', 'Curating Yours', '2026-05-06 09:48:34.039+00'),
	('chairs-hero-italic', 'chairs', 'hero', 'italic', 'Comfort', '2026-05-09 01:43:44.658+00'),
	('home-story-image', 'home', 'featured_story', 'image', 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/page-content-1778060756073-hax4f.jpg', '2026-05-06 09:45:56.595+00'),
	('chairs-hero-description', 'chairs', 'hero', 'description', 'Discover sculpted silhouettes, classic designs and tactile fabricss — from artisanal studios to your sanctuary. In a chair, every piece is a sanctuary of its own.', '2026-05-09 01:43:59.123+00'),
	('home-story-eyebrow', 'home', 'featured_story', 'eyebrow', 'Featured Story', '2026-05-09 01:42:07.735+00'),
	('home-story-title', 'home', 'featured_story', 'title', 'From Workshop', '2026-05-09 01:42:09.374+00'),
	('home-story-italic', 'home', 'featured_story', 'italic', 'to Sanctuary', '2026-05-09 01:42:10.529+00'),
	('home-hero-description', 'home', 'hero', 'description', 'Discover the harmony between form and living craft. Every piece is designed to bring a sense of quiet permanence to your contemporary sanctuary. check.', '2026-05-10 18:35:24.103+00'),
	('home-curators-title', 'home', 'curators_pick', 'title', 'New Arrivals', '2026-05-10 19:40:44.787+00'),
	('collections-hero-italic', 'collections', 'hero', 'italic', 'Sanctuarys', '2026-05-06 09:48:35.239+00'),
	('collections-hero-description', 'collections', 'hero', 'description', 'Explore our latest aensemble of curated finished pieces, designed to bring quiet elegance and enduring warmth. A luxury curation of your home.', '2026-05-06 09:48:36.818+00'),
	('home-hero-btn2', 'home', 'hero', 'btn2_label', 'Our Story', '2026-05-09 01:38:01.4+00'),
	('collections-hero-btn', 'collections', 'hero', 'btn_label', 'View Catalog', '2026-05-06 09:48:39.874+00'),
	('home-hero-btn1', 'home', 'hero', 'btn1_label', 'Explore the Collection', '2026-05-09 01:38:02.617+00'),
	('home-hero-image1', 'home', 'hero', 'image1', 'https://dznbbbwqkgtrotfstagk.supabase.co/storage/v1/object/public/product-images/page-content-1778290786562-ukv2m8.jpg', '2026-05-09 01:39:47.631+00');


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."tags" ("id", "name", "created_at") VALUES
	('tag-new-arrivals', 'New Arrivals', '2026-05-06 11:10:20.345207+00'),
	('tag-dining', 'Dining', '2026-05-06 11:10:20.345207+00'),
	('tag-lounge', 'Lounge', '2026-05-06 11:10:20.345207+00'),
	('tag-accent', 'Accent', '2026-05-06 11:10:20.345207+00'),
	('tag-coffee', 'Coffee', '2026-05-06 11:10:20.345207+00'),
	('tag-storage', 'Storage', '2026-05-06 11:10:20.345207+00'),
	('tag-modular', 'Modular', '2026-05-06 11:10:20.345207+00'),
	('tag-decor', 'Decor', '2026-05-06 11:10:20.345207+00'),
	('tag-art', 'Art', '2026-05-06 11:10:20.345207+00'),
	('tag-classic', 'Classic', '2026-05-06 11:10:20.345207+00'),
	('tag-modern', 'Modern', '2026-05-06 11:10:20.345207+00'),
	('tag-handcrafted', 'Handcrafted', '2026-05-06 11:10:20.345207+00'),
	('tag-cafe-1778442203813', 'Cafe', '2026-05-10 19:43:23.962169+00'),
	('tag-sample-1778735923211', 'Sample', '2026-05-14 05:18:43.524218+00');


--
-- Data for Name: product_tag_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."product_tag_assignments" ("product_id", "tag_id") VALUES
	('seed-chair-artisan-lounge', 'tag-lounge'),
	('seed-chair-modern-dining', 'tag-dining'),
	('seed-chair-modern-dining', 'tag-modern'),
	('seed-chair-sage', 'tag-accent'),
	('seed-chair-sage', 'tag-new-arrivals'),
	('seed-dining-chair', 'tag-dining'),
	('seed-dining-chair', 'tag-classic'),
	('seed-ember-lounge', 'tag-lounge'),
	('seed-ember-lounge', 'tag-handcrafted'),
	('seed-white-stool', 'tag-modern'),
	('seed-white-stool', 'tag-new-arrivals'),
	('seed-console-table', 'tag-storage'),
	('seed-console-table', 'tag-modern'),
	('seed-hero-table', 'tag-dining'),
	('seed-hero-table', 'tag-handcrafted'),
	('seed-pedestal-table', 'tag-dining'),
	('seed-pedestal-table', 'tag-classic'),
	('seed-modern-sideboard', 'tag-storage'),
	('seed-modern-sideboard', 'tag-new-arrivals'),
	('seed-wooden-cabinet', 'tag-storage'),
	('seed-wooden-cabinet', 'tag-handcrafted'),
	('seed-hero-chair', 'tag-lounge'),
	('seed-hero-chair', 'tag-new-arrivals'),
	('seed-cloud-modular', 'tag-modular'),
	('seed-cloud-modular', 'tag-modern'),
	('seed-craftsman-story', 'tag-art'),
	('seed-craftsman-story', 'tag-handcrafted'),
	('seed-portrait-art', 'tag-art'),
	('seed-portrait-art', 'tag-decor'),
	('seed-shelf-decor', 'tag-decor'),
	('seed-shelf-decor', 'tag-new-arrivals'),
	('seed-wood-grain', 'tag-decor'),
	('seed-wood-grain', 'tag-classic'),
	('chair-001', 'tag-new-arrivals'),
	('prod-1778065921772', 'tag-new-arrivals'),
	('prod-1778065921772', 'tag-classic'),
	('prod-1778231890830', 'tag-lounge'),
	('prod-1778735974798', 'tag-sample-1778735923211');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('product-images', 'product-images', NULL, '2026-04-17 04:22:03.93994+00', '2026-04-17 04:22:03.93994+00', true, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('549828ee-8888-482b-9459-ea46807aebca', 'product-images', 'monoblock-chair-1776399773268.webp', NULL, '2026-04-17 04:22:54.094053+00', '2026-04-17 04:22:54.094053+00', '2026-04-17 04:22:54.094053+00', '{"eTag": "\"ca09ffb087494b9045827826cef5fe0f\"", "size": 49764, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-04-17T04:22:55.000Z", "contentLength": 49764, "httpStatusCode": 200}', '1de2639e-4ca5-41e7-96e0-39b469b8f688', NULL, '{}'),
	('c1620b71-12de-47b9-b960-f9cb113686f4', 'product-images', '1776402830499-q4zzt.webp', NULL, '2026-04-17 05:13:51.090629+00', '2026-04-17 05:13:51.090629+00', '2026-04-17 05:13:51.090629+00', '{"eTag": "\"8885470818b26b030f27823a81ce3afc\"", "size": 10194, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-04-17T05:13:52.000Z", "contentLength": 10194, "httpStatusCode": 200}', 'e9e7e3f2-166f-40d6-a545-4b436861df5d', NULL, '{}'),
	('3f816041-20c7-48ba-9c51-f06a672d4b60', 'product-images', '1776402917166-zviwjo.webp', NULL, '2026-04-17 05:15:17.710691+00', '2026-04-17 05:15:17.710691+00', '2026-04-17 05:15:17.710691+00', '{"eTag": "\"8885470818b26b030f27823a81ce3afc\"", "size": 10194, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-04-17T05:15:18.000Z", "contentLength": 10194, "httpStatusCode": 200}', '29d3b0c0-f8a4-4428-9d11-fa69561f6c54', NULL, '{}'),
	('e6bfd97d-5658-4630-bf2e-b91b672bc4a2', 'product-images', '1776403093746-pi84ed.webp', NULL, '2026-04-17 05:18:14.546002+00', '2026-04-17 05:18:14.546002+00', '2026-04-17 05:18:14.546002+00', '{"eTag": "\"8885470818b26b030f27823a81ce3afc\"", "size": 10194, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-04-17T05:18:15.000Z", "contentLength": 10194, "httpStatusCode": 200}', 'c1b2bdab-21c5-4b04-a632-85f6dee5d269', NULL, '{}'),
	('e54effee-627d-4f9e-98f5-bf6ef6755b9a', 'product-images', '1776403124720-rmouxg.webp', NULL, '2026-04-17 05:18:45.002088+00', '2026-04-17 05:18:45.002088+00', '2026-04-17 05:18:45.002088+00', '{"eTag": "\"8885470818b26b030f27823a81ce3afc\"", "size": 10194, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-04-17T05:18:45.000Z", "contentLength": 10194, "httpStatusCode": 200}', '988859e7-e125-45c1-8d46-afb4c052dbec', NULL, '{}'),
	('30c3d9f6-564e-4606-817c-ed2a86392c59', 'product-images', '1776483543609-pygme5.svg', NULL, '2026-04-18 03:39:00.968011+00', '2026-04-18 03:39:00.968011+00', '2026-04-18 03:39:00.968011+00', '{"eTag": "\"233bbb5fb9e6a1f981a4747ae630b72e\"", "size": 222555, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T03:39:01.000Z", "contentLength": 222555, "httpStatusCode": 200}', 'cfc6fb72-9e66-4381-bda6-7355559b39ea', NULL, '{}'),
	('afc7c9b2-697a-49fd-96bf-cb5a9d2e85b7', 'product-images', 'page-content-1776484199091-mbabz.svg', NULL, '2026-04-18 03:49:56.40647+00', '2026-04-18 03:49:56.40647+00', '2026-04-18 03:49:56.40647+00', '{"eTag": "\"1bd065437a3c4bfa6d1986e9de7638cf\"", "size": 222558, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T03:49:57.000Z", "contentLength": 222558, "httpStatusCode": 200}', '454ad1e7-b6ef-4713-bf51-b795a125c06c', NULL, '{}'),
	('acc09e85-12e7-4d0e-b9c3-7a663eded8ac', 'product-images', 'page-content-1776484213197-0h69we.svg', NULL, '2026-04-18 03:50:10.623022+00', '2026-04-18 03:50:10.623022+00', '2026-04-18 03:50:10.623022+00', '{"eTag": "\"233bbb5fb9e6a1f981a4747ae630b72e\"", "size": 222555, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T03:50:11.000Z", "contentLength": 222555, "httpStatusCode": 200}', 'f01629e1-f7fb-440e-b31d-d1ae285c8782', NULL, '{}'),
	('c338b841-b126-470d-8141-66ae7321a33f', 'product-images', 'page-content-1776484226351-m21lv8.svg', NULL, '2026-04-18 03:50:23.415687+00', '2026-04-18 03:50:23.415687+00', '2026-04-18 03:50:23.415687+00', '{"eTag": "\"233bbb5fb9e6a1f981a4747ae630b72e\"", "size": 222555, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T03:50:24.000Z", "contentLength": 222555, "httpStatusCode": 200}', '9f024bd7-d579-4b4b-87be-f42b4eb75460', NULL, '{}'),
	('60e295e4-c1c6-4bf3-8c16-10c440b2560e', 'product-images', 'var-1776489751490-lwy4e6.svg', NULL, '2026-04-18 05:22:30.172705+00', '2026-04-18 05:22:30.172705+00', '2026-04-18 05:22:30.172705+00', '{"eTag": "\"3f2a02d965c6682924eb78d0bf255c69\"", "size": 4729615, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T05:22:31.000Z", "contentLength": 4729615, "httpStatusCode": 200}', 'fe851f4a-ab16-4269-9d1d-0ac1d2e5cf83', NULL, '{}'),
	('23193eae-5eef-47e9-bfc6-80f838c5d386', 'product-images', 'var-1776489805969-m1jngr.svg', NULL, '2026-04-18 05:23:25.576823+00', '2026-04-18 05:23:25.576823+00', '2026-04-18 05:23:25.576823+00', '{"eTag": "\"d7897795331037ba6b664a1a6f04754b-2\"", "size": 5348610, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T05:23:26.000Z", "contentLength": 5348610, "httpStatusCode": 200}', '70454121-ca69-42dd-876c-2584eb24c97c', NULL, '{}'),
	('3f918de2-5bc8-4d04-93e4-d6b910f0107e', 'product-images', 'var-1776489890859-hdqu5.svg', NULL, '2026-04-18 05:24:54.41272+00', '2026-04-18 05:24:54.41272+00', '2026-04-18 05:24:54.41272+00', '{"eTag": "\"9c9222862fb85cdef24ef353078479f2-7\"", "size": 32466473, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T05:24:54.000Z", "contentLength": 32466473, "httpStatusCode": 200}', 'a5abb73d-c660-4d8d-8f5d-f99e62e4617a', NULL, '{}'),
	('10407dba-7c9b-45bc-bc6e-2ff24a506c83', 'product-images', 'page-content-1776497357477-nqxxkx.svg', NULL, '2026-04-18 07:29:15.114062+00', '2026-04-18 07:29:15.114062+00', '2026-04-18 07:29:15.114062+00', '{"eTag": "\"1bd065437a3c4bfa6d1986e9de7638cf\"", "size": 222558, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-18T07:29:16.000Z", "contentLength": 222558, "httpStatusCode": 200}', 'a8d8a6f8-ddb5-48d5-ac00-aa5b467d16ea', NULL, '{}'),
	('3e1ad2b7-fb76-42a0-9ed0-3907ce34a582', 'product-images', 'page-content-1777285783917-cleedj.svg', NULL, '2026-04-27 10:29:45.263989+00', '2026-04-27 10:29:45.263989+00', '2026-04-27 10:29:45.263989+00', '{"eTag": "\"3da1459d4e59700fdd04e9afc763a5ff\"", "size": 3816098, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-27T10:29:46.000Z", "contentLength": 3816098, "httpStatusCode": 200}', 'eecb8dee-3a5f-430d-aa6a-00ebb18484e6', NULL, '{}'),
	('9b7fdb53-d131-43c2-acea-4aff25b93468', 'product-images', 'page-content-1777285852376-m04xvg.webp', NULL, '2026-04-27 10:31:00.407504+00', '2026-04-27 10:31:00.407504+00', '2026-04-27 10:31:00.407504+00', '{"eTag": "\"ca09ffb087494b9045827826cef5fe0f\"", "size": 49764, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-04-27T10:31:01.000Z", "contentLength": 49764, "httpStatusCode": 200}', '85e59ae3-2abd-49ab-81ee-43a35294eabb', NULL, '{}'),
	('d510d84e-4fa9-4ba4-bc46-affda39b5a08', 'product-images', 'page-content-1777285872668-i8u394.png', NULL, '2026-04-27 10:31:20.794147+00', '2026-04-27 10:31:20.794147+00', '2026-04-27 10:31:20.794147+00', '{"eTag": "\"208eec428cc4ec5b5792e05f83e836aa\"", "size": 87491, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-27T10:31:21.000Z", "contentLength": 87491, "httpStatusCode": 200}', 'eede15c2-f4cf-4bb0-aa32-b65869e8ed2f', NULL, '{}'),
	('279a6e2d-d093-4c89-b66e-9116ea1ee315', 'product-images', 'page-content-1777285956836-yxslor.png', NULL, '2026-04-27 10:32:45.846706+00', '2026-04-27 10:32:45.846706+00', '2026-04-27 10:32:45.846706+00', '{"eTag": "\"4ccf8eb9f729e1171e0bbac4cac7f80f-2\"", "size": 6713654, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-27T10:32:46.000Z", "contentLength": 6713654, "httpStatusCode": 200}', 'cf35f760-853c-4ddc-a259-07a29ef68cf1', NULL, '{}'),
	('7a11eaae-31b9-45b7-9c7a-8f8cd1e36273', 'product-images', 'page-content-1777286031906-42jgpq.png', NULL, '2026-04-27 10:34:00.805692+00', '2026-04-27 10:34:00.805692+00', '2026-04-27 10:34:00.805692+00', '{"eTag": "\"9859a4afd0f13310cc67505035da6994-2\"", "size": 5904747, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-27T10:34:01.000Z", "contentLength": 5904747, "httpStatusCode": 200}', '799fd747-d7ce-454d-83cf-6571de12659a', NULL, '{}'),
	('e3f8c487-5628-43ef-bd5c-531fd1a79958', 'product-images', '1777287536091-9rhf45.svg', NULL, '2026-04-27 10:58:58.185266+00', '2026-04-27 10:58:58.185266+00', '2026-04-27 10:58:58.185266+00', '{"eTag": "\"3da1459d4e59700fdd04e9afc763a5ff\"", "size": 3816098, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-27T10:58:59.000Z", "contentLength": 3816098, "httpStatusCode": 200}', 'ed28c23d-6cbd-4d64-b976-95df49c03c55', NULL, '{}'),
	('cdc197e9-b350-4c26-87b0-2d7dc4652536', 'product-images', '1777287922522-7ptf5l.svg', NULL, '2026-04-27 11:05:25.459997+00', '2026-04-27 11:05:25.459997+00', '2026-04-27 11:05:25.459997+00', '{"eTag": "\"fd1a36d2000b2e9d3230ad60050e2638-2\"", "size": 5339795, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-27T11:05:26.000Z", "contentLength": 5339795, "httpStatusCode": 200}', 'ddab4cb4-23b9-4025-a875-5e4be3fccdc3', NULL, '{}'),
	('b61af3e6-b55a-47ee-a6e5-c02c2e4b4fb4', 'product-images', 'var-1777287926271-c0jo2l.svg', NULL, '2026-04-27 11:05:29.409157+00', '2026-04-27 11:05:29.409157+00', '2026-04-27 11:05:29.409157+00', '{"eTag": "\"4cf7cf8cbb7f9d61d94c8a2d794b9337-4\"", "size": 15942319, "mimetype": "image/svg+xml", "cacheControl": "max-age=3600", "lastModified": "2026-04-27T11:05:29.000Z", "contentLength": 15942319, "httpStatusCode": 200}', 'd8f4f816-6bd6-4a03-9573-eba55ffa1071', NULL, '{}'),
	('5b1c4909-02ef-4ae9-8ad3-c8dc4b443fbb', 'product-images', 'page-content-1777342713727-s1dzac.png', NULL, '2026-04-28 02:18:45.76266+00', '2026-04-28 02:18:45.76266+00', '2026-04-28 02:18:45.76266+00', '{"eTag": "\"4ccf8eb9f729e1171e0bbac4cac7f80f-2\"", "size": 6713654, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:18:46.000Z", "contentLength": 6713654, "httpStatusCode": 200}', '3ac2a12b-5e9a-48b3-beb0-4a61feefda3f', NULL, '{}'),
	('7089610f-7b53-4ed4-b369-ba7a39aa3375', 'product-images', 'page-content-1777342743625-98nbhm.png', NULL, '2026-04-28 02:19:13.164249+00', '2026-04-28 02:19:13.164249+00', '2026-04-28 02:19:13.164249+00', '{"eTag": "\"208eec428cc4ec5b5792e05f83e836aa\"", "size": 87491, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:19:14.000Z", "contentLength": 87491, "httpStatusCode": 200}', 'b489b851-068c-48ce-a394-b4ac1e125295', NULL, '{}'),
	('c3866268-f939-4b9e-9932-a5b55525699b', 'product-images', 'page-content-1777342856880-sz1z44.png', NULL, '2026-04-28 02:21:08.279919+00', '2026-04-28 02:21:08.279919+00', '2026-04-28 02:21:08.279919+00', '{"eTag": "\"4ccf8eb9f729e1171e0bbac4cac7f80f-2\"", "size": 6713654, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:21:08.000Z", "contentLength": 6713654, "httpStatusCode": 200}', 'fd479968-50ae-42ef-952b-56326aaed7a7', NULL, '{}'),
	('c0e78a23-1510-4c04-a0e8-77439813c469', 'product-images', '1777342949934-u9m5nu.png', NULL, '2026-04-28 02:22:40.194073+00', '2026-04-28 02:22:40.194073+00', '2026-04-28 02:22:40.194073+00', '{"eTag": "\"2ce8ca671280051630e50bcfd09ada9b\"", "size": 1840583, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:22:41.000Z", "contentLength": 1840583, "httpStatusCode": 200}', 'efe1134e-9563-4955-a490-2e6a2fb3e3dd', NULL, '{}'),
	('efb308cc-0cee-4c1e-aa32-552d240f126e', 'product-images', 'var-1777343160764-k10ro8n.png', NULL, '2026-04-28 02:26:11.766014+00', '2026-04-28 02:26:11.766014+00', '2026-04-28 02:26:11.766014+00', '{"eTag": "\"4ccf8eb9f729e1171e0bbac4cac7f80f-2\"", "size": 6713654, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:26:12.000Z", "contentLength": 6713654, "httpStatusCode": 200}', 'f3e40aab-00e5-44b0-80e1-cb5bea655798', NULL, '{}'),
	('ec86d205-6dd6-4090-a414-082ad2ada346', 'product-images', 'var-1777343162814-xparw.png', NULL, '2026-04-28 02:26:13.390773+00', '2026-04-28 02:26:13.390773+00', '2026-04-28 02:26:13.390773+00', '{"eTag": "\"9859a4afd0f13310cc67505035da6994-2\"", "size": 5904747, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:26:14.000Z", "contentLength": 5904747, "httpStatusCode": 200}', 'c51729f9-69a3-472f-bb1d-ee19feb7d9a8', NULL, '{}'),
	('e4806815-4b1f-4ca5-a785-8e3b187d7c48', 'product-images', 'page-content-1777343089263-bnyvj6.png', NULL, '2026-04-28 02:25:00.301485+00', '2026-04-28 02:25:00.301485+00', '2026-04-28 02:25:00.301485+00', '{"eTag": "\"4ccf8eb9f729e1171e0bbac4cac7f80f-2\"", "size": 6713654, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:25:01.000Z", "contentLength": 6713654, "httpStatusCode": 200}', '7be16a8b-483b-4f90-b0ee-7cd9b5cbdb91', NULL, '{}'),
	('9357e01b-42a6-4f71-bd5d-fe2064367421', 'product-images', '1777343159086-9hv4ro.webp', NULL, '2026-04-28 02:26:09.014489+00', '2026-04-28 02:26:09.014489+00', '2026-04-28 02:26:09.014489+00', '{"eTag": "\"7e7130c3096e9fe3b0c2c461e455e651\"", "size": 14356, "mimetype": "image/webp", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:26:09.000Z", "contentLength": 14356, "httpStatusCode": 200}', '1ec2b409-287e-4380-beab-12be9403cbed', NULL, '{}'),
	('5e4b9230-60e4-41c2-8e8e-37d5a1e5dca3', 'product-images', '1777343370033-6ccu7.jpg', NULL, '2026-04-28 02:29:39.535231+00', '2026-04-28 02:29:39.535231+00', '2026-04-28 02:29:39.535231+00', '{"eTag": "\"47375db0790a729360ba81554fc9f136\"", "size": 8898, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-04-28T02:29:40.000Z", "contentLength": 8898, "httpStatusCode": 200}', '7f8b7db6-bf9f-4644-8bbd-2a2acb1d4510', NULL, '{}'),
	('d4a45914-8629-43e0-8a82-8f5db0b668b6', 'product-images', 'page-content-1778060735354-yhpgvf.png', NULL, '2026-05-06 09:45:39.154417+00', '2026-05-06 09:45:39.154417+00', '2026-05-06 09:45:39.154417+00', '{"eTag": "\"4ccf8eb9f729e1171e0bbac4cac7f80f-2\"", "size": 6713654, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-06T09:45:39.000Z", "contentLength": 6713654, "httpStatusCode": 200}', 'e2e00db9-453f-457a-915b-8345dd51dec7', NULL, '{}'),
	('1a999756-a519-4303-adc8-4240de83b698', 'product-images', 'page-content-1778060756073-hax4f.jpg', NULL, '2026-05-06 09:45:58.509055+00', '2026-05-06 09:45:58.509055+00', '2026-05-06 09:45:58.509055+00', '{"eTag": "\"abfabf0ecdd49206c406ce303068fc4c\"", "size": 67529, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-06T09:45:59.000Z", "contentLength": 67529, "httpStatusCode": 200}', '3e12a005-3c08-4bc6-b54a-05b07def637f', NULL, '{}'),
	('0ca8ce66-ebdc-44fd-abf1-e69cbd661045', 'product-images', '1778065920970-kviijv.jpg', NULL, '2026-05-06 11:12:03.723309+00', '2026-05-06 11:12:03.723309+00', '2026-05-06 11:12:03.723309+00', '{"eTag": "\"abfabf0ecdd49206c406ce303068fc4c\"", "size": 67529, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-06T11:12:04.000Z", "contentLength": 67529, "httpStatusCode": 200}', 'c96858bb-2877-45c0-ba96-26d2de357298', NULL, '{}'),
	('0872af85-2031-44c6-8912-27361f01abd2', 'product-images', 'page-content-1778231497839-cl1k.jpg', NULL, '2026-05-08 09:11:39.500015+00', '2026-05-08 09:11:39.500015+00', '2026-05-08 09:11:39.500015+00', '{"eTag": "\"bdcde1c63c93de418fd98d82e41a47bb\"", "size": 42579, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-08T09:11:40.000Z", "contentLength": 42579, "httpStatusCode": 200}', '85055520-73a9-46a7-a818-f75e5b5d9e2c', NULL, '{}'),
	('bcbd0a90-2f03-4c37-b4f1-3ca113241337', 'product-images', '1778231889714-buqir.png', NULL, '2026-05-08 09:18:11.471807+00', '2026-05-08 09:18:11.471807+00', '2026-05-08 09:18:11.471807+00', '{"eTag": "\"b7ff966533e04aa580c2d5a42e57429c\"", "size": 41270, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-08T09:18:12.000Z", "contentLength": 41270, "httpStatusCode": 200}', '34be9df7-0e7c-4942-82df-aa360540c763', NULL, '{}'),
	('ea55961e-3c58-4332-bf2f-0f2d0e42ca59', 'product-images', 'page-content-1778290786562-ukv2m8.jpg', NULL, '2026-05-09 01:39:47.599436+00', '2026-05-09 01:39:47.599436+00', '2026-05-09 01:39:47.599436+00', '{"eTag": "\"2fcc458873f02039cdaaf1065f5ccaad\"", "size": 56643, "mimetype": "image/jpeg", "cacheControl": "max-age=3600", "lastModified": "2026-05-09T01:39:48.000Z", "contentLength": 56643, "httpStatusCode": 200}', '1b8c4fa7-861f-4db4-a124-25eba69c35a3', NULL, '{}'),
	('8b15e13b-7797-49af-89ba-c2c471102c2a', 'product-images', '1778735974072-433see.png', NULL, '2026-05-14 05:19:34.800415+00', '2026-05-14 05:19:34.800415+00', '2026-05-14 05:19:34.800415+00', '{"eTag": "\"81b35191e5d74b5bf47bbef9efeceafd\"", "size": 226019, "mimetype": "image/png", "cacheControl": "max-age=3600", "lastModified": "2026-05-14T05:19:35.000Z", "contentLength": 226019, "httpStatusCode": 200}', '37322aa3-f896-490a-a976-857a327f38e9', NULL, '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict kCche4lvz4EhsQ5RG0fuoz7chJlA9bffErhvRQ8JH6DBBnfzc0ydtw5u7CD8SvQ

RESET ALL;
