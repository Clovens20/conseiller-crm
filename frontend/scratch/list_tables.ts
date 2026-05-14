import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uyxjagcyuiqpidtsnyax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGphZ2N5dWlxcGlkdHNueWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyOTQ4MDIsImV4cCI6MjA5Mzg3MDgwMn0.b1i_-j37vglFVFRuVf9uZIa8gmN5HMvlMTHsllWKiq0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function listTables() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/?apikey=${supabaseKey}`);
    const data = await res.json();
    console.log('Tables defined in API:', Object.keys(data.definitions || {}));
    if (data.definitions && data.definitions.clients) {
        console.log('Clients properties:', Object.keys(data.definitions.clients.properties));
        console.log('Required properties:', data.definitions.clients.required);
    }
  } catch (e) {
    console.error('Catch error:', e);
  }
}

listTables();
