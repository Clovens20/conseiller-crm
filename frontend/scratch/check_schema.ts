import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'clients' });
    if (error) {
        // If RPC doesn't exist, try querying a single row
        console.log('RPC failed, trying to select one row...');
        const { data: row, error: rowError } = await supabase.from('clients').select('*').limit(1);
        if (rowError) {
            console.error('Error selecting row:', rowError);
        } else if (row && row.length > 0) {
            console.log('Columns:', Object.keys(row[0]));
        } else {
            console.log('No rows found, cannot determine columns this way.');
            // Try to insert a dummy row and catch error? No.
        }
    } else {
        console.log('Columns:', data);
    }
  } catch (e) {
    console.error('Catch error:', e);
  }
}

checkSchema();
