const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://weknjgueghcmevnqmdgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla25qZ3VlZ2hjbWV2bnFtZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYxNzksImV4cCI6MjA4OTQ1MjE3OX0.K1ZEErjYhPMv6u44AMNQOXp9I161X8pE6p-p7hQixKY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log('Vérification de la table "clients"...');
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Erreur lors de l\'accès à la table "clients":', error);
  } else {
    console.log('Succès! La table "clients" est accessible.');
    console.log('Données (limit 1):', data);
  }
}

checkTables();
