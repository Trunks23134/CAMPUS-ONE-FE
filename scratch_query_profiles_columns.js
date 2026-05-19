const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://swkeqzjrlraadglfdmgi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a2VxempybHJhYWRnbGZkbWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTIxNTEsImV4cCI6MjA4NzA4ODE1MX0.4Oyfk1ybHSCyuQ69fZsRja6d7wvYcTnQYhe55_PntnM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProfilesColumns() {
  const { data, error } = await supabase
    .from("applicant_profiles")
    .select("*")
    .limit(1);
  
  if (error) {
    console.error("Error:", error);
    return;
  }
  
  console.log("Columns in applicant_profiles:", Object.keys(data[0] || {}));
}

checkProfilesColumns();
