const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://weknjgueghcmevnqmdgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla25qZ3VlZ2hjbWV2bnFtZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYxNzksImV4cCI6MjA4OTQ1MjE3OX0.K1ZEErjYhPMv6u44AMNQOXp9I161X8pE6p-p7hQixKY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchemas() {
  console.log('--- Table: formulaires ---');
  const { data: form, error: formErr } = await supabase.from('formulaires').select('*').limit(1);
  if (formErr) console.error(formErr);
  else if (form.length > 0) console.log(Object.keys(form[0]));
  else console.log('Empty table');

  console.log('\n--- Table: leads ---');
  const { data: lead, error: leadErr } = await supabase.from('leads').select('*').limit(1);
  if (leadErr) console.error(leadErr);
  else if (lead.length > 0) console.log(Object.keys(lead[0]));
  else console.log('Empty table');
}

checkSchemas();
