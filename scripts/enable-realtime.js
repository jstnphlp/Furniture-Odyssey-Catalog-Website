import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
// Need service role key for ALTER PUBLICATION, but let's try via REST if it allows it.
// Actually, ALTER PUBLICATION requires postgres superuser or owner. We cannot do it via anon key.
