// File: app/page.tsx
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      
      {/* SISI KIRI (Warna Biru) - Area Branding */}
      <div className="w-full md:w-1/2 bg-[#003B9F] p-10 sm:p-20 flex flex-col justify-between relative overflow-hidden">
         {/* Efek Latar Belakang (Opsional agar tidak terlalu polos) */}
         <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
         
         <div>
           {/* Logo / Ikon IPM */}
           <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center font-bold text-white text-2xl mb-8 border border-white/20 shadow-lg">
             IPM
           </div>
           
           {/* Judul Utama */}
           <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
             Sistem<br/>Manajemen<br/>Modern.
           </h1>
           
           {/* Deskripsi */}
           <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-md">
             Platform digitalisasi administrasi dan keanggotaan Ikatan Pelajar Muhammadiyah SMK Muhammadiyah Belik.
           </p>
         </div>
         
         {/* Footer Kecil Kiri */}
         <div className="mt-20">
           <span className="text-blue-300 font-bold tracking-widest text-xs">EST. 2026</span>
         </div>
      </div>

      {/* SISI KANAN (Warna Putih) - Area Aksi */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-10 sm:p-20 relative">
         <div className="max-w-md w-full">
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-4 flex items-center gap-3">
              Selamat Datang 👋
            </h2>
            <p className="text-slate-500 mb-10 leading-relaxed">
              Silakan masuk ke dalam sistem untuk mengelola data anggota, kalender agenda, dan program kerja organisasi.
            </p>

            {/* Tombol Arah ke Halaman Login */}
            {/* Menggunakan Link dari Next.js agar perpindahan halamannya instan tanpa loading */}
            <Link 
              href="/login"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#003B9F] to-[#007FA7] text-white rounded-xl font-bold text-lg tracking-wide transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,127,167,0.4)] hover:-translate-y-1 group"
            >
              LOGIN
              {/* Ikon Panah yang bergerak saat di-hover */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>

         </div>
      </div>

    </div>
  );
}