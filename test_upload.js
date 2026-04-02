const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function testUpload() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/);
  const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/); // using ANON key
  
  const supabaseUrl = urlMatch[1].trim();
  const supabaseKey = keyMatch[1].trim();
  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("Supabase Client created.");

  const blob = new Blob(['Hello, world!'], { type: 'text/plain' });
  const file = new File([blob], 'test.txt', { type: 'text/plain' });

  // Test insert with anon -> will it fail instantly or hang?
  console.log("Uploading with anon key...");
  const timer = setTimeout(() => console.error("UPLOAD HUNG! (timed out)"), 4000);
  const { data, error } = await supabase.storage.from('product-images').upload('test-upload-' + Date.now() + '.txt', file);
  clearTimeout(timer);
  
  console.log("Anon Result:", data, error);
}

testUpload();
