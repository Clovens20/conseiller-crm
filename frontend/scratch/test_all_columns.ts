import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env.local'), 'utf8');
const supabaseUrl = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim() || '';
const supabaseKey = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1]?.trim() || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testColumn(columnName: string) {
    const { error } = await supabase
      .from('clients')
      .insert({
        prenom: 'Test',
        nom: 'Test',
        telephone: '000',
        [columnName]: columnName === 'nb_enfants' ? 0 : 'test',
        conseiller_id: '00000000-0000-0000-0000-000000000000'
      });
    
    if (error && error.message.includes('column')) {
        return false;
    }
    return true;
}

async function start() {
    const columns = ['courriel', 'adresse', 'conjoint', 'nb_enfants', 'statut', 'date_rdv', 'date_suivi', 'notes', 'source'];
    for (const col of columns) {
        const exists = await testColumn(col);
        console.log(`Column ${col}: ${exists ? 'EXISTS' : 'MISSING'}`);
    }
}

start();
