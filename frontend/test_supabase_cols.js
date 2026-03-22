const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://weknjgueghcmevnqmdgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla25qZ3VlZ2hjbWV2bnFtZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYxNzksImV4cCI6MjA4OTQ1MjE3OX0.K1ZEErjYhPMv6u44AMNQOXp9I161X8pE6p-p7hQixKY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumns() {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Erreur:', error);
  } else if (data && data.length > 0) {
    console.log('Colonnes disponibles:', Object.keys(data[0]));
  } else {
    console.log('Table vide, impossible de voir les colonnes par sélection.');
  }
}

checkColumns();
