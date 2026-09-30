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

  // LOGIKA DATABASE (Aman 100%)
  const fetchDashboardData = async () => {
    setIsLoading(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user?.email) {
      const emailUser = session.user.email;
      const namaDepan = emailUser.split('@')[0];
      setUserName(namaDepan.charAt(0).toUpperCase() + namaDepan.slice(1));
      
      if (emailUser === "admin@ipm.belik") {
        setUserRole("Administrator");
      }
    }

    const { count: countAnggota } = await supabase.from('anggota').select('*', { count: 'exact', head: true });
    const { count: countProker } = await supabase.from('proker').select('*', { count: 'exact', head: true }).eq('status', 'Berjalan');
    const { count: countAbsen } = await supabase.from('kehadiran').select('*', { count: 'exact', head: true });
    
    const { data: dataAgenda } = await supabase.from('agenda_kegiatan').select('*').order('tanggal', { ascending: true }).limit(5);
    const { data: dataTugas } = await supabase.from('tugas_kegiatan').select('*').eq('status', 'Sedang Dikerjakan').limit(3);

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
     return (
       <div className="h-full w-full flex flex-col items-center justify-center gap-4">
         <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-[#003B9F] animate-spin"></div>
         <p className="text-[#003B9F] font-bold text-sm tracking-wider animate-pulse">MENYINKRONKAN DATA...</p>
       </div>
     );
  }

  return (
    // MASTER CONTAINER: Tetap mengunci 1 layar penuh
    <div className="h-full w-full flex flex-col gap-3 sm:gap-5 overflow-hidden">
      
      {/* ================= 1. BANNER SELAMAT DATANG ================= */}
      <div className="shrink-0 w-full bg-gradient-to-r from-[#00199F] via-[#003B9F] to-[#00B4D8] rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center shadow-sm">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
        <div className="absolute left-1/4 -bottom-10 w-32 h-32 bg-[#00B4D8]/30 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex gap-3 sm:gap-4 items-center w-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-2 hidden sm:flex items-center justify-center font-black text-lg shadow-inner relative overflow-hidden">
             <span className="relative z-10">{userName.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <h1 className="text-base sm:text-2xl font-black mb-0.5 drop-shadow-md tracking-tight truncate">Halo, {userName} 👋</h1>
            <div className="flex items-center gap-2">
               <span className="text-blue-100 text-[9px] sm:text-[10px] font-bold bg-black/20 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/10 uppercase tracking-widest">
                 {userRole}
               </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 md:text-right flex flex-col items-start sm:items-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/20 w-full sm:w-auto sm:pl-5">
          <p className="text-[9px] sm:text-xs font-extrabold tracking-widest text-white/90 uppercase">{tanggalFormat}</p>
          <p className="text-base sm:text-xl font-black text-white mt-0.5 drop-shadow-md">{jamFormat} <span className="text-[9px] sm:text-[10px] font-semibold text-blue-200">WIB</span></p>
        </div>
      </div>

      {/* ================= 2. GRID KOTAK STATISTIK ================= */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
         
         <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003B9F] flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 capitalize tracking-wide truncate">Anggota</p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-none mt-0.5">{stats.totalAnggota}</h3>
            </div>
         </div>

         <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 capitalize tracking-wide truncate">Agenda</p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-none mt-0.5">{stats.agendaBulanIni}</h3>
            </div>
         </div>

         <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 capitalize tracking-wide truncate">Proker</p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-none mt-0.5">{stats.prokerBerjalan}</h3>
            </div>
         </div>

         <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-500 flex items-center justify-center shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold text-slate-400 capitalize tracking-wide truncate">Absensi</p>
              <h3 className="text-lg sm:text-2xl font-black text-slate-800 leading-none mt-0.5">{stats.absenTerakhir}</h3>
            </div>
         </div>

      </div>

      {/* ================= 3. AREA PANEL DAFTAR BAWAH ================= */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 pb-2">
         
         {/* PANEL 1: AGENDA (Mengambil sisa layar penuh di HP) */}
         <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-6 flex flex-col h-full overflow-hidden">
            
            {/* Header Sesuai Screenshot */}
            <div className="shrink-0 flex justify-between items-center mb-4">
               <h3 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2.5">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                   <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                   <line x1="16" y1="2" x2="16" y2="6"/>
                   <line x1="8" y1="2" x2="8" y2="6"/>
                   <line x1="3" y1="10" x2="21" y2="10"/>
                 </svg>
                 Agenda Terdekat
               </h3>
               <Link href="/dashboard/agenda" className="text-[10px] sm:text-xs font-bold text-[#007FA7] bg-[#F0F8FF] hover:bg-[#E1F0FF] px-3 py-1.5 rounded-lg transition-colors">
                 Lihat Semua
               </Link>
            </div>
            
            {/* Area Daftar */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-3">
               {agendaTerdekat.length === 0 ? (
                 <div className="h-full flex items-center justify-center">
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">Belum ada agenda dalam waktu dekat.</p>
                 </div>
               ) : (
                 agendaTerdekat.map((agenda) => (
                   <div key={agenda.id} className="flex gap-3 sm:gap-4 items-center p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
                     
                     {/* KOTAK TANGGAL YANG DIPERBAIKI (Otomatis melar, pantang gepeng) */}
                     <div className="flex flex-col items-center justify-center min-w-[55px] px-3 py-2 shrink-0 bg-white rounded-lg border border-slate-200 shadow-sm">
                        <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{getBulanSingkat(agenda.tanggal)}</span>
                        <span className="text-base sm:text-xl font-black text-indigo-600 leading-none">{getTanggalAngka(agenda.tanggal)}</span>
                     </div>
                     
                     <div className="flex-1 min-w-0 pl-1">
                        <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{agenda.judul}</h4>
                        <p className="text-[10px] sm:text-xs text-slate-500 mt-1 truncate">{agenda.keterangan || "Kegiatan IPM"}</p>
                     </div>
                   </div>
                 ))
               )}
            </div>
         </div>

         {/* PANEL 2: TUGAS (MENGHILANG TOTAL DI HP) */}
         <div className="hidden lg:flex bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 flex-col h-full overflow-hidden">
            <div className="shrink-0 flex justify-between items-center mb-4">
               <h3 className="font-bold text-sm sm:text-base text-slate-800 flex items-center gap-2.5">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                   <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                   <path d="m9 11 3 3L22 4"/>
                 </svg>
                 Tugas Berjalan
               </h3>
               <Link href="/dashboard/tugas" className="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                 Buka Kanban
               </Link>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 flex flex-col gap-2.5">
               {tugasBerjalan.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-xs sm:text-sm text-slate-400 font-medium">Belum ada tugas aktif.</p>
                  </div>
               ) : (
                  tugasBerjalan.map((tugas) => (
                    <div key={tugas.id} className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-start mb-1 sm:mb-2">
                         <span className="font-bold text-slate-700 text-[11px] sm:text-[13px] truncate pr-2">{tugas.judul}</span>
                         <span className="font-bold text-emerald-600 text-[8px] sm:text-[9px] bg-emerald-100 px-1.5 py-0.5 rounded shrink-0 uppercase">Progress</span>
                      </div>
                      <p className="text-[9px] sm:text-[11px] text-slate-500 mb-2 font-medium">PIC: <span className="font-bold text-slate-700">{tugas.ditugaskan_ke}</span></p>
                      <div className="w-full bg-slate-200 rounded-full h-1 sm:h-1.5">
                         <div className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full w-1/2"></div>
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