import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://esabrzdgubdhmlrnmmth.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzYWJyemRndWJkaG1scm5tbXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODMwNDEsImV4cCI6MjA4NzE1OTA0MX0.wh5wEzTSUac_TVR7905_YV8tjPrgumhs12gV8cutQXw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCountries() {
    const { data, error } = await supabase.from('countries').select('*');
    if (error) {
        console.error("Error fetching countries:", error);
    } else {
        console.log("Countries data:", data);
    }
}

checkCountries();
