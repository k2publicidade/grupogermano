const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function run() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env.local file not found');
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });

  const url = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase URL or Service Role Key not found in environment or .env.local');
  }

  const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

  const dataPath = path.join(__dirname, '..', 'data', 'cms.json');
  const document = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('Synchronizing CMS database in Supabase...');
  const { data, error } = await db.rpc('replace_cms_document', { p_document: document });

  if (error) {
    throw new Error(`Failed to save CMS to Supabase: ${error.message}`);
  }

  console.log('CMS database successfully synchronized!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
