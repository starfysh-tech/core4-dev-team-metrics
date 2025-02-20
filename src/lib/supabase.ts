
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://your-project-ref.supabase.co",  // This will be replaced with your actual Supabase URL
  "your-anon-key"  // This will be replaced with your actual anon key
);
