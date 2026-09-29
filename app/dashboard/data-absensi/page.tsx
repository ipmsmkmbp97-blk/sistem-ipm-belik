// File: app/dashboard/data-absensi/page.tsx
"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { supabase } from "../../../lib/supabase"; 

export default function DataAbsensiPage() {
  const [absensiList, setAbsensiList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); 

  // FUNGSI MENARIK & MENGGABUNGKAN DATA ABSENSI
  const fetchDataAbsensi = async () => {
    setIsLoading(true);
    
    try {
      const { data: dataKehadiran, error: errKehadiran } = await supabase
        .from("kehadiran")
        .select("*")
        .order("id", { ascending: false });

      const { data: dataSesi, error: errSesi } = await supabase
        .from("sesi_absen")
        .select("id, judul, tanggal");

      if (errKehadiran || errSesi) throw new Error("Gagal menarik data");

      const gabunganData = (dataKehadiran || []).map((absen) => {
        const acara = (dataSesi || []).find((s) => s.id === absen.sesi_id);
        return {
          ...absen,
          judul_acara: acara ? acara.judul : "Acara Telah Dihapus",
          tanggal_acara: acara ? acara.tanggal : "-"
        };
      });

      setAbsensiList(gabunganData);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memuat data absensi.");
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDataAbsensi();
  }, []);

  return (
    // PERUBAHAN 1: Penguncian Tinggi Halaman & Menyembunyikan Overflow Eksternal
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative flex flex-col h-[calc(100vh-6rem)] sm:h-auto overflow-hidden">
      
      {/* AREA HEADER (Tetap Diam Saat Scroll) */}
      <div className="shrink-0 mb-4 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-0 sm:border-0">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors mb-4 shadow-sm border border-teal-100 group"
          title="Kembali ke Dashboard Utama"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-800">Rekap Data Absensi</h2>
            <p className="text-slate-500 text-[10px] sm:text-sm mt-0.5">Pantau daftar kehadiran anggota secara real-time dari hasil Scan QR.</p>
          </div>
          
          <button 
            onClick={fetchDataAbsensi}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Segarkan Data
          </button>
        </div>
      </div>

      {/* PERUBAHAN 2: AREA TABEL (Bisa Di-Scroll di HP) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          
          {/* Kepala Tabel Dibuat Lengket (Sticky) */}
          <thead className="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-slate-100">
            <tr className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] sm:text-xs uppercase tracking-wider">
              <th className="p-3 sm:p-4 font-bold sm:rounded-tl-xl whitespace-nowrap border-r border-white/10">No</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap border-r border-white/10">Nama Anggota</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap border-r border-white/10">Acara / Kajian</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap border-r border-white/10">Tanggal Acara</th>
              <th className="p-3 sm:p-4 font-bold text-center sm:rounded-tr-xl whitespace-nowrap">Waktu Scan (Hadir)</th>
            </tr>
          </thead>
          
          <tbody className="text-xs sm:text-sm text-slate-700">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 font-medium animate-pulse">
                  Menarik data kehadiran...
                </td>
              </tr>
            ) : absensiList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                  Belum ada data absensi. Silakan buat QR dan lakukan scan.
                </td>
              </tr>
            ) : (
              absensiList.map((absen, index) => (
                <tr key={absen.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 sm:p-4 text-slate-400 font-medium whitespace-nowrap">{index + 1}</td>
                  
                  {/* Nama Anggota yang Hadir */}
                  <td className="p-3 sm:p-4 font-bold text-slate-800 whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
                        {absen.nama_anggota.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{absen.nama_anggota}</span>
                    </div>
                  </td>
                  
                  {/* Info Acara */}
                  <td className="p-3 sm:p-4 whitespace-nowrap font-medium text-slate-600 truncate max-w-[120px] sm:max-w-none">{absen.judul_acara}</td>
                  <td className="p-3 sm:p-4 whitespace-nowrap">{absen.tanggal_acara}</td>
                  
                  {/* Waktu Absen */}
                  <td className="p-3 sm:p-4 whitespace-nowrap text-center">
                    <span className="bg-emerald-50 text-emerald-600 font-mono text-[10px] sm:text-xs px-2 py-1 rounded-md border border-emerald-100">
                      {absen.waktu_absen}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}