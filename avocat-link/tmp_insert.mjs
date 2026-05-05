import { createClient } from "@supabase/supabase-js";
import fs from "fs";

// Get keys from .env.local
const env = fs.readFileSync(".env.local", "utf8");
const getEnv = (key) => {
  const match = env.match(new RegExp(`^${key}=(.*)$`, "m"));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseKey = getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"); // Try to get a high privilege key if available

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Fetching user...");
  // Assuming the user has a profile in avocats
  const { data: avocatList, error: errAvo } = await supabase
    .from("avocats")
    .select("id, user_id")
    .limit(10);
  
  if (errAvo) return console.error("Error fetching avocats:", errAvo);
  
  const avocat = avocatList.find(a => a.user_id);
  if (!avocat) return console.error("No avocat found with a user_id.");

  // Get a random client or create a dummy one if clients table exist? Wait, clients table relies on auth.users for id.
  // We can just use the avocat itself as the client for dummy purposes, or find any other auth user.
  // Wait, consultation client_id is auth.users.id. We can use avocat.user_id as the client_id as well.
  
  console.log("Inserting dummy consultation for avocat:", avocat.id);
  
  const dummy1 = {
    client_id: avocat.user_id, // we use existing ID
    avocat_id: avocat.id,
    avocat_user_id: avocat.user_id,
    date_consultation: new Date(Date.now() + 86400000).toISOString(),
    status: "pending",
    fichier_url: "dummy/path.pdf"
  };
  
  const dummy2 = {
    client_id: avocat.user_id,
    avocat_id: avocat.id,
    avocat_user_id: avocat.user_id,
    date_consultation: new Date(Date.now() - 86400000).toISOString(),
    status: "accepted",
    fichier_url: "dummy/path2.pdf"
  };

  const { error } = await supabase.from("consultations").insert([dummy1, dummy2]);
  if (error) {
    console.error("Error inserting consultations:", error);
  } else {
    console.log("Successfully inserted dummy consultations!");
  }
}

run();
