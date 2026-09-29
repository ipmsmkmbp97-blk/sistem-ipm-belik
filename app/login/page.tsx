// File: app/login/page.tsx
"use client"; 

import Link from "next/link"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation"; // WAJIB DIIMPOR: Untuk mengarahkan halaman setelah berhasil login
import { supabase } from "../../lib/supabase"; // WAJIB DIIMPOR: Memanggil jembatan Supabase kita

export default function LoginPage() {
  const router = useRouter();

  // 1. STATE MANAGEMENT: Untuk menyimpan apa yang diketik pengguna
  const [identifier, setIdentifier] = useState(""); // Menyimpan User/NIS
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // 2. STATE FEEDBACK: Untuk loading dan menampilkan pesan error
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 3. FUNGSI LOGIN UTAMA (Dipanggil saat tombol login ditekan)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman me-refresh bawaan browser
    setErrorMsg(""); // Kosongkan error sebelumnya
    setLoading(true); // Nyalakan efek loading

    // Trik Cerdas: Gabungkan input user dengan domain khusus agar jadi email valid untuk Supabase
    const emailToSupabase = `${identifier}@ipm.belik`;

    // Mengirim permintaan login ke Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToSupabase,
      password: password,
    });

    if (error) {
      // Jika gagal (contoh: password salah atau user belum terdaftar)
      setErrorMsg("Gagal login: Periksa kembali User dan Password kamu.");
      setLoading(false);
    } else {
      // Jika berhasil, arahkan ke halaman dashboard (halamannya akan kita buat nanti)
      alert("Login Berhasil!"); 
      router.push("/dashboard"); 
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center sm:p-6 md:p-12">
      <main className="w-full max-w-md bg-white flex flex-col relative overflow-hidden h-[100dvh] sm:h-[750px] sm:max-h-[95vh] sm:rounded-[2.5rem] sm:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
        
        {/* ================= BAGIAN ATAS (Header Melengkung) ================= */}
        <div className="w-full bg-gradient-to-br from-[#00199F] via-[#003B9F] to-[#007FA7] pt-5 pb-5 px-6 flex flex-col items-center justify-center text-center rounded-b-[4rem] shadow-lg relative z-10 shrink-0">
           
           <Link href="/" className="absolute top-6 left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-sm transition-all duration-300 active:scale-90" aria-label="Kembali ke menu awal">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
           </Link>

           <div className="w-20 h-20 mb-3 relative hover:scale-105 transition-transform duration-300">
             <img src="/logo-ipm.jpg" alt="Logo IPM Belik" className="object-contain w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
           </div>
           
           <h1 className="text-white font-bold text-xs sm:text-sm tracking-widest leading-relaxed max-w-[400px] drop-shadow-md">
             PIMPINAN RANTING IKATAN PELAJAR MUHAMMADIYAH<br/>SMK MUHAMMADIYAH BELIK
           </h1>
        </div>

        {/* ================= BAGIAN BAWAH (Area Form Putih) ================= */}
        <div className="w-full flex-1 bg-white px-8 pt-8 pb-6 flex flex-col items-center relative z-0">
           
           {/* Menambahkan onSubmit={handleLogin} agar tombol Enter bisa digunakan */}
           <form onSubmit={handleLogin} className="w-full max-w-[280px] flex flex-col gap-6 mt-2">
              
              <div className="relative w-full">
                 <label className="absolute -top-2.5 left-6 bg-white px-2 text-[#007FA7] text-sm font-bold z-10">
                   User
                 </label>
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007FA7] z-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                 </div>
                 <input 
                   type="text" 
                   required
                   value={identifier}
                   onChange={(e) => setIdentifier(e.target.value)} // Menyimpan ketikan ke state
                   className="w-full relative z-0 bg-transparent text-gray-800 border-2 border-[#007FA7]/50 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:border-[#007FA7] focus:ring-1 focus:ring-[#007FA7] transition-all duration-300"
                 />
              </div>

              <div className="relative w-full">
                 <label className="absolute -top-2.5 left-6 bg-white px-2 text-[#007FA7] text-sm font-bold z-10">
                   Password
                 </label>
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#007FA7] z-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                 </div>
                 <input 
                   type={showPassword ? "text" : "password"} 
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)} // Menyimpan ketikan ke state
                   className="w-full relative z-0 bg-transparent text-gray-800 border-2 border-[#007FA7]/50 rounded-full pl-12 pr-12 py-3 focus:outline-none focus:border-[#007FA7] focus:ring-1 focus:ring-[#007FA7] transition-all duration-300"
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#007FA7] transition-colors z-10"
                 >
                   {showPassword ? (
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                   ) : (
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                   )}
                 </button>
              </div>

              {/* Area Pesan Error (Muncul jika state errorMsg tidak kosong) */}
              {errorMsg && (
                <p className="text-red-500 text-xs font-semibold text-center mt-[-8px]">
                  {errorMsg}
                </p>
              )}

              {/* Tombol berubah teks jadi "Memproses..." saat loading */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#003B9F] to-[#007FA7] text-white font-bold tracking-widest rounded-full shadow-[0_8px_20px_rgba(0,127,167,0.3)] hover:shadow-[0_10px_25px_rgba(0,127,167,0.5)] hover:-translate-y-1 transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:active:scale-100"
              >
                {loading ? "MEMPROSES..." : "LOGIN"}
              </button>

           </form>

           <div className="flex-1"></div>

           <div className="mt-6 mb-2 text-center">
              <span className="text-[11px] sm:text-xs font-medium text-gray-500">Don't Have A Account? </span>
              <a href="#" className="text-[11px] sm:text-xs font-bold text-[#007FA7] hover:text-[#00199F] transition-colors">
                Sign Up!
              </a>
           </div>

        </div>

      </main>
    </div>
  )
}