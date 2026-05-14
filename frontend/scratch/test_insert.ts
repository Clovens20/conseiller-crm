import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uyxjagcyuiqpidtsnyax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGphZ2N5dWlxcGlkdHNueWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyOTQ4MDIsImV4cCI6MjA5Mzg3MDgwMn0.b1i_-j37vglFVFRuVf9uZIa8gmN5HMvlMTHsllWKiq0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  try {
    console.log('Testing insert into clients...');
    // Try a minimal insert to see what fails
    const { data, error } = await supabase
      .from('clients')
      .insert({
        prenom: 'Test',
        nom: 'Test',
        telephone: '5140000000',
        statut: 'prospect'
      })
      .select();
    
    if (error) {
      console.error('Insert error:', error.message);
      console.error('Full error:', error);
    } else {
      console.log('Insert success:', data);
    }
  } catch (e) {
    console.error('Catch error:', e);
  }
}

testInsert();
