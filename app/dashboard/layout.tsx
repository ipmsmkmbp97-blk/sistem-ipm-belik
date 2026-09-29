// File: app/dashboard/layout.tsx
"use client"; 

import { useState, useEffect } from "react"; 
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [userName, setUserName] = useState("Pengurus");
  const [userRole, setUserRole] = useState("Anggota");
  const [userInitial, setUserInitial] = useState("P");

  useEffect(() => {
    const periksaAkses = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.replace("/");
      } else {
        const email = session.user?.email || "";
        const namaDepan = email.split('@')[0];
        
        const formatNama = namaDepan.charAt(0).toUpperCase() + namaDepan.slice(1);
        setUserName(formatNama);
        
        setUserInitial(formatNama.charAt(0).toUpperCase());

        if (email === "admin@ipm.belik") {
          setIsAdmin(true);
          setUserRole("Administrator");
        } else {
          setUserRole("Anggota Aktif");
        }

        setIsCheckingAuth(false);
      }
    };

    periksaAkses();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-[#003B9F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          <p className="text-slate-500 font-medium text-sm animate-pulse">Memeriksa akses keamanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      
      {/* BACKGROUND OVERLAY (Khusus HP) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0F172A] text-slate-300 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 flex flex-col shadow-2xl md:shadow-none
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-[#0B1221] shrink-0">
          <span className="text-white font-extrabold text-xl tracking-wider flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#003B9F] to-[#007FA7] rounded-lg flex items-center justify-center">
              <span className="text-xs text-white">IPM</span>
            </div>
            SMK MBP
          </span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar flex flex-col">
           <div className="flex-1">
             
             <Link 
                href="/dashboard" 
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center gap-3 px-4 py-3 bg-[#003B9F]/20 text-white rounded-xl mb-6 border border-[#003B9F]/50 transition-colors"
             >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#00B4D8]"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <span className="font-bold text-sm">Dashboard</span>
             </Link>

             {/* Kategori 1: Organisasi */}
             <div className="mb-6">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Organisasi</p>
                <div className="flex flex-col space-y-1">
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/anggota" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-blue-400"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                     Data Anggota
                   </Link>
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/struktur" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-blue-400"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>
                     Struktur Organisasi
                   </Link>
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/proker" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-blue-400"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                     Program Kerja
                   </Link>
                </div>
             </div>

             {/* Kategori 2: Kegiatan */}
             <div className="mb-6">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Kegiatan</p>
                <div className="flex flex-col space-y-1">
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/agenda" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-indigo-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                     Agenda & Kalender
                   </Link>
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/data-absensi" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-indigo-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
                     Data Absensi
                   </Link>
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/dokumentasi" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-indigo-400"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                     Dokumentasi
                   </Link>
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/scan-qr" className="px-4 py-2 text-sm text-[#00B4D8] hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#00B4D8] group-hover:text-white"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/><rect x="3" y="16" width="5" height="5" rx="1"/><path d="M21 16v5h-5"/><path d="M8 3v5H3"/><path d="M16 3v5h5"/><path d="M3 16v-5h5"/><path d="M10 10h4v4h-4z"/></svg>
                     Scan QR Absen
                   </Link>
                   
                   {isAdmin && (
                     <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/buat-qr" className="px-4 py-2 text-sm text-amber-500 hover:text-amber-400 hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 group-hover:text-amber-400"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h.01"/><path d="M17 7h.01"/><path d="M7 17h.01"/><path d="M17 17h.01"/></svg>
                       Buat QR (Admin)
                     </Link>
                   )}
                </div>
             </div>

             {/* Kategori 3: Dokumen */}
             <div className="mb-6">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Dokumen</p>
                <div className="flex flex-col space-y-1">
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/arsip-surat" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-teal-400"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
                     Arsip Surat & Proposal
                   </Link>
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/materi" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-teal-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                     Materi
                   </Link>
                </div>
             </div>

             {/* Kategori 4: Lainnya */}
             <div className="mb-6">
                <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Lainnya</p>
                <div className="flex flex-col space-y-1">
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/tugas" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-fuchsia-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
                     Task Management
                   </Link>
                   <Link onClick={() => setIsSidebarOpen(false)} href="/dashboard/evaluasi" className="px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors flex items-center gap-3 group">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-hover:text-fuchsia-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                     Evaluasi
                   </Link>
                </div>
             </div>
           </div>

           {/* AREA LOGOUT */}
           <div className="shrink-0 pt-4 border-t border-slate-800">
             <button 
               onClick={handleLogout}
               className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 font-bold hover:bg-rose-500/10 hover:text-rose-400 transition-colors group"
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                 <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
               </svg>
               <span className="text-sm">Keluar (Logout)</span>
             </button>
           </div>
        </div>
      </aside>

      {/* AREA UTAMA (Kanan) */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative bg-[#F4F7FB]">
        
        {/* ================= 3. PERUBAHAN HEADER BIRU (MELENGKUNG, BAYANGAN, & MOTIF) ================= */}
        {/* Header diubah menjadi agak melayang (floating style), tidak menempel kaku ke layar */}
        <div className="p-4 sm:p-6 pb-0 z-20 shrink-0">
          <header className="h-16 bg-gradient-to-r from-[#00199F] to-[#003B9F] rounded-2xl flex items-center justify-between px-4 sm:px-6 shadow-xl relative overflow-hidden">
            
            {/* Ornamen Motif Abstrak (Lingkaran Transparan di Latar) */}
            <div className="absolute -left-6 -top-10 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            <div className="absolute right-20 -bottom-8 w-16 h-16 bg-[#00B4D8]/20 rounded-full blur-lg pointer-events-none"></div>

            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden relative z-10 p-2 -ml-2 text-blue-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
            </button>

            {/* PROFILE HEADER DINAMIS DENGAN WARNA KONTRAS */}
            <div className="relative z-10 flex items-center gap-3 ml-auto cursor-pointer hover:bg-white/10 p-1.5 rounded-xl transition-colors">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-white leading-tight">{userName}</p>
                 <p className="text-[11px] font-semibold text-blue-200">{userRole}</p>
               </div>
               <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#003B9F] font-black text-sm shadow-md uppercase border-2 border-white/20">
                 {userInitial}
               </div>
            </div>
          </header>
        </div>

        {/* Latar Belakang Konten Utama (Bawahnya Header) */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          {children}
        </main>

      </div>
    </div>
  );
}