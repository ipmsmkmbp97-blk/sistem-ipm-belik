// File: app/login/page.tsx
"use client"; 

import Link from "next/link"; 
import { useState } from "react"; 
import { useRouter } from "next/navigation"; 
import { supabase } from "../../lib/supabase"; 

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState(""); 
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setErrorMsg(""); 
    setLoading(true); 

    const emailToSupabase = `${identifier}@ipm.belik`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailToSupabase,
      password: password,
    });

    if (error) {
      setErrorMsg("Gagal login: Periksa kembali Username dan Password kamu.");
      setLoading(false);
    } else {
      router.push("/dashboard"); 
    }
  };

  return (
    // Latar belakang dengan warna abu-abu kebiruan yang sangat terang
    <div className="min-h-screen w-full bg-[#F1F5F9] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      {/* ================= EFEK BACKGROUND "HIDUP" (GLOWING ORBS) ================= */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-[#003B9F] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-72 h-72 sm:w-96 sm:h-96 bg-[#00B4D8] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 pointer-events-none"></div>

      {/* KOTAK LOGIN UTAMA */}
      <main className="w-full max-w-[420px] bg-white/90 backdrop-blur-md rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden relative border border-white z-10 transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,178,216,0.15)]">
        
        {/* Garis Aksen Tipis di Atas Kotak */}
        <div className="h-2 w-full bg-gradient-to-r from-[#00199F] via-[#003B9F] to-[#00B4D8]"></div>

        <div className="p-8 sm:p-10">
          
          {/* HEADER / LOGO */}
          <div className="flex flex-col items-center text-center mb-8 relative">
            <Link href="/" className="absolute -top-2 -left-2 sm:-left-4 text-slate-400 hover:text-[#003B9F] bg-slate-100 hover:bg-blue-50 p-2.5 rounded-full transition-all duration-300" title="Kembali ke Beranda">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            
            <div className="w-20 h-20 mb-5 bg-white rounded-full p-1.5 shadow-md border border-slate-100 relative group">
              <div className="absolute inset-0 rounded-full bg-[#003B9F] opacity-0 group-hover:opacity-10 scale-110 transition-all duration-300 blur-md"></div>
              <img src="/logo-ipm.jpg" alt="Logo IPM Belik" className="object-contain w-full h-full rounded-full relative z-10" />
            </div>
            
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Selamat Datang</h1>
            <p className="text-[10px] sm:text-xs font-bold text-[#007FA7] mt-1.5 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Sistem IPM Belik</p>
          </div>

          {/* FORM LOGIN */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            
            {/* Input User */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-wide">Username</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <input 
                  type="text" 
                  required
                  placeholder="Masukkan username..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#003B9F]/40 focus:ring-4 focus:ring-[#003B9F]/10 focus:bg-white transition-all duration-300 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase ml-1 tracking-wide">Password</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // pr-12 memastikan teks tidak menabrak tombol mata
                  className="w-full bg-slate-50 border-2 border-slate-100 text-slate-800 text-sm rounded-xl pl-11 pr-12 py-3.5 focus:outline-none focus:border-[#003B9F]/40 focus:ring-4 focus:ring-[#003B9F]/10 focus:bg-white transition-all duration-300 placeholder:text-slate-400"
                />
                
                {/* ================= TOMBOL MATA YANG PASTI MUNCUL ================= */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 p-2 text-slate-400 hover:text-[#003B9F] hover:bg-blue-50 rounded-lg transition-all duration-200 z-10 focus:outline-none focus:ring-2 focus:ring-[#003B9F]/20"
                  title={showPassword ? "Sembunyikan Password" : "Lihat Password"}
                >
                  {showPassword ? (
                    // Ikon Eye Off
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>
                  ) : (
                    // Ikon Eye On
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Area Pesan Error */}
            {errorMsg && (
              <div className="bg-rose-50 text-rose-600 p-3.5 rounded-xl text-xs font-bold text-center border border-rose-100 mt-1 flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errorMsg}
              </div>
            )}

            {/* Tombol Login */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#003B9F] to-[#007FA7] text-white font-black text-sm tracking-widest rounded-xl shadow-[0_8px_20px_rgba(0,127,167,0.25)] hover:shadow-[0_10px_25px_rgba(0,127,167,0.4)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:active:scale-100 flex justify-center items-center gap-2 overflow-hidden relative group"
            >
              {/* Efek kilatan cahaya (shine) saat di-hover */}
              <div className="absolute inset-0 -translate-x-full bg-white/20 group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></div>
              
              {loading ? (
                <>
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                   MEMPROSES...
                </>
              ) : (
                "MASUK KE DASHBOARD"
              )}
            </button>

          </form>
        </div>
      </main>

      {/* Watermark Organisasi di luar kotak */}
      <div className="absolute bottom-6 text-center w-full flex flex-col items-center gap-1 z-0">
        <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
          &copy; {new Date().getFullYear()} Pimpinan Ranting IPM
        </span>
        <span className="text-[10px] font-bold text-slate-400/80 tracking-wider">
          SMK Muhammadiyah Belik
        </span>
      </div>
      
    </div>
  )
}