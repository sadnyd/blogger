import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkDb() {
  console.log("Checking profiles table...");
  const { data: profiles, error: profError } = await supabase.from('profiles').select('*');
  if (profError) {
    console.error("Error fetching profiles:", profError);
  } else {
    console.log(`Found ${profiles.length} profiles:`, profiles);
  }

  console.log("\nChecking posts table...");
  const { data: posts, error: postError } = await supabase.from('posts').select('*');
  if (postError) {
    console.error("Error fetching posts:", postError);
  } else {
    console.log(`Found ${posts.length} posts.`);
  }
}

checkDb().catch(console.error);
