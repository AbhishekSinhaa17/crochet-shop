const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function setup() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
  const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/);
  
  if (!urlMatch || !keyMatch) {
    console.error("Missing credentials in .env.local");
    return;
  }
  
  const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

  console.log('Creating bucket product-images...');
  const { data, error } = await supabase.storage.createBucket('product-images', { public: true });
  console.log('Create Bucket Result:', data, error);

  console.log('Fetching buckets...');
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log(buckets);
}

setup();
