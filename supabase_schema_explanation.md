# Supabase Database Schema Explanation

This document explains the database schema bridging your TypeScript application (`src/types/catalog.ts`) and your Supabase PostgreSQL database.

## Custom Enums

We use PostgreSQL `ENUM` types to enforce data integrity and exactly match your TypeScript Types:

- `product_category`: Restricts category to `'Chairs'`, `'Tables'`, or `'Collections'`.
- `badge_tone`: Restricts badges to `'teal'`, `'warm'`, or `'dark'`.
- `option_group`: Used exclusively for the configurator layers (`'Top'`, `'Legs'`, `'Base'`).

---

## 1. `products` Table

This is your primary table for the catalog. It handles both standard chairs/collections and customizable tables.

**Key Columns:**

- `id` (TEXT): Uses your existing text IDs (e.g., `'chair-001'`).
- `category` (product_category): Links to the enum.
- `base_price` (NUMERIC): The starting price of the product.
- `image` (TEXT): Holds the URL to the main preview image. (Point this to your Supabase Storage URL).
- `is_customizable` (BOOLEAN): A crucial flag indicating if this row requires looking up the `table_options` table.

---

## 2. `table_options` Table

Instead of storing complex nested JSON structures for `Top`, `Legs`, and `Base` layers representing the table options, this table uses a relational approach.

**Key Columns:**

- `id` (TEXT): Matches the option ID (e.g., `'top-oak'`).
- `product_id` (TEXT): A Foreign Key tying the option back to its parent table in the `products` table.
- `option_group` (option_group): Dictates whether this is a `'Top'`, `'Legs'`, or `'Base'` layer.
- `price_modifier` (NUMERIC): The additional cost (e.g., +$500 for Marble).
- `layer_url` (TEXT): Points to the transparent PNG layer stored in your Supabase 'configurator-layers' storage bucket.
- `available` (BOOLEAN): Can be toggled by the admin to hide out-of-stock variations.

---

## 3. `option_incompatibilities` Table

Some configurations don't fit together physically (e.g., the Central Pedestal can't support the heavy Marble top). Your frontend uses an `incompatibleWith: string[]` array.

In a relational database, this is best modeled as a **many-to-many join table**.

**How it works:**
If `'top-marble'` is incompatible with `'base-pedestal'`, a single row in this table unites those two IDs. Your frontend logic can fetch these relationships to gray out buttons when conflicting options are selected.

---

## Row Level Security (RLS)

The SQL file also includes public `SELECT` policies. By default, Row Level Security ensures nobody can view, edit, or delete your data unless explicitly allowed. The included policies allow anonymous internet users to fetch the catalog so they can browse the store.

When you integrate the admin dashboard with Supabase Auth later, you will add `UPDATE` and `INSERT` policies that only allow logged-in administrators to modify prices and catalog data.
