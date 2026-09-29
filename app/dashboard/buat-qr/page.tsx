// File: app/dashboard/buat-qr/page.tsx
"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { supabase } from "../../../lib/supabase"; 
import { QRCodeSVG } from "qrcode.react";

export default function BuatQRPage() {
  const [sesiList, setSesiList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ================= 1. STATE UNTUK SATPAM (ROLE CHECK) =================
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  // State untuk form input acara
  const [formData, setFormData] = useState({
    judul: "",
    tanggal: ""
  });

  useEffect(() => {
    // Mengecek siapa yang sedang login
    const checkUserRole = async () => {
      setIsCheckingRole(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.email === "admin@ipm.belik") {
        setIsAdmin(true);
        fetchSesi(); // Hanya ambil data jika terbukti admin
      }
      setIsCheckingRole(false);
    };

    checkUserRole();
  }, []);

  const fetchSesi = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("sesi_absen")
      .select("*")
      .order("id", { ascending: false }); 

    if (error) {
      console.error("Gagal menarik data sesi:", error);
    } else {
      setSesiList(data || []);
    }
    setIsLoading(false);
  };

  const handleBuatQR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return; // Keamanan ekstra

    if (!formData.judul || !formData.tanggal) {
      return alert("Judul Acara dan Tanggal wajib diisi!");
    }

    setIsSubmitting(true);

    const kodeUnik = `IPM-ABSEN-${Date.now()}`;

    const { error } = await supabase
      .from("sesi_absen")
      .insert([{
        judul: formData.judul,
        tanggal: formData.tanggal,
        kode_qr: kodeUnik 
      }]);

    if (error) {
      alert("Gagal membuat QR Code: " + error.message);
    } else {
      alert("Sesi Absen & QR Code berhasil dibuat!");
      setFormData({ judul: "", tanggal: "" }); 
      fetchSesi(); 
    }
    
    setIsSubmitting(false);
  };

  const handleHapusSesi = async (id: number, judul: string) => {
    if (!isAdmin) return; // Keamanan ekstra

    const confirm = window.confirm(`Yakin ingin menghapus sesi absensi "${judul}"? Semua data kehadiran untuk acara ini juga akan hilang (nanti kita atur relasinya).`);
    if (!confirm) return;

    const { error } = await supabase
      .from("sesi_absen")
      .delete()
      .eq("id", id);

    if (!error) {
      fetchSesi();
    }
  };

  // ================= TAMPILAN JIKA SATPAM SEDANG MENGECEK =================
  if (isCheckingRole) {
    return <div className="min-h-screen p-10 text-center text-slate-500 font-medium animate-pulse">Memeriksa Hak Akses...</div>;
  }

  // ================= TAMPILAN JIKA BUKAN ADMIN (ACCESS DENIED) =================
  if (!isAdmin) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 sm:p-12 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 text-rose-500">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-2">Akses Ditolak!</h2>
        <p className="text-slate-500 max-w-md mb-8">Maaf, halaman ini hanya diperuntukkan bagi Administrator untuk membuat QR Code absensi.</p>
        <Link 
          href="/dashboard" 
          className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-md active:scale-95"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // ================= TAMPILAN NORMAL (JIKA ADMIN) =================
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative min-h-screen">
      
      <Link 
        href="/dashboard" 
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors mb-6 shadow-sm border border-orange-100 group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
      </Link>

      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">Buat QR Absen (Admin)</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Buat sesi absensi baru untuk menampilkan QR Code acara.</p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-10">
        <form onSubmit={handleBuatQR} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nama Acara / Kajian</label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Rapat Pleno 1"
              value={formData.judul}
              onChange={(e) => setFormData({...formData, judul: e.target.value})}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-all text-slate-700"
            />
          </div>
          
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Tanggal Acara</label>
            <input 
              type="date" 
              required
              value={formData.tanggal}
              onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-all text-slate-700"
            />
          </div>

          <div className="md:col-span-1">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-70"
            >
              {isSubmitting ? "Membuat..." : "Buat QR Code Baru"}
            </button>
          </div>
        </form>
      </div>

      <div>
        <h3 className="font-bold text-lg text-slate-700 mb-4 border-b border-slate-100 pb-2">Daftar Sesi Absensi Aktif</h3>
        
        {isLoading ? (
          <p className="text-slate-400 text-sm animate-pulse">Memuat data sesi absensi...</p>
        ) : sesiList.length === 0 ? (
          <div className="bg-slate-50 p-8 text-center rounded-2xl border border-slate-200 border-dashed">
            <p className="text-slate-500 text-sm">Belum ada sesi absensi yang dibuat.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sesiList.map((sesi) => (
              <div key={sesi.id} className="bg-white border-2 border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col items-center text-center">
                
                <button 
                  onClick={() => handleHapusSesi(sesi.id, sesi.judul)}
                  className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                  title="Hapus Acara"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>

                <h4 className="font-extrabold text-slate-800 text-lg mb-1 pr-6">{sesi.judul}</h4>
                <p className="text-slate-500 text-xs font-medium mb-4 bg-slate-100 px-3 py-1 rounded-full">{sesi.tanggal}</p>
                
                <div className="bg-white p-3 rounded-xl shadow-inner border border-slate-200 mb-4 inline-block">
                  <QRCodeSVG value={sesi.kode_qr} size={160} level="M" />
                </div>
                
                <p className="text-[9px] text-slate-400 font-mono tracking-widest bg-slate-50 px-2 py-1 rounded">ID: {sesi.kode_qr}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}