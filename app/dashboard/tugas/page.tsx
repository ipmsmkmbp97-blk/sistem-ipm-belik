// File: app/dashboard/tugas/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function TugasPage() {
  const [tugasList, setTugasList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk Satpam
  const [isAdmin, setIsAdmin] = useState(false);

  // State untuk form input tugas
  const [formData, setFormData] = useState({
    nama_tugas: "",
    penanggung_jawab: "",
    deadline: ""
  });

  const fetchTugas = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tugas_kegiatan")
      .select("*")
      .order("deadline", { ascending: true });

    if (!error) {
      setTugasList(data || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Mengecek siapa yang sedang login
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "admin@ipm.belik") {
        setIsAdmin(true);
      }
    };
    checkUserRole();
    fetchTugas();
  }, []);

  const tutupModal = () => {
    setIsModalOpen(false);
    setFormData({ nama_tugas: "", penanggung_jawab: "", deadline: "" });
  };

  const handleSimpanTugas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return; // Kunci Keamanan
    if (!formData.nama_tugas || !formData.penanggung_jawab || !formData.deadline) {
      return alert("Semua kolom wajib diisi!");
    }

    setIsSubmitting(true);

    const { error } = await supabase
      .from("tugas_kegiatan")
      .insert([{ 
        nama_tugas: formData.nama_tugas,
        penanggung_jawab: formData.penanggung_jawab,
        deadline: formData.deadline,
        status: "Belum Mulai"
      }]);

    if (!error) {
      tutupModal();
      fetchTugas();
    } else {
      alert("Gagal menyimpan tugas: " + error.message);
    }
    setIsSubmitting(false);
  };

  const updateStatus = async (id: number, statusBaru: string) => {
    if (!isAdmin) return; // Kunci Keamanan
    const { error } = await supabase
      .from("tugas_kegiatan")
      .update({ status: statusBaru })
      .eq("id", id);
      
    if (!error) fetchTugas();
  };

  const hapusTugas = async (id: number) => {
    if (!isAdmin) return; // Kunci Keamanan
    if (window.confirm("Yakin ingin menghapus tugas ini secara permanen?")) {
      const { error } = await supabase.from("tugas_kegiatan").delete().eq("id", id);
      if (!error) fetchTugas();
    }
  };

  // Pengelompokan Data
  const belumMulai = tugasList.filter(t => t.status === "Belum Mulai");
  const sedangDikerjakan = tugasList.filter(t => t.status === "Sedang Dikerjakan");
  const selesai = tugasList.filter(t => t.status === "Selesai");

  return (
    // Membatasi tinggi halaman dan mematikan overflow vertikal (Scroll atas-bawah)
    <div className="bg-slate-50 flex flex-col h-[calc(100vh-6rem)] sm:h-auto sm:min-h-screen p-2 sm:p-8">
      
      <div className="max-w-6xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-8 relative flex flex-col h-full overflow-hidden">
        
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
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Task Management</h2>
              <p className="text-slate-500 text-[10px] sm:text-sm mt-0.5">Pantau progres pekerjaan dan penanggung jawabnya.</p>
            </div>
            
            {/* Tombol Tambah hanya tampil untuk Admin */}
            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#007FA7] hover:bg-[#006080] text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                Tambah Tugas
              </button>
            )}
          </div>
        </div>

        {/* PAPAN KANBAN (Disesuaikan agar horizontal di HP) */}
        {/* flex-1 agar memenuhi sisa layar, overflow-x-auto agar bisa digeser (swipe) menyamping */}
        <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden custom-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
          
          <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-6 h-full pb-4 sm:pb-0 w-max sm:w-auto">
            
            {/* KOLOM 1: BELUM MULAI */}
            <div className="bg-slate-100/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-inner flex flex-col w-[280px] sm:w-auto shrink-0 h-full overflow-hidden">
              <div className="flex items-center justify-between mb-3 sm:mb-4 px-1 shrink-0">
                <h3 className="font-bold text-slate-700 text-sm sm:text-base">Belum Mulai</h3>
                <span className="bg-slate-200 text-slate-600 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">{belumMulai.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 flex flex-col gap-3">
                {isLoading ? <p className="text-xs text-center text-slate-400 py-10">Memuat...</p> : null}
                {belumMulai.map(tugas => (
                  <div key={tugas.id} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1.5 sm:mb-2 leading-tight">{tugas.nama_tugas}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 mb-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {tugas.penanggung_jawab}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-rose-500 font-medium mb-3 sm:mb-4">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Tenggat: {tugas.deadline}
                    </div>
                    {/* Tombol Aksi hanya untuk Admin */}
                    {isAdmin && (
                      <button onClick={() => updateStatus(tugas.id, "Sedang Dikerjakan")} className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-[10px] sm:text-xs py-1.5 sm:py-2 rounded-lg transition-colors">
                        Mulai Kerjakan ➔
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* KOLOM 2: SEDANG DIKERJAKAN */}
            <div className="bg-blue-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-blue-100 shadow-inner flex flex-col w-[280px] sm:w-auto shrink-0 h-full overflow-hidden">
              <div className="flex items-center justify-between mb-3 sm:mb-4 px-1 shrink-0">
                <h3 className="font-bold text-blue-800 text-sm sm:text-base">Sedang Dikerjakan</h3>
                <span className="bg-blue-200 text-blue-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">{sedangDikerjakan.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 flex flex-col gap-3">
                {sedangDikerjakan.map(tugas => (
                  <div key={tugas.id} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-blue-200 hover:border-blue-300 transition-colors">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1.5 sm:mb-2 leading-tight">{tugas.nama_tugas}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-500 mb-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {tugas.penanggung_jawab}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-blue-500 font-medium mb-3 sm:mb-4">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      Tenggat: {tugas.deadline}
                    </div>
                    {/* Tombol Aksi hanya untuk Admin */}
                    {isAdmin && (
                      <div className="flex gap-1.5 sm:gap-2">
                        <button onClick={() => updateStatus(tugas.id, "Belum Mulai")} className="flex-1 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold text-[9px] sm:text-[10px] py-1.5 sm:py-2 rounded-lg transition-colors">
                          Kembalikan
                        </button>
                        <button onClick={() => updateStatus(tugas.id, "Selesai")} className="flex-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold text-[9px] sm:text-[10px] py-1.5 sm:py-2 rounded-lg transition-colors">
                          Selesaikan ✓
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* KOLOM 3: SELESAI */}
            <div className="bg-emerald-50/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-emerald-100 shadow-inner flex flex-col w-[280px] sm:w-auto shrink-0 h-full overflow-hidden">
              <div className="flex items-center justify-between mb-3 sm:mb-4 px-1 shrink-0">
                <h3 className="font-bold text-emerald-800 text-sm sm:text-base">Selesai</h3>
                <span className="bg-emerald-200 text-emerald-800 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">{selesai.length}</span>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 flex flex-col gap-3">
                {selesai.map(tugas => (
                  <div key={tugas.id} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-emerald-200 opacity-75 hover:opacity-100 transition-opacity">
                    <h4 className="font-bold text-slate-600 text-xs sm:text-sm line-through decoration-slate-300 mb-1.5 sm:mb-2 leading-tight">{tugas.nama_tugas}</h4>
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-400 mb-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {tugas.penanggung_jawab}
                    </div>
                    {/* Tombol Hapus hanya untuk Admin */}
                    {isAdmin && (
                      <button onClick={() => hapusTugas(tugas.id)} className="w-full mt-3 sm:mt-4 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-[10px] sm:text-xs py-1.5 sm:py-2 rounded-lg transition-colors">
                        Hapus Arsip
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* POP-UP FORM TAMBAH TUGAS (Hanya Render Untuk Admin) */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100">
              <h3 className="font-bold text-base sm:text-lg text-slate-800">Tambah Tugas Baru</h3>
              <button onClick={tutupModal} className="text-slate-400 hover:text-rose-500 p-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <form onSubmit={handleSimpanTugas} className="flex flex-col gap-3 sm:gap-4 mb-2">
                
                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Nama Tugas</label>
                  <input type="text" required placeholder="Contoh: Buat desain pamflet" value={formData.nama_tugas} onChange={(e) => setFormData({...formData, nama_tugas: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Penanggung Jawab</label>
                  <input type="text" required placeholder="Contoh: Bidang PIP / Si Fulan" value={formData.penanggung_jawab} onChange={(e) => setFormData({...formData, penanggung_jawab: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Tenggat Waktu (Deadline)</label>
                  <input type="date" required value={formData.deadline} onChange={(e) => setFormData({...formData, deadline: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:border-[#007FA7] outline-none" />
                </div>

                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 border-t border-slate-100 pt-4">
                  <button type="button" onClick={tutupModal} className="w-full sm:w-auto px-5 py-2 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs sm:text-sm">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-5 py-2 font-bold text-white bg-[#007FA7] hover:bg-[#006080] rounded-xl text-xs sm:text-sm shadow-md disabled:opacity-70">
                    {isSubmitting ? "Menyimpan..." : "Simpan Tugas"}
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