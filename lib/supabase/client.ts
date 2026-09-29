// File: lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Fungsi ini bertugas menghubungkan web kita ke Supabase menggunakan kunci rahasia dari .env
  // Digunakan khusus untuk komponen yang berjalan di browser pengguna (Client-side)
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}