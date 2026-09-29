// File: middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Membuat respons awal untuk dilanjutkan ke halaman yang dituju
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 2. Membuat koneksi Supabase khusus untuk middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({ name, value, ...options })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          request.cookies.set({ name, value: '', ...options })
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          supabaseResponse.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // 3. Memanggil getUser() akan secara otomatis menyegarkan token login jika hampir kedaluwarsa
  await supabase.auth.getUser()

  return supabaseResponse
}

// 4. Menentukan halaman mana saja yang akan dijaga oleh Middleware ini
export const config = {
  matcher: [
    // Middleware akan berjalan di semua halaman KECUALI file statis (gambar, ikon, dll) agar web tetap cepat
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}