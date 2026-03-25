
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkContactsOwnership() {
  console.log('Checking contacts and their user_id...');
  
  const { data, error } = await supabase
    .from('contacts')
    .select('id, nom_complet, user_id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Total contacts found: ${data.length}`);
  const orphanCount = data.filter(c => !c.user_id).length;
  console.log(`Contacts without user_id (NULL): ${orphanCount}`);
  
  if (orphanCount > 0) {
      console.log('Sample orphans:', data.filter(c => !c.user_id).slice(0, 3));
  }
  
  const distinctUsers = [...new Set(data.map(c => c.user_id).filter(Boolean))];
  console.log(`Distinct user_ids found in table: ${distinctUsers}`);
}

checkContactsOwnership();
