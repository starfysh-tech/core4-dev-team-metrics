
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ifravdieobvwcwlypput.supabase.co",  // This will be replaced with your actual Supabase URL
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcmF2ZGllb2J2d2N3bHlwcHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMTg3NTksImV4cCI6MjA1NTU5NDc1OX0.4UowNOZxOfaVAknXssC58jOUlc_aAl2c4U1Dl7Fvf1Q"  // This will be replaced with your actual anon key
);
