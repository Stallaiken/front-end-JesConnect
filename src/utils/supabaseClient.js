import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hneubqtpksfndtmfwgzi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhuZXVicXRwa3NmbmR0bWZ3Z3ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczMzg5NDcsImV4cCI6MjEwMjkxNDk0N30.PWQpqBc0Lxfg05-wN3B4jrLtaJnXxjdW-4Wu3ugJ49I'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);