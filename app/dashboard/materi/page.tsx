// File: app/dashboard/materi/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function MateriPage() {
  const [materiList, setMateriList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({ judul: "", tanggal: "", link_file: "" });

  const fetchMateri = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from("materi_pembelajaran").select("*").order("tanggal", { ascending: false });
    if (!error) setMateriList(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "admin@ipm.belik") setIsAdmin(true);
    };

    checkUserRole();
    fetchMateri();
  }, []);

  const tutupModal = () => {
    setIsModalOpen(false);
    setFormData({ judul: "", tanggal: "", link_file: "" });
  };

  const handleSimpanMateri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.judul || !formData.tanggal || !formData.link_file) return alert("Semua kolom wajib diisi!");

    setIsSubmitting(true);
    const { error } = await supabase.from("materi_pembelajaran").insert([formData]);

    if (!error) {
      alert("Materi pembelajaran berhasil ditambahkan!");
      tutupModal();
      fetchMateri();
    } else {
      alert("Gagal menyimpan: " + error.message);
    }
    setIsSubmitting(false);
  };

  const handleHapusMateri = async (id: number, judul: string) => {
    if (!isAdmin) return; 
    if (!window.confirm(`Yakin ingin menghapus materi "${judul}"?`)) return;

    const { error } = await supabase.from("materi_pembelajaran").delete().eq("id", id);
    if (!error) fetchMateri();
  };

  return (
    // PERUBAHAN 1: Penguncian Tinggi Halaman & Menyembunyikan Overflow Eksternal
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative flex flex-col h-[calc(100vh-6rem)] sm:h-auto overflow-hidden">
      
      {/* AREA HEADER (Tetap Diam Saat Scroll) */}
      <div className="shrink-0 mb-4 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-0 sm:border-0">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-[#007FA7] bg-cyan-50 hover:bg-cyan-100 transition-colors mb-4 shadow-sm border border-cyan-100 group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-800">Materi Pembelajaran</h2>
            <p className="text-slate-500 text-[10px] sm:text-sm mt-0.5">Pusat modul, PPT kajian, dan panduan perkaderan IPM.</p>
          </div>
          
          {/* TOMBOL TAMBAH MATERI (Hanya Admin) */}
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#007FA7] hover:bg-[#006080] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              Tambah Materi Baru
            </button>
          )}
        </div>
      </div>

      {/* PERUBAHAN 2: AREA TABEL (Bisa Di-Scroll di HP) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          
          {/* Kepala Tabel Dibuat Lengket (Sticky) */}
          <thead className="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-slate-100">
            <tr className="bg-gradient-to-r from-[#007FA7] to-[#0099cc] text-white text-[10px] sm:text-xs uppercase tracking-wider">
              <th className="p-3 sm:p-4 font-bold sm:rounded-tl-xl whitespace-nowrap border-r border-white/10">Judul Materi</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap border-r border-white/10">Tanggal Upload</th>
              <th className="p-3 sm:p-4 font-bold text-center sm:rounded-tr-xl whitespace-nowrap">Aksi / Link</th>
            </tr>
          </thead>
          
          <tbody className="text-xs sm:text-sm text-slate-700">
            {isLoading ? (
              <tr><td colSpan={3} className="p-8 text-center text-slate-400 font-medium animate-pulse">Memuat daftar materi...</td></tr>
            ) : materiList.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-12 text-center border-b border-slate-100">
                  <p className="font-medium text-slate-500">Belum ada materi pembelajaran.</p>
                </td>
              </tr>
            ) : (
              materiList.map((materi) => (
                <tr key={materi.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 sm:p-4 font-bold text-slate-800 whitespace-nowrap truncate max-w-[200px] sm:max-w-none">{materi.judul}</td>
                  <td className="p-3 sm:p-4 whitespace-nowrap font-mono text-[10px] sm:text-xs text-slate-500">{materi.tanggal}</td>
                  <td className="p-3 sm:p-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      
                      {/* Tombol Buka Link Materi (Bisa diakses Semua Orang) */}
                      <a 
                        href={materi.link_file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-[10px] sm:text-xs font-bold"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        Buka
                      </a>
                      
                      {/* TOMBOL HAPUS MATERI (Hanya Admin) */}
                      {isAdmin && (
                        <button 
                          onClick={() => handleHapusMateri(materi.id, materi.judul)}
                          className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 bg-slate-50 rounded-lg transition-colors"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* POP-UP FORM TAMBAH MATERI (Hanya dirender jika Admin) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100">
              <h3 className="font-bold text-base sm:text-lg text-slate-800">Tambah Materi Baru</h3>
              <button onClick={tutupModal} className="text-slate-400 hover:text-rose-500 p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <form onSubmit={handleSimpanMateri} className="flex flex-col gap-3 sm:gap-4 mb-2">
                
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Judul Materi</label>
                  <input type="text" required placeholder="Contoh: Modul Taruna Melati 1" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Tanggal</label>
                  <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Link Google Drive</label>
                  <input type="url" required placeholder="https://drive.google.com/file/d/..." value={formData.link_file} onChange={(e) => setFormData({...formData, link_file: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button type="button" onClick={tutupModal} className="w-full sm:w-auto px-5 py-2 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs sm:text-sm">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-5 py-2 font-bold text-white bg-[#007FA7] hover:bg-[#006080] rounded-xl text-xs sm:text-sm shadow-md disabled:opacity-70">
                    {isSubmitting ? "Menyimpan..." : "Simpan Materi"}
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