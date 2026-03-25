const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://weknjgueghcmevnqmdgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla25qZ3VlZ2hjbWV2bnFtZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYxNzksImV4cCI6MjA4OTQ1MjE3OX0.K1ZEErjYhPMv6u44AMNQOXp9I161X8pE6p-p7hQixKY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStats() {
  const { data: visits, error } = await supabase.from('form_visits').select('*').limit(5);
  if (error) {
    console.error('Error selecting from form_visits:', error.message, error.code);
  } else {
    console.log('Last 5 visits:', visits);
  }

  const { data: forms, error: formErr } = await supabase.from('formulaires').select('id, user_id, nb_visites').limit(1);
  if (formErr) console.error('Error selecting from formulaires:', formErr.message);
  else console.log('Sample formulaire:', forms[0]);
}

checkStats();
