// File: app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Pengurus");
  const [userRole, setUserRole] = useState("Anggota");
  const [waktuSekarang, setWaktuSekarang] = useState(new Date());

  const [stats, setStats] = useState({
    totalAnggota: 0,
    agendaBulanIni: 0,
    prokerBerjalan: 0,
    absenTerakhir: 0,
  });

  const [agendaTerdekat, setAgendaTerdekat] = useState<any[]>([]);
  const [tugasBerjalan, setTugasBerjalan] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    // A. Ambil Sesi Pengguna
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      const emailUser = session.user.email;
      const namaDepan = emailUser.split('@')[0];
      setUserName(namaDepan.charAt(0).toUpperCase() + namaDepan.slice(1));
      
      if (emailUser === "admin@ipm.belik") {
        setUserRole("Administrator");
      }
    }

    // B. Hitung Data Statistik dari Database
    const { count: countAnggota } = await supabase.from('anggota').select('*', { count: 'exact', head: true });
    const { count: countProker } = await supabase.from('proker').select('*', { count: 'exact', head: true }).eq('status', 'Berjalan');
    const { count: countAbsen } = await supabase.from('kehadiran').select('*', { count: 'exact', head: true });
    
    // C. Ambil Agenda & Tugas
    const { data: dataAgenda } = await supabase.from('agenda_kegiatan').select('*').order('tanggal', { ascending: true }).limit(5);
    const { data: dataTugas } = await supabase.from('tugas_kegiatan').select('*').eq('status', 'Sedang Dikerjakan').limit(3);

    // Update State
    setStats({
      totalAnggota: countAnggota || 0,
      agendaBulanIni: dataAgenda?.length || 0,
      prokerBerjalan: countProker || 0,
      absenTerakhir: countAbsen || 0,
    });

    setAgendaTerdekat(dataAgenda || []);
    setTugasBerjalan(dataTugas || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
    const timer = setInterval(() => setWaktuSekarang(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tanggalFormat = waktuSekarang.toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const jamFormat = waktuSekarang.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });

  const getBulanSingkat = (tglStr: string) => tglStr ? new Date(tglStr).toLocaleString('id-ID', { month: 'short' }) : "N/A";
  const getTanggalAngka = (tglStr: string) => tglStr ? new Date(tglStr).getDate() : "-";

  if (isLoading) {
     return <div className="min-h-screen flex items-center justify-center p-10"><p className="text-slate-400 animate-pulse font-medium text-sm">Mensinkronisasi Data Utama...</p></div>;
  }

  return (
    // ================= PENGUNCIAN TINGGI LAYAR (NO-SCROLL DI HP) =================
    // h-[calc(100vh-6rem)] akan memaksa dashboard mengambil sisa layar secara presisi di HP
    <div className="flex flex-col gap-3 sm:gap-6 h-[calc(100vh-6rem)] sm:h-auto overflow-hidden sm:overflow-visible">
      
      {/* 1. BANNER SELAMAT DATANG (Dibuat sangat ringkas di HP) */}
      <div className="shrink-0 w-full bg-gradient-to-r from-[#00199F] to-[#003B9F] rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center shadow-md">
        <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex gap-3 sm:gap-4 items-center w-full">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl p-2 hidden sm:flex items-center justify-center font-black text-xl">
             {userName.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-lg sm:text-3xl font-extrabold mb-0.5 sm:mb-1 drop-shadow-md line-clamp-1">Halo, {userName} 👋</h1>
            <p className="text-blue-100 text-[10px] sm:text-sm font-medium">Akses: <span className="bg-blue-800 px-1.5 py-0.5 rounded text-[9px] sm:text-xs ml-1">{userRole}</span></p>
          </div>
        </div>

        {/* ================= PERBAIKAN: Tanggal & Jam (Sekarang muncul di HP & Laptop) ================= */}
        <div className="relative z-10 md:text-right flex flex-col items-start sm:items-end mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/20 w-full sm:w-auto sm:pl-4">
          <p className="text-xs sm:text-sm font-bold tracking-wider">{tanggalFormat}</p>
          <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5 sm:mt-1">{jamFormat} WIB</p>
        </div>
      </div>

      {/* 2. GRID KOTAK STATISTIK (Formasi 2x2 yang padat di HP) */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
         
         <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-[#003B9F] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 mb-0.5 truncate">Anggota</p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-none">{stats.totalAnggota}</h3>
            </div>
         </div>

         <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 mb-0.5 truncate">Agenda</p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-none">{stats.agendaBulanIni}</h3>
            </div>
         </div>

         <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 mb-0.5 truncate">Proker</p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-none">{stats.prokerBerjalan}</h3>
            </div>
         </div>

         <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-6 sm:h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-xs font-semibold text-slate-400 mb-0.5 truncate">Absensi</p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-none">{stats.absenTerakhir}</h3>
            </div>
         </div>

      </div>

      {/* 3. AREA KONTEN BAWAH (Scrollable Internal) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
         
         {/* PANEL KIRI: Agenda Terdekat (Mengisi 100% sisa ruang di HP) */}
         <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex flex-col h-full overflow-hidden">
            <div className="shrink-0 flex justify-between items-center mb-3 sm:mb-6">
               <h3 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2">
                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                 Agenda Terdekat
               </h3>
               <Link href="/dashboard/agenda" className="text-[10px] sm:text-xs font-bold text-[#007FA7] hover:text-[#003B9F] bg-blue-50 px-2 py-1 rounded-md transition-colors">Lihat Semua</Link>
            </div>
            
            {/* Box ini akan menggulung otomatis (scroll) jika isi agenda terlalu panjang */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2 sm:gap-4">
               {agendaTerdekat.length === 0 ? (
                 <div className="h-full flex items-center justify-center">
                    <p className="text-xs sm:text-sm text-slate-400 text-center">Belum ada agenda dalam waktu dekat.</p>
                 </div>
               ) : (
                 agendaTerdekat.map((agenda) => (
                   <div key={agenda.id} className="flex gap-3 sm:gap-4 items-center p-2.5 sm:p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                     <div className="text-center w-10 sm:w-12 shrink-0 bg-white py-1 rounded-lg border border-slate-100 shadow-sm">
                        <p className="text-[9px] sm:text-xs font-bold text-slate-500 uppercase">{getBulanSingkat(agenda.tanggal)}</p>
                        <p className="text-base sm:text-xl font-black text-indigo-600">{getTanggalAngka(agenda.tanggal)}</p>
                     </div>
                     <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{agenda.judul}</h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 truncate">{agenda.keterangan || "Kegiatan Rutin IPM"}</p>
                     </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         {/* PANEL KANAN: Task Sedang Dikerjakan (DISEMBUNYIKAN DI HP agar 1 layar pas) */}
         <div className="hidden lg:flex bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-col h-full overflow-hidden">
            <div className="shrink-0 flex justify-between items-center mb-6">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                 Tugas Sedang Dikerjakan
               </h3>
               <Link href="/dashboard/tugas" className="text-xs font-bold text-[#007FA7] hover:text-[#003B9F] bg-blue-50 px-2 py-1 rounded-md transition-colors">Buka Kanban</Link>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-4">
               {tugasBerjalan.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-sm text-slate-400 text-center">Tidak ada tugas yang sedang dikerjakan saat ini.</p>
                  </div>
               ) : (
                  tugasBerjalan.map((tugas) => (
                    <div key={tugas.id} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between text-sm mb-1.5">
                         <span className="font-bold text-slate-700 truncate pr-4">{tugas.judul}</span>
                         <span className="font-bold text-[#007FA7] text-[10px] bg-blue-100 px-2 py-0.5 rounded-full shrink-0">On Progress</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-3">Ditugaskan ke: <span className="font-semibold text-slate-600">{tugas.ditugaskan_ke}</span></p>
                      <div className="w-full bg-slate-200 rounded-full h-1.5">
                         <div className="bg-gradient-to-r from-[#003B9F] to-[#007FA7] h-1.5 rounded-full w-1/2"></div>
                      </div>
                    </div>
                  ))
               )}
            </div>
         </div>

      </div>
    </div>
  )
}