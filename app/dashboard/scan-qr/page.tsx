// File: app/dashboard/scan-qr/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
// Memanggil alat Kamera Scanner yang tadi kita install
import { Scanner } from "@yudiel/react-qr-scanner";

export default function ScanQRPage() {
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [namaAnggota, setNamaAnggota] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. FUNGSI KETIKA KAMERA BERHASIL MEMBACA QR CODE
  const handleScan = (result: any) => {
    if (result) {
      // Library QR kadang mengembalikan Array, kadang String (tergantung versi)
      const kode = Array.isArray(result) ? result[0].rawValue : result;
      
      // Jika kodenya berbeda dengan yang sedang diproses, maka proses!
      if (kode && kode !== scannedCode) {
        // Hentikan scan sementara, simpan kodenya, buka Pop-up nama
        setScannedCode(kode);
        setIsModalOpen(true);
      }
    }
  };

  // 2. FUNGSI MENYIMPAN KEHADIRAN KE SUPABASE
  const handleSimpanAbsen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAnggota) return alert("Nama wajib diisi!");

    setIsSubmitting(true);

    try {
      // Langkah A: Cari tahu ini acara (sesi) nomor berapa berdasarkan Kode QR-nya
      const { data: sesiData, error: sesiError } = await supabase
        .from("sesi_absen")
        .select("id, judul")
        .eq("kode_qr", scannedCode)
        .single(); // Ambil 1 data yang cocok

      if (sesiError || !sesiData) {
        alert("QR Code tidak valid atau acara sudah dihapus!");
        tutupModal();
        return;
      }

      // Mendapatkan waktu saat ini
      const waktuSekarang = new Date().toLocaleString("id-ID");

      // Langkah B: Simpan ke tabel 'kehadiran'
      const { error: absenError } = await supabase
        .from("kehadiran")
        .insert([{
          sesi_id: sesiData.id,
          nama_anggota: namaAnggota,
          waktu_absen: waktuSekarang
        }]);

      if (absenError) {
        alert("Gagal menyimpan absen: " + absenError.message);
      } else {
        alert(`Berhasil! ${namaAnggota} tercatat hadir di acara: ${sesiData.judul}`);
        tutupModal();
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    }

    setIsSubmitting(false);
  };

  // 3. FUNGSI MENUTUP MODAL DAN MENYALAKAN KAMERA LAGI
  const tutupModal = () => {
    setIsModalOpen(false);
    setScannedCode(null); // Reset kode agar kamera bisa scan lagi
    setNamaAnggota("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative min-h-screen">
      
      {/* ================= TOMBOL KEMBALI ================= */}
      <Link 
        href="/dashboard" 
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors mb-6 shadow-sm border border-teal-100 group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
      </Link>

      {/* ================= HEADER HALAMAN ================= */}
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800">Scan QR Absen</h2>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Arahkan kamera ke QR Code Acara untuk mencatat kehadiran.</p>
      </div>

      {/* ================= AREA KAMERA SCANNER ================= */}
      <div className="flex flex-col items-center justify-center bg-slate-900 rounded-3xl p-4 sm:p-8 max-w-md mx-auto relative overflow-hidden shadow-2xl border-4 border-slate-800">
        
        {/* Ornamen Bingkai Kamera */}
        <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-teal-400 rounded-tl-xl z-10"></div>
        <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-teal-400 rounded-tr-xl z-10"></div>
        <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-teal-400 rounded-bl-xl z-10"></div>
        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-teal-400 rounded-br-xl z-10"></div>

        {/* Komponen Kamera */}
        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black relative">
          {!isModalOpen ? (
            <Scanner 
              onScan={handleScan}
              components={{
                audio: false, // Matikan suara beep bawaan
                finder: false // Kita pakai bingkai kustom di atas
              }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white flex-col gap-3">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400 animate-bounce"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p className="font-bold tracking-wide">QR Terdeteksi!</p>
            </div>
          )}
        </div>
        <p className="text-slate-400 text-xs mt-6 font-mono tracking-widest text-center">SCANNING SYSTEM ACTIVE</p>
      </div>

      {/* ================= POP-UP KONFIRMASI NAMA ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="bg-teal-500 p-5 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
              <h3 className="font-extrabold text-xl text-white relative z-10">Konfirmasi Kehadiran</h3>
              <p className="text-teal-100 text-xs mt-1 relative z-10">Masukkan nama untuk absen</p>
            </div>

            <div className="p-6">
              <form onSubmit={handleSimpanAbsen} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Nama Anda</label>
                  <input 
                    type="text" 
                    required
                    autoFocus
                    placeholder="Contoh: Ahmad Fadhil"
                    value={namaAnggota}
                    onChange={(e) => setNamaAnggota(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 transition-all text-slate-800 font-bold"
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70"
                  >
                    {isSubmitting ? "Menyimpan..." : "Hadir!"}
                  </button>
                  <button 
                    type="button"
                    onClick={tutupModal}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-3 rounded-xl transition-all"
                  >
                    Batal Scan
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}