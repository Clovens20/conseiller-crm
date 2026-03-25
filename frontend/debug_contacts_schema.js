
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env' });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking contacts table columns...');
  
  // We can try to select one row to see what we get
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching contacts:', error);
    if (error.message.includes('column "date_contact" does not exist')) {
        console.log('CONFIRMED: Column date_contact is missing.');
    }
  } else {
    console.log('Columns found:', data.length > 0 ? Object.keys(data[0]) : 'No data, but table exists');
  }

  // Use a query to get column names if possible (Supabase RPC or similar usually requires postgres access)
  // For now, let's just try to ADD the column if it's missing.
}

checkSchema();
