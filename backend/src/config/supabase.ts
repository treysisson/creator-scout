import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and service key are required.');
}

export const supabase = createClient(supabaseUrl, supabaseKey); 