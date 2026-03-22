const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://weknjgueghcmevnqmdgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla25qZ3VlZ2hjbWV2bnFtZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYxNzksImV4cCI6MjA4OTQ1MjE3OX0.K1ZEErjYhPMv6u44AMNQOXp9I161X8pE6p-p7hQixKY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const { error } = await supabase
    .from('formulaires')
    .insert({
      nom: 'Test',
      slug: 'test-' + Date.now(),
      titre: 'Test',
      message_accueil: 'Test',
      couleur_primaire: '#000000',
      couleur_secondaire: '#ffffff',
      logo_url: '',
      langues: ['fr'],
      besoins_personnalises: [],
      actif: false,
      user_id: '8b7f9e8a-c82c-4860-bc34-762cf14ea55e' // A valid UUID from previous check
    });

  if (error) {
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
  } else {
    console.log('Insert success (even if RLS might block, here we check for schema issues)');
  }
}

testInsert();
