import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

function readEnvFile(path) {
  const env = {};
  const lines = readFileSync(path, "utf8").split(/\r?\n/);

  for (const line of lines) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const idx = line.indexOf("=");
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    env[key] = value;
  }

  return env;
}

const env = readEnvFile(".env");
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const seedRows = [
  {
    id: "seed-chair-artisan-lounge",
    name: "Artisan Lounge Chair",
    category: "Chairs",
    base_price: 4200,
    image: "/images/chair-artisan-lounge.png",
    description: "Hand-finished lounge chair with a sculpted profile.",
    dimensions: "74W x 82D x 88H cm",
  },
  {
    id: "seed-chair-modern-dining",
    name: "Modern Dining Chair",
    category: "Chairs",
    base_price: 3600,
    image: "/images/chair-modern-dining.png",
    description: "A refined dining chair designed for everyday comfort.",
    dimensions: "52W x 57D x 82H cm",
  },
  {
    id: "seed-chair-sage",
    name: "Sage Accent Chair",
    category: "Chairs",
    base_price: 3900,
    image: "/images/chair-sage.png",
    description: "Soft contours and plush upholstery in a calming tone.",
    dimensions: "70W x 78D x 86H cm",
  },
  {
    id: "seed-dining-chair",
    name: "Heritage Dining Chair",
    category: "Chairs",
    base_price: 3300,
    image: "/images/dining-chair.png",
    description: "Classic proportions with sturdy handcrafted detailing.",
    dimensions: "50W x 56D x 84H cm",
  },
  {
    id: "seed-ember-lounge",
    name: "Ember Lounge",
    category: "Chairs",
    base_price: 4500,
    image: "/images/ember-lounge.png",
    description: "A low, inviting lounge silhouette for relaxed spaces.",
    dimensions: "78W x 84D x 80H cm",
  },
  {
    id: "seed-white-stool",
    name: "White Counter Stool",
    category: "Chairs",
    base_price: 2400,
    image: "/images/white-stool.png",
    description: "Minimal counter-height stool with a clean modern form.",
    dimensions: "44W x 44D x 66H cm",
  },
  {
    id: "seed-console-table",
    name: "Console Table",
    category: "Tables",
    base_price: 6100,
    image: "/images/console-table.png",
    description: "Slim profile table suited for entryways and galleries.",
    dimensions: "140W x 38D x 80H cm",
  },
  {
    id: "seed-hero-table",
    name: "Hero Dining Table",
    category: "Tables",
    base_price: 9800,
    image: "/images/hero-table.png",
    description: "Statement dining table crafted for warm gatherings.",
    dimensions: "200W x 95D x 76H cm",
  },
  {
    id: "seed-pedestal-table",
    name: "Pedestal Table",
    category: "Tables",
    base_price: 7600,
    image: "/images/pedestal-table.png",
    description: "Balanced pedestal form with generous surface area.",
    dimensions: "120W x 120D x 74H cm",
  },
  {
    id: "seed-modern-sideboard",
    name: "Modern Sideboard",
    category: "Tables",
    base_price: 8400,
    image: "/images/modern-sideboard.png",
    description: "Versatile storage sideboard with minimalist lines.",
    dimensions: "180W x 45D x 78H cm",
  },
  {
    id: "seed-wooden-cabinet",
    name: "Wooden Cabinet",
    category: "Tables",
    base_price: 8900,
    image: "/images/wooden-cabinet.png",
    description: "Solid wood cabinet built for timeless interiors.",
    dimensions: "160W x 48D x 82H cm",
  },
  {
    id: "seed-hero-chair",
    name: "Hero Lounge Chair",
    category: "Chairs",
    base_price: 4300,
    image: "/images/hero-chair.png",
    description: "Hero-piece lounge chair with tailored upholstery.",
    dimensions: "76W x 82D x 88H cm",
  },
  {
    id: "seed-cloud-modular",
    name: "Cloud Modular",
    category: "Collections",
    base_price: 12400,
    image: "/images/cloud-modular.png",
    description: "Modular seating composition for flexible living rooms.",
    dimensions: "Variable configuration",
  },
  {
    id: "seed-craftsman-story",
    name: "Craftsman Editorial",
    category: "Collections",
    base_price: 1200,
    image: "/images/craftsman.png",
    description: "Editorial showcase highlighting artisan workshop process.",
    dimensions: "Gallery piece",
  },
  {
    id: "seed-portrait-art",
    name: "Portrait Art Piece",
    category: "Collections",
    base_price: 2100,
    image: "/images/portrait-art.png",
    description: "Curated framed portrait to complete living spaces.",
    dimensions: "90W x 4D x 120H cm",
  },
  {
    id: "seed-shelf-decor",
    name: "Shelf Decor Set",
    category: "Collections",
    base_price: 1400,
    image: "/images/shelf-decor.png",
    description: "Decorative shelf objects for layered styling.",
    dimensions: "Assorted set",
  },
  {
    id: "seed-wood-grain",
    name: "Wood Grain Collection",
    category: "Collections",
    base_price: 1700,
    image: "/images/wood-grain.png",
    description: "Material study panel celebrating natural wood textures.",
    dimensions: "120W x 3D x 80H cm",
  },
].map((row) => ({
  ...row,
  is_customizable: false,
}));

const seedIds = seedRows.map((row) => row.id);
const { data: existingRows, error: existingError } = await supabase
  .from("products")
  .select("id")
  .in("id", seedIds);

if (existingError) {
  throw new Error(`Unable to read existing products: ${existingError.message}`);
}

const existingIdSet = new Set((existingRows ?? []).map((row) => row.id));
const rowsToInsert = seedRows.filter((row) => !existingIdSet.has(row.id));

if (rowsToInsert.length === 0) {
  console.log("No inserts needed. Static catalog rows already exist.");
  process.exit(0);
}

const { error: insertError } = await supabase.from("products").insert(rowsToInsert);

if (insertError) {
  throw new Error(`Insert failed: ${insertError.message}`);
}

console.log(`Inserted ${rowsToInsert.length} static products into Supabase.`);
