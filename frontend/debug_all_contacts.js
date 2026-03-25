
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function showAllTableContacts() {
  console.log('Querying all contacts to see recent additions...');
  
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Table has ${data.length} total contacts.`);
  if (data.length > 0) {
      console.log('Last 5 additions:');
      data.slice(0, 5).forEach(c => {
          console.log(`- ${c.nom_complet} (User: ${c.user_id}, Created: ${c.created_at})`);
      });
  } else {
      console.log('Table is empty!');
  }
}

showAllTableContacts();
