import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://euunzcxkdhruhkghlubm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dW56Y3hrZGhydWhrZ2hsdWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTc3NzcsImV4cCI6MjA4OTU3Mzc3N30.gjwURaHQ3DrhLeCVGx-mfBuSk7Yn-FPjgOXmGMvry3U'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSecurity() {
  console.log('--- STARTING SECURITY AUDIT ---');

  // Test 1: Try reading products (should be allowed)
  const { data: products, error: prodError } = await supabase.from('products').select('*').limit(1);
  if (prodError) {
    console.log('✖ Could not read products (This might depend on your setup):', prodError.message);
  } else {
    console.log('✔ Products table is readable (Intended).');
  }

  // Test 2: Try reading orders anonymously (SHOULD BE EMPTY/REJECTED)
  const { data: orders, error: orderError } = await supabase.from('orders').select('*');
  if (orderError) {
    console.log('✔ Orders table is protected! Error:', orderError.message);
  } else if (orders.length > 0) {
    console.log('✖ SECURITY RISK: Orders table is leaked to the public! Found:', orders.length, 'orders');
  } else {
    console.log('✔ Orders table returned no public data (Protected).');
  }

  // Test 3: Try writing to categories anonymously (SHOULD FAIL)
  const { error: insertError } = await supabase.from('categories').insert({ name: 'Hacker Category', slug: 'hacker' });
  if (insertError) {
    console.log('✔ Insertion is blocked (Protected).');
  } else {
    console.log('✖ SECURITY RISK: Anonymous user can create categories!');
  }

  console.log('--- AUDIT COMPLETE ---');
}

testSecurity();
