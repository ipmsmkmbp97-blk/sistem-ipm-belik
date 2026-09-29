// File: app/dashboard/arsip-surat/page.tsx
"use client"; 

import { useState, useEffect } from "react";
import Link from "next/link"; 
import { supabase } from "../../../lib/supabase"; 

export default function ArsipDokumenPage() {
  const [dokumenList, setDokumenList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({
    jenis: "Surat Masuk",
    nomor_surat: "",
    judul: "",
    tanggal: "",
    link_drive: ""
  });

  const fetchDokumen = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("arsip_dokumen")
      .select("*")
      .order("tanggal", { ascending: false }); 

    if (error) {
      console.error("Gagal menarik data dokumen:", error);
    } else {
      setDokumenList(data || []); 
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "admin@ipm.belik") {
        setIsAdmin(true);
      }
    };

    checkUserRole();
    fetchDokumen();
  }, []);

  const tutupModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ jenis: "Surat Masuk", nomor_surat: "", judul: "", tanggal: "", link_drive: "" });
  };

  const handleSimpanData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return; 

    if (!formData.judul || !formData.tanggal || !formData.link_drive) {
      return alert("Judul, Tanggal, dan Link Drive wajib diisi!");
    }

    setIsSubmitting(true);

    if (editingId !== null) {
      const { error } = await supabase.from("arsip_dokumen").update({ jenis: formData.jenis, nomor_surat: formData.nomor_surat, judul: formData.judul, tanggal: formData.tanggal, link_drive: formData.link_drive }).eq("id", editingId);
      if (!error) { alert("Dokumen berhasil diperbarui!"); tutupModal(); fetchDokumen(); } else { alert("Gagal update: " + error.message); }
    } else {
      const { error } = await supabase.from("arsip_dokumen").insert([formData]);
      if (!error) { alert("Dokumen baru berhasil diarsipkan!"); tutupModal(); fetchDokumen(); } else { alert("Gagal menyimpan: " + error.message); }
    }
    setIsSubmitting(false);
  };

  const handleHapusClick = async (id: number, judul: string) => {
    if (!isAdmin) return; 
    const confirmDelete = window.confirm(`Yakin ingin menghapus arsip "${judul}"? (Ini hanya menghapus data di web, file asli di Google Drive tetap aman).`);
    if (!confirmDelete) return;

    const { error } = await supabase.from("arsip_dokumen").delete().eq("id", id);
    if (!error) fetchDokumen();
  };

  return (
    // PERUBAHAN 1: Penguncian Tinggi Halaman & Menyembunyikan Overflow Eksternal
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative flex flex-col h-[calc(100vh-6rem)] sm:h-auto overflow-hidden">
      
      {/* AREA HEADER (Tetap Diam Saat Scroll) */}
      <div className="shrink-0 mb-4 sm:mb-8 border-b border-slate-100 pb-4 sm:pb-0 sm:border-0">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-[#003B9F] bg-blue-50 hover:bg-blue-100 transition-colors mb-4 shadow-sm border border-blue-100 group"
          title="Kembali ke Dashboard Utama"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-800">Arsip Surat & Proposal</h2>
            <p className="text-slate-500 text-[10px] sm:text-sm mt-0.5">Pusat digitalisasi dokumen, persuratan, dan proposal IPM.</p>
          </div>
          
          {/* TOMBOL TAMBAH HANYA UNTUK ADMIN */}
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#003B9F] hover:bg-[#002870] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Unggah Dokumen
            </button>
          )}
        </div>
      </div>

      {/* PERUBAHAN 2: AREA TABEL (Bisa Di-Scroll di HP) */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          
          {/* Kepala Tabel Dibuat Lengket (Sticky) */}
          <thead className="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-slate-100">
            <tr className="bg-gradient-to-r from-[#003B9F] to-[#006090] text-white text-[10px] sm:text-xs uppercase tracking-wider">
              <th className="p-3 sm:p-4 font-bold sm:rounded-tl-xl whitespace-nowrap border-r border-white/10">Jenis</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap border-r border-white/10">Nomor Surat</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap border-r border-white/10">Judul / Perihal</th>
              <th className="p-3 sm:p-4 font-bold whitespace-nowrap border-r border-white/10">Tanggal</th>
              <th className="p-3 sm:p-4 font-bold text-center sm:rounded-tr-xl whitespace-nowrap">Aksi / Link</th>
            </tr>
          </thead>
          
          <tbody className="text-xs sm:text-sm text-slate-700">
            {isLoading ? (
              <tr><td colSpan={5} className="p-8 text-center text-slate-400 font-medium animate-pulse">Memuat brankas arsip...</td></tr>
            ) : dokumenList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center border-b border-slate-100">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 sm:w-12 sm:h-12"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4"/><polyline points="14 2 14 8 20 8"/><path d="M2 15h10"/><path d="m9 18 3-3-3-3"/></svg>
                    <p className="font-medium text-slate-500 text-xs sm:text-sm">Brankas arsip masih kosong.</p>
                  </div>
                </td>
              </tr>
            ) : (
              dokumenList.map((dok) => (
                <tr key={dok.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-3 sm:p-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                      dok.jenis === 'Surat Keluar' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                      dok.jenis === 'Surat Masuk' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {dok.jenis}
                    </span>
                  </td>
                  <td className="p-3 sm:p-4 whitespace-nowrap font-mono text-[10px] sm:text-xs text-slate-500">{dok.nomor_surat || '-'}</td>
                  <td className="p-3 sm:p-4 font-bold text-slate-800 whitespace-nowrap truncate max-w-[150px] sm:max-w-none">{dok.judul}</td>
                  <td className="p-3 sm:p-4 whitespace-nowrap font-medium text-slate-600">{dok.tanggal}</td>
                  <td className="p-3 sm:p-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      
                      {/* Tombol Buka Link Google Drive */}
                      <a 
                        href={dok.link_drive} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors bg-blue-50/50"
                        title="Buka Dokumen"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                      
                      {/* TOMBOL EDIT & HAPUS HANYA UNTUK ADMIN */}
                      {isAdmin && (
                        <>
                          <button 
                            onClick={() => {
                              setEditingId(dok.id);
                              setFormData({ jenis: dok.jenis, nomor_surat: dok.nomor_surat, judul: dok.judul, tanggal: dok.tanggal, link_drive: dok.link_drive });
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 bg-slate-50 rounded-lg transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                          </button>
                          <button 
                            onClick={() => handleHapusClick(dok.id, dok.judul)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 bg-slate-50 rounded-lg transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-4 sm:h-4"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </button>
                        </>
                      )}
                      
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* POP-UP FORM DOKUMEN (Hanya dirender jika Admin) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100">
              <h3 className="font-bold text-base sm:text-lg text-slate-800">{editingId ? "Edit Arsip" : "Arsipkan Dokumen Baru"}</h3>
              <button onClick={tutupModal} className="text-slate-400 hover:text-rose-500 p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <form onSubmit={handleSimpanData} className="flex flex-col gap-3 sm:gap-4 mb-2">
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Jenis</label>
                    <select value={formData.jenis} onChange={(e) => setFormData({...formData, jenis: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:border-[#007FA7] outline-none">
                      <option value="Surat Masuk">Surat Masuk</option>
                      <option value="Surat Keluar">Surat Keluar</option>
                      <option value="Proposal">Proposal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">No. Surat (Opsional)</label>
                    <input type="text" placeholder="Contoh: 01/IPM/26" value={formData.nomor_surat} onChange={(e) => setFormData({...formData, nomor_surat: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Judul / Perihal</label>
                  <input type="text" required placeholder="Contoh: Undangan Rapat Pleno" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Tanggal Surat</label>
                  <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Link Google Drive</label>
                  <input type="url" required placeholder="https://drive.google.com/file/d/..." value={formData.link_drive} onChange={(e) => setFormData({...formData, link_drive: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button type="button" onClick={tutupModal} className="w-full sm:w-auto px-5 py-2 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs sm:text-sm">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-5 py-2 font-bold text-white bg-[#003B9F] hover:bg-[#002870] rounded-xl text-xs sm:text-sm shadow-md disabled:opacity-70">
                    {isSubmitting ? "Menyimpan..." : "Simpan Arsip"}
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