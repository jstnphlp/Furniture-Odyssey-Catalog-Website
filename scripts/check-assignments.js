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

async function checkAssignments() {
  const { data, error } = await supabase.from('product_tag_assignments').select('product_id, tag_id, tags(name)');
  if (error) {
    console.error("Error fetching assignments:", error.message);
  } else {
    console.log("Assignments:", JSON.stringify(data, null, 2));
  }
}

checkAssignments();
