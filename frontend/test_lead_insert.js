const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://weknjgueghcmevnqmdgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla25qZ3VlZ2hjbWV2bnFtZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYxNzksImV4cCI6MjA4OTQ1MjE3OX0.K1ZEErjYhPMv6u44AMNQOXp9I161X8pE6p-p7hQixKY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLeadInsert() {
  const { error } = await supabase
    .from('leads')
    .insert({
      nom_complet: 'Test Lead',
      email: 'test@example.com',
      telephone: '123456789',
      besoins: ['Test'],
      details: 'Test details',
      langue: 'fr',
      veut_devenir_conseiller: false,
      user_id: '8b7f9e8a-c82c-4860-bc34-762cf14ea55e',
      formulaire_id: '8b7f9e8a-c82c-4860-bc34-762cf14ea55e', // Fake ID for testing schema
      converti: false
    });

  if (error) {
    console.error('Code:', error.code);
    console.error('Message:', error.message);
  } else {
    console.log('Insert success (schema is OK)');
  }
}

testLeadInsert();
