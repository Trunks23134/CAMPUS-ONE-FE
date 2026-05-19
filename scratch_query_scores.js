const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://swkeqzjrlraadglfdmgi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3a2VxempybHJhYWRnbGZkbWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTIxNTEsImV4cCI6MjA4NzA4ODE1MX0.4Oyfk1ybHSCyuQ69fZsRja6d7wvYcTnQYhe55_PntnM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkScores() {
  const { data: logs, error: logsError } = await supabase
    .from("Exam_Logs")
    .select("*");
  
  if (logsError) {
    console.error("Exam_Logs Error:", logsError);
  } else {
    console.log("Exam Logs inside DB:");
    console.log(JSON.stringify(logs, null, 2));
  }
}

checkScores();
