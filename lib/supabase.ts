import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Mantra = {
  id: number
  title_hindi: string
  title_english: string
  subtitle_hindi: string
  subtitle_english: string
  description_hindi: string
  description_english: string
  verses_hindi: string[]
  verses_english: string[]
  category: string
  color: string
  icon: string
  background_image?: string
  created_at: string
}