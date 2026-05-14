import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uyxjagcyuiqpidtsnyax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGphZ2N5dWlxcGlkdHNueWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyOTQ4MDIsImV4cCI6MjA5Mzg3MDgwMn0.b1i_-j37vglFVFRuVf9uZIa8gmN5HMvlMTHsllWKiq0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfils() {
  try {
    console.log('Reading profils...');
    const { data, error } = await supabase.from('profils').select('id, email').limit(5);
    if (error) {
        console.error('Error reading profils:', error.message);
    } else {
        console.log('Profils:', data);
        if (data && data.length > 0) {
            const userId = data[0].id;
            console.log(`Testing insert with conseiller_id: ${userId}`);
            const { error: insertError } = await supabase.from('clients').insert({
                prenom: 'Test',
                nom: 'Test',
                telephone: '5140000000',
                statut: 'prospect',
                conseiller_id: userId
            });
            if (insertError) {
                console.error('Insert error with ID:', insertError.message);
                console.error('Code:', insertError.code);
            } else {
                console.log('Insert success with ID!');
            }
        }
    }
  } catch (e) {
    console.error('Catch error:', e);
  }
}

checkProfils();
