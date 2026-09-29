// File: app/dashboard/struktur/page.tsx
import Link from "next/link";

export default function StrukturOrganisasiPage() {
  const dataBidang = [
    { 
      nama: "Perkaderan", ketua: "Rita Rifatun Hasanah", warnaBatas: "border-blue-400", warnaIkon: "text-blue-500", bgIkon: "bg-blue-50",
      ikon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    { 
      nama: "PIP", ketua: "Farhan Fauzan", warnaBatas: "border-indigo-400", warnaIkon: "text-indigo-500", bgIkon: "bg-indigo-50",
      ikon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
    },
    { 
      nama: "KDI", ketua: "Febi Oktavianti", warnaBatas: "border-teal-400", warnaIkon: "text-teal-500", bgIkon: "bg-teal-50",
      ikon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
    },
    { 
      nama: "Advokasi", ketua: "Zalfa Khaulia", warnaBatas: "border-rose-400", warnaIkon: "text-rose-500", bgIkon: "bg-rose-50",
      ikon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>
    },
    { 
      nama: "ASBO", ketua: "Deny Rifiansah", warnaBatas: "border-orange-400", warnaIkon: "text-orange-500", bgIkon: "bg-orange-50",
      ikon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
    },
    { 
      nama: "PKK", ketua: "Elsa Fitri Ariyani", warnaBatas: "border-pink-400", warnaIkon: "text-pink-500", bgIkon: "bg-pink-50",
      ikon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>
    },
  ];

  return (
    // PERUBAHAN 1: Penguncian Tinggi Layar & Overflow
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative flex flex-col h-[calc(100vh-6rem)] sm:h-auto overflow-hidden">
      
      {/* AREA HEADER (Tetap Diam Saat Scroll) */}
      <div className="shrink-0 mb-4 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-0 sm:border-0">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-[#003B9F] bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm border border-blue-100 group shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          </Link>
          <div>
            <h2 className="text-lg sm:text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">Struktur Organisasi</h2>
            <p className="text-slate-500 text-[10px] sm:text-sm mt-0.5 sm:mt-2">Susunan Kepemimpinan dan Bidang Pimpinan Ranting IPM.</p>
          </div>
        </div>
      </div>

      {/* PERUBAHAN 2: AREA KONTEN (Hanya Bagian Ini yang Bisa Di-Scroll) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
        
        <div className="flex flex-col items-center bg-slate-50/50 py-8 sm:py-10 px-2 sm:px-8 rounded-2xl sm:rounded-3xl border border-slate-100 relative overflow-hidden h-max min-h-full">
          
          {/* Latar Belakang Dekoratif */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-64 bg-gradient-to-b from-blue-50 to-transparent blur-3xl -z-10"></div>

          {/* ================= LEVEL 1: PEMBINA ================= */}
          <div className="flex flex-col items-center z-10">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-xl w-56 sm:w-64 text-center transform transition-transform hover:scale-105 border border-slate-700">
              <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Pembina IPM</p>
              <h4 className="font-extrabold text-base sm:text-lg">Fauzan Amiruloh S.Pd.</h4>
            </div>
            <div className="w-0.5 h-8 sm:h-10 bg-slate-300"></div>
          </div>

          {/* ================= LEVEL 2: PIMPINAN HARIAN ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl relative z-10">
            
            <div className="hidden md:block absolute top-0 left-[16.5%] right-[16.5%] h-0.5 bg-slate-300"></div>

            {/* KARTU SEKRETARIS */}
            <div className="flex flex-col items-center order-2 md:order-1">
              <div className="hidden md:block w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm w-full max-w-[240px] sm:max-w-[260px] text-center border-t-4 border-t-amber-400 border-x-2 border-b-2 border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 sm:w-5 sm:h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Sekretaris Umum</p>
                <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">Al Fahri Saputra</h4>
              </div>
            </div>

            {/* KARTU KETUA UMUM */}
            <div className="flex flex-col items-center order-1 md:order-2">
              <div className="hidden md:block w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-gradient-to-br from-[#003B9F] to-[#007FA7] text-white p-4 sm:p-5 rounded-2xl shadow-lg w-full max-w-[260px] sm:max-w-[280px] text-center md:-mt-3 border border-blue-400 transform transition-transform hover:scale-105 z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-2 sm:mb-3 backdrop-blur-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white sm:w-6 sm:h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-blue-200 mb-1">Ketua Umum</p>
                <h4 className="font-extrabold text-base sm:text-lg">Abid Wal Husnuzhan</h4>
              </div>
              <div className="w-0.5 h-8 md:h-14 bg-slate-300 mt-6 md:mt-0"></div>
            </div>

            {/* KARTU BENDAHARA */}
            <div className="flex flex-col items-center order-3 md:order-3">
              <div className="hidden md:block w-0.5 h-6 bg-slate-300"></div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm w-full max-w-[240px] sm:max-w-[260px] text-center border-t-4 border-t-emerald-400 border-x-2 border-b-2 border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 sm:w-10 sm:h-10 mx-auto bg-emerald-50 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 sm:w-5 sm:h-5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Bendahara Umum</p>
                <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">Rizqi Nafila Azzahro</h4>
              </div>
            </div>

          </div>

          {/* ================= LEVEL 3: 6 BIDANG ================= */}
          <div className="w-full max-w-5xl relative z-10 mt-6 md:-mt-4">
            
            <div className="hidden md:block absolute top-0 left-[16%] right-[16%] h-0.5 bg-slate-300"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 pt-0 md:pt-6 w-full max-w-[260px] sm:max-w-none mx-auto">
              
              {dataBidang.map((bidang, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  
                  {index < 3 && <div className="hidden md:block w-0.5 h-6 bg-slate-300 absolute -top-6"></div>}
                  
                  <div className={`bg-white p-4 sm:p-5 rounded-2xl shadow-sm w-full text-center border-t-4 ${bidang.warnaBatas} border-x-2 border-b-2 border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden group`}>
                    
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 mx-auto ${bidang.bgIkon} ${bidang.warnaIkon} rounded-full flex items-center justify-center mb-2 sm:mb-3`}>
                      {bidang.ikon}
                    </div>
                    
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Bidang {bidang.nama}</p>
                    <h4 className="font-extrabold text-slate-700 text-sm">{bidang.ketua}</h4>
                  </div>
                </div>
              ))}
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}