// File: app/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; // Import sudah disesuaikan agar tidak error

export default function LoginPage() {
  const router = useRouter();
  
  // State untuk menyimpan input user (Sekarang menggunakan Username, bukan Email)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // TRIK SAKTI: Gabungkan input username dengan domain @ipm.id di belakang layar
    // Jadi kalau kamu ketik "admin", sistem membacanya "admin@ipm.id"
    const emailFormat = `${username}@ipm.belik`;

    // Proses login ke Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email: emailFormat, 
      password: password,
    });

    if (error) {
      setErrorMsg("Username atau Password salah!");
    } else if (data.session) {
      // Jika berhasil, masuk ke dashboard
      router.push("/dashboard");
    }
    
    setIsLoading(false);
  };

  return (
    // Container utama dengan Split-Screen Layout (Fleksibel: Tumpuk di HP, Bersebelahan di Laptop)
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      
      {/* ================= SISI KIRI: BRANDING (BIRU) ================= */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#003B9F] to-[#002870] text-white p-10 md:p-16 flex flex-col justify-center items-center relative overflow-hidden">
        
        {/* Ornamen Estetik Background */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl translate-x-[-50%] translate-y-[-50%]"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400 opacity-10 rounded-full blur-3xl translate-x-[30%] translate-y-[30%]"></div>
        
        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="w-20 h-20 bg-white/10 rounded-2xl mb-8 flex items-center justify-center border border-white/20 shadow-lg backdrop-blur-sm">
            <span className="font-black text-3xl tracking-wider">IPM</span>
          </div>
          
          {/* Teks Sambutan Kiri */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Sistem<br />Manajemen<br />Modern.
          </h1>
          <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-12">
            Platform digitalisasi administrasi dan keanggotaan Ikatan Pelajar Muhammadiyah SMK Muhammadiyah Belik.
          </p>
          
          <div className="pt-8 border-t border-white/20">
            <p className="text-xs font-bold tracking-[0.2em] text-blue-200/60 uppercase">EST. 2026</p>
          </div>
        </div>
      </div>

      {/* ================= SISI KANAN: FORM LOGIN (PUTIH) ================= */}
      <div className="w-full md:w-1/2 bg-white p-10 flex flex-col justify-center items-center">
        <div className="w-full max-w-sm">
          
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Selamat Datang 👋</h2>
            <p className="text-slate-500 text-sm">Silakan masuk menggunakan username kamu.</p>
          </div>

          {/* Box Pesan Error (Hanya muncul kalau login gagal) */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            {/* Input Username */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Username</label>
              <input 
                type="text" 
                required 
                placeholder="Contoh: admin / anggota"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 focus:border-[#003B9F] outline-none transition-colors bg-slate-50 focus:bg-white" 
              />
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Kata Sandi (Password)</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-2 border-slate-200 rounded-xl px-4 py-3.5 text-sm font-medium text-slate-700 focus:border-[#003B9F] outline-none transition-colors bg-slate-50 focus:bg-white" 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#003B9F] hover:bg-[#002870] text-white font-bold py-4 rounded-xl shadow-lg shadow-[#003B9F]/30 hover:shadow-[#003B9F]/50 transition-all active:scale-95 disabled:opacity-70 mt-2 flex justify-center items-center"
            >
              {isLoading ? "Memproses..." : "Masuk ke Dashboard ➔"}
            </button>
          </form>
          
        </div>
      </div>
      
    </div>
  );
}