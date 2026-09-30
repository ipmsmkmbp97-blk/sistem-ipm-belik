// File: lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Mengambil brankas cookie (penyimpanan sementara di browser pengguna)
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Fungsi untuk membaca cookie (mengecek apakah user sudah login)
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        // Fungsi untuk menyimpan cookie baru (saat user berhasil login)
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Error ini wajar jika dipanggil dari Server Component biasa, kita abaikan saja
          }
        },
        // Fungsi untuk menghapus cookie (saat user logout)
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Sama seperti set, abaikan jika terjadi error di Server Component
          }
        },
      },
    }
  )
}