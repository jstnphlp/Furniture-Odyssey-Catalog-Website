import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('id, name, category, created_at');
  if (error) {
    console.error("Error fetching products:", error.message);
  } else {
    console.log("Products count:", data.length);
    console.log("Categories breakdown:");
    const cats = {};
    for (const p of data) {
      cats[p.category] = (cats[p.category] || 0) + 1;
    }
    console.log(cats);
    
    // Sort by created_at desc and show top 5 latest
    data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    console.log("Latest 5 products:");
    console.log(data.slice(0, 5));
  }
}

checkProducts();
