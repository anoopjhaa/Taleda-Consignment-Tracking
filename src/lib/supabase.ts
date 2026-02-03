
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  // We don't throw error here to allow build to pass if env vars are missing, 
  // but runtime checks will fail.
  console.warn('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
