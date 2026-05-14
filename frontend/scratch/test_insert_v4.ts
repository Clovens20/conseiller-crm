import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uyxjagcyuiqpidtsnyax.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5eGphZ2N5dWlxcGlkdHNueWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyOTQ4MDIsImV4cCI6MjA5Mzg3MDgwMn0.b1i_-j37vglFVFRuVf9uZIa8gmN5HMvlMTHsllWKiq0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testPartialInsert() {
  try {
    console.log('Testing partial insert into clients (without conjoint)...');
    const { error } = await supabase
      .from('clients')
      .insert({
        prenom: 'Test',
        nom: 'Test',
        telephone: '5140000000',
        courriel: 'test@example.com',
        adresse: '123 test',
        // conjoint: 'Conjoint', // Removed
        nb_enfants: 0,
        statut: 'prospect',
        date_rdv: '2026-05-16T08:00:00',
        date_suivi: '2026-05-17',
        notes: 'Notes test',
        source: 'Autre',
        conseiller_id: '00000000-0000-0000-0000-000000000000'
      });
    
    if (error) {
      console.error('Insert error message:', error.message);
      console.error('Insert error code:', error.code);
    } else {
      console.log('Insert success!');
    }
  } catch (e) {
    console.error('Catch error:', e);
  }
}

testPartialInsert();
