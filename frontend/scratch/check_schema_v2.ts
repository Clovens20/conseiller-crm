import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uyxjagcyuiqpidtsnyax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGphZ2N5dWlxcGlkdHNueWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyOTQ4MDIsImV4cCI6MjA5Mzg3MDgwMn0.b1i_-j37vglFVFRuVf9uZIa8gmN5HMvlMTHsllWKiq0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log('Trying to select one row from clients...');
    const { data: row, error: rowError } = await supabase.from('clients').select('*').limit(1);
    if (rowError) {
        console.error('Error selecting row:', rowError);
    } else if (row && row.length > 0) {
        console.log('Columns found:', Object.keys(row[0]));
    } else {
        console.log('No rows found in clients table.');
        // Try to get definition via API
        const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
        const data = await res.json();
        if (data.definitions && data.definitions.clients) {
            console.log('Columns from definition:', Object.keys(data.definitions.clients.properties));
        } else {
            console.log('Could not find clients definition.');
        }
    }
  } catch (e) {
    console.error('Catch error:', e);
  }
}

checkSchema();
