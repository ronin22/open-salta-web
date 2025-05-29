
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hwtypzznknkhnaxuhrzc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3dHlwenpua25raG5heHVocnpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzODI0MDgsImV4cCI6MjA2MTk1ODQwOH0.my6e8TPm8Ezs-jghZ6fSs2wV2Rgjg5aK9E-frpfZnEE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
