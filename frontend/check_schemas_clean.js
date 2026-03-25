const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://weknjgueghcmevnqmdgr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indla25qZ3VlZ2hjbWV2bnFtZGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzYxNzksImV4cCI6MjA4OTQ1MjE3OX0.K1ZEErjYhPMv6u44AMNQOXp9I161X8pE6p-p7hQixKY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchemas() {
  const { data: form } = await supabase.from('formulaires').select('*').limit(1);
  if (form && form.length > 0) {
    console.log('--- FORMULAIRES COLUMNS ---');
    Object.keys(form[0]).forEach(k => console.log(k));
  }

  const { data: lead } = await supabase.from('leads').select('*').limit(1);
  if (lead && lead.length > 0) {
    console.log('--- LEADS COLUMNS ---');
    Object.keys(lead[0]).forEach(k => console.log(k));
  }
}

checkSchemas();
