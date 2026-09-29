// File: app/dashboard/evaluasi/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function EvaluasiPage() {
  const [evaluasiList, setEvaluasiList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State untuk menyimpan status apakah pengguna adalah admin
  const [isAdmin, setIsAdmin] = useState(false);

  // State untuk form input evaluasi
  const [formData, setFormData] = useState({
    nama_kegiatan: "",
    tanggal_evaluasi: "",
    capaian: "Sesuai Target",
    kendala: "",
    solusi: ""
  });

  // ================= CEK STATUS LOGIN & ROLE =================
  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Jika ada session dan emailnya admin, set isAdmin menjadi true
      // (Pastikan domain di sini sesuai dengan email admin di database Supabase kamu)
      if (session?.user?.email === "admin@ipm.belik") {
        setIsAdmin(true);
      }
    };
    
    checkUserRole();
    fetchEvaluasi();
  }, []);

  // ================= 1. FUNGSI MENARIK DATA EVALUASI =================
  const fetchEvaluasi = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("evaluasi_kegiatan")
      .select("*")
      .order("tanggal_evaluasi", { ascending: false });

    if (!error) {
      setEvaluasiList(data || []);
    }
    setIsLoading(false);
  };

  const tutupModal = () => {
    setIsModalOpen(false);
    setFormData({ nama_kegiatan: "", tanggal_evaluasi: "", capaian: "Sesuai Target", kendala: "", solusi: "" });
  };

  // ================= 2. FUNGSI SIMPAN EVALUASI =================
  const handleSimpanEvaluasi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return; // Keamanan tambahan lapis kedua

    if (!formData.nama_kegiatan || !formData.tanggal_evaluasi || !formData.kendala || !formData.solusi) {
      return alert("Semua kolom wajib diisi!");
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("evaluasi_kegiatan")
      .insert([formData]);

    if (!error) {
      tutupModal();
      fetchEvaluasi();
    } else {
      alert("Gagal menyimpan evaluasi: " + error.message);
    }
    setIsSubmitting(false);
  };

  // ================= 3. FUNGSI HAPUS EVALUASI =================
  const hapusEvaluasi = async (id: number, nama: string) => {
    if (!isAdmin) return; // Keamanan tambahan lapis kedua

    if (window.confirm(`Yakin ingin menghapus laporan evaluasi "${nama}"?`)) {
      const { error } = await supabase.from("evaluasi_kegiatan").delete().eq("id", id);
      if (!error) fetchEvaluasi();
    }
  };

  // Fungsi untuk memberi warna badge berdasarkan capaian
  const warnaCapaian = (capaian: string) => {
    if (capaian === "Sesuai Target") return "bg-emerald-100 text-emerald-700";
    if (capaian === "Kurang Sesuai") return "bg-amber-100 text-amber-700";
    return "bg-rose-100 text-rose-700"; 
  };

  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
      
      {/* TOMBOL KEMBALI */}
      <Link 
        href="/dashboard" 
        className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-amber-600 bg-amber-50 hover:bg-amber-100 transition-colors mb-6 shadow-sm border border-amber-100 group"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
      </Link>

      {/* HEADER & TOMBOL TAMBAH EVALUASI */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800">Evaluasi Kegiatan</h2>
          <p className="text-slate-500 text-sm mt-1">Catatan hambatan dan solusi untuk perbaikan IPM ke depan.</p>
        </div>
        
        {/* Tampilkan tombol HANYA jika yang login adalah admin */}
        {isAdmin && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            Buat Laporan
          </button>
        )}
      </div>

      {/* DAFTAR KARTU EVALUASI */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 font-medium animate-pulse">Memuat laporan evaluasi...</div>
      ) : evaluasiList.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 font-medium">Belum ada laporan evaluasi yang dicatat.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {evaluasiList.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start gap-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 leading-tight mb-1">{item.nama_kegiatan}</h3>
                  <p className="text-xs font-medium text-slate-500">{item.tanggal_evaluasi}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${warnaCapaian(item.capaian)}`}>
                  {item.capaian}
                </span>
              </div>
              
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-extrabold text-rose-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    Kendala / Hambatan
                  </h4>
                  <p className="text-sm text-slate-700 bg-rose-50/50 p-3 rounded-xl border border-rose-100/50">{item.kendala}</p>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
                    Solusi / Tindak Lanjut
                  </h4>
                  <p className="text-sm text-slate-700 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">{item.solusi}</p>
                </div>
              </div>

              {/* Tampilkan tombol Hapus HANYA jika yang login adalah admin */}
              {isAdmin && (
                <div className="px-5 py-3 border-t border-slate-50 bg-slate-50 flex justify-end">
                  <button 
                    onClick={() => hapusEvaluasi(item.id, item.nama_kegiatan)}
                    className="text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                    Hapus Arsip
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* POP-UP FORM TAMBAH EVALUASI (Hanya dirender jika Admin) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-800">Buat Laporan Evaluasi</h3>
              <button onClick={tutupModal} className="text-slate-400 hover:text-rose-500 p-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <form onSubmit={handleSimpanEvaluasi} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Nama Kegiatan / Proker</label>
                  <input type="text" required placeholder="Contoh: Darul Arqam Dasar 2024" value={formData.nama_kegiatan} onChange={(e) => setFormData({...formData, nama_kegiatan: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Tanggal Evaluasi</label>
                    <input type="date" required value={formData.tanggal_evaluasi} onChange={(e) => setFormData({...formData, tanggal_evaluasi: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Status Capaian</label>
                    <select required value={formData.capaian} onChange={(e) => setFormData({...formData, capaian: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none bg-white">
                      <option value="Sesuai Target">Sesuai Target</option>
                      <option value="Kurang Sesuai">Kurang Sesuai</option>
                      <option value="Tidak Sesuai">Tidak Sesuai</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Kendala & Hambatan</label>
                  <textarea required placeholder="Jelaskan masalah yang terjadi di lapangan..." value={formData.kendala} onChange={(e) => setFormData({...formData, kendala: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none min-h-[100px]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Solusi & Tindak Lanjut</label>
                  <textarea required placeholder="Rekomendasi untuk panitia periode selanjutnya..." value={formData.solusi} onChange={(e) => setFormData({...formData, solusi: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-amber-500 outline-none min-h-[100px]" />
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                  <button type="button" onClick={tutupModal} className="px-5 py-2.5 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl text-sm shadow-md disabled:opacity-70">
                    {isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
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