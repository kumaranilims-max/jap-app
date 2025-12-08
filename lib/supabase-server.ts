import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://czzlvcofkcyexelunqkd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6emx2Y29ma2N5ZXhlbHVucWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MjMyNzEsImV4cCI6MjA4MDQ5OTI3MX0.AISeetKnnz6_NQQ9pe65h3XaDoebOab1tSQhB0f04kc'

export const supabaseServer = createClient(supabaseUrl, supabaseKey)