import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// We need an authenticated user to perform RLS operations like insert/update.
// Let's assume we use the first user in the system, or we can just try to fetch public posts heavily.
// To truly stress test insertions, we would need to sign in first.
// Since we don't have the user's password in the script, we will heavily stress test the public 'SELECT' endpoint.
// If the user wants to test inserts, they should provide credentials or temporarily disable RLS.

const CONCURRENT_REQUESTS = 100;
const TOTAL_ITERATIONS = 5;

async function runStressTest() {
  console.log(`Starting stress test against ${supabaseUrl}...`);
  console.log(`Will perform ${TOTAL_ITERATIONS} iterations of ${CONCURRENT_REQUESTS} concurrent fetches.`);

  let totalFailures = 0;
  let totalSuccesses = 0;

  for (let i = 0; i < TOTAL_ITERATIONS; i++) {
    console.log(`\n--- Iteration ${i + 1} ---`);
    const promises = [];
    const startTime = Date.now();

    for (let j = 0; j < CONCURRENT_REQUESTS; j++) {
      promises.push(
        supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .then(({ data, error }) => {
            if (error) throw error;
            return data;
          })
      );
    }

    const results = await Promise.allSettled(promises);

    const failures = results.filter((r) => r.status === 'rejected');
    const successes = results.filter((r) => r.status === 'fulfilled');

    totalFailures += failures.length;
    totalSuccesses += successes.length;

    console.log(`Iteration ${i + 1} completed in ${Date.now() - startTime}ms`);
    console.log(`Successes: ${successes.length}, Failures: ${failures.length}`);

    if (failures.length > 0) {
      console.error('Logging failures:');
      failures.forEach((f: any, idx) => {
        console.error(`  Failure ${idx + 1}:`, f.reason.message || f.reason);
      });
    }
    
    // Slight delay between waves
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n=== STRESS TEST COMPLETE ===');
  console.log(`Total Successes: ${totalSuccesses}`);
  console.log(`Total Failures:  ${totalFailures}`);
}

runStressTest().catch(console.error);
