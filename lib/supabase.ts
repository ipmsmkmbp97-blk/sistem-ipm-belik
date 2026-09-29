// File: lib/supabase.ts

// Mengimpor fungsi pembuat klien dari library Supabase yang sudah kita instal
import { createClient } from '@supabase/supabase-js'

// Mengambil URL dan Key dari file .env yang sudah kamu siapkan tadi
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Membuat jembatan (client) Supabase yang akan kita pakai di halaman Login
export const supabase = createClient(supabaseUrl, supabaseAnonKey)