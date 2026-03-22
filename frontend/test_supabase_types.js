const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://weknjgueghcmevnqmdgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla25qZ3VlZ2hjbWV2bnFtZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYxNzksImV4cCI6MjA4OTQ1MjE3OX0.K1ZEErjYhPMv6u44AMNQOXp9I161X8pE6p-p7hQixKY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
  // Query information_schema if possible (might be blocked for anon)
  // Instead, let's just try to select and see the type of one value.
  const { data, error } = await supabase
    .from('clients')
    .select('user_id')
    .limit(1);

  if (error) {
    console.error('Erreur:', error);
  } else if (data && data.length > 0) {
    console.log('Type de user_id (valeur):', typeof data[0].user_id);
    console.log('Valeur de user_id:', data[0].user_id);
  } else {
    console.log('Table vide.');
  }
}

checkSchema();
