import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Di Next.js versi terbaru, pemanggilan cookies() bersifat asynchronous
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Error ini bisa diabaikan karena biasanya dipicu jika kita memanggil
            // fungsi ini dari Server Component. Middleware yang akan mengurus pembaruan cookie.
          }
        },
      },
    }
  )
}