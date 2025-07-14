import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://awhyqgjzekcuwysymtsl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3aHlxZ2p6ZWtjdXd5c3ltdHNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4Njk2NTcsImV4cCI6MjA1NjQ0NTY1N30.cTcKTs8vsZkaT6VyXhbRP5apLERgOIBzUxkhnUkMwOg'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

