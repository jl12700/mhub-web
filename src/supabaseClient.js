import { createClient } from '@supabase/supabase-js';

const supabaseURL = "https://icxdxpyyninloujbihsh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljeGR4cHl5bmlubG91amJpaHNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1ODk0NzEsImV4cCI6MjA2MjE2NTQ3MX0.BoSgFnEwk10t9u5NNUIg_1pvYtY0B31EyaBsMjiRGSM";

export const supabase = createClient(supabaseURL,supabaseAnonKey)