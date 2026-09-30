// File: app/dashboard/agenda/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function AgendaPage() {
  const [kalenderEvents, setKalenderEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [formData, setFormData] = useState({ judul: "", tanggal: "", keterangan: "" });

  const fetchSemuaAgenda = async () => {
    setIsLoading(true);
    try {
      const { data: prokerData, error: prokerError } = await supabase.from("proker").select("nama_proker, tanggal"); 
      if (prokerError) throw prokerError;

      const { data: agendaData, error: agendaError } = await supabase.from("agenda_kegiatan").select("id, judul, tanggal, keterangan");
      if (agendaError) throw agendaError;

      const formatProker = (prokerData || []).map((item) => ({
        id: `proker-${item.nama_proker}`, 
        title: item.nama_proker, 
        date: item.tanggal, 
        type: "proker",
        color: "bg-blue-500",
        badge: "Program Kerja"
      }));

      const formatAgenda = (agendaData || []).map((item) => ({
        id: `agenda-${item.id}`,
        title: item.judul,
        date: item.tanggal,
        desc: item.keterangan,
        type: "manual",
        color: "bg-emerald-500",
        badge: "Agenda Tambahan"
      }));

      let semuaAgenda = [...formatProker, ...formatAgenda];
      semuaAgenda.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setKalenderEvents(semuaAgenda);
    } catch (error: any) {
      console.error("Gagal menarik data agenda:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === "admin@ipm.belik") setIsAdmin(true);
    };
    
    checkUserRole();
    fetchSemuaAgenda();
  }, []);

  const tutupModal = () => {
    setIsModalOpen(false);
    setFormData({ judul: "", tanggal: "", keterangan: "" });
  };

  const handleSimpanAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    if (!formData.judul || !formData.tanggal) return alert("Judul dan Tanggal wajib diisi!");

    setIsSubmitting(true);
    const { error } = await supabase.from("agenda_kegiatan").insert([formData]);

    if (!error) {
      alert("Agenda manual berhasil ditambahkan!");
      tutupModal();
      fetchSemuaAgenda(); 
    } else {
      alert("Gagal menyimpan agenda: " + error.message);
    }
    setIsSubmitting(false);
  };

  // ================= FUNGSI HAPUS AGENDA (BARU DITAMBAHKAN) =================
  const handleHapusAgenda = async (idString: string, tipe: string) => {
    if (!isAdmin) return; // Keamanan lapis pertama

    if (tipe === "proker") {
      alert("Program Kerja Utama hanya bisa dihapus melalui menu Program Kerja.");
      return;
    }

    const konfirmasi = window.confirm("Apakah kamu yakin ingin menghapus agenda tambahan ini?");
    if (!konfirmasi) return;

    // Ekstrak ID asli angka dari Supabase
    const idAsli = idString.replace("agenda-", "");
    
    const { error } = await supabase.from("agenda_kegiatan").delete().eq("id", idAsli);

    if (!error) {
      alert("Agenda berhasil dihapus!");
      fetchSemuaAgenda(); // Refresh data otomatis setelah dihapus
    } else {
      alert("Gagal menghapus agenda: " + error.message);
    }
  };
  // =========================================================================

  const formatTanggalCantik = (tanggalString: string) => {
    if (!tanggalString) return "Tanggal belum ditentukan";
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(tanggalString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="bg-slate-50 flex flex-col h-[calc(100vh-6rem)] sm:h-auto sm:min-h-screen p-2 sm:p-8">
      
      <div className="max-w-4xl mx-auto w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-10 relative flex flex-col h-full overflow-hidden sm:overflow-visible">
        
        {/* AREA HEADER */}
        <div className="shrink-0 mb-4 sm:mb-10 border-b border-slate-100 pb-4 sm:pb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors mb-4 sm:mb-8 shadow-sm border border-emerald-100 group"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          </Link>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Agenda Kegiatan</h2>
              <p className="text-slate-500 text-[10px] sm:text-sm mt-1 sm:mt-2">
                <span className="inline-flex items-center gap-1.5 mr-4"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Proker Utama</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Agenda Tambahan</span>
              </p>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
                Tambah Agenda
              </button>
            )}
          </div>
        </div>

        {/* AREA TIMELINE */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0 relative">
          <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 -translate-x-1/2"></div>
          
          {isLoading ? (
            <div className="py-20 text-center text-slate-400 font-medium animate-pulse">Memuat daftar agenda...</div>
          ) : kalenderEvents.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-10 text-center">
              <p className="text-slate-500 font-medium text-sm">Belum ada agenda kegiatan yang dijadwalkan.</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-8 pb-4">
              {kalenderEvents.map((item, index) => (
                <div key={item.id} className={`relative flex flex-col sm:flex-row items-center justify-between group ${index % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                  
                  <div className={`hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${item.color}`}></div>

                  <div className="hidden sm:block w-5/12"></div>

                  <div className="w-full sm:w-5/12">
                    <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group-hover:border-slate-200">
                      
                      {/* ================= TOMBOL HAPUS (BARU DITAMBAHKAN) ================= */}
                      {isAdmin && item.type === "manual" && (
                        <button
                          onClick={() => handleHapusAgenda(item.id, item.type)}
                          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-slate-300 hover:text-rose-500 bg-white hover:bg-rose-50 p-1.5 rounded-lg transition-all z-20"
                          title="Hapus Agenda"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      )}
                      {/* ==================================================================== */}

                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 sm:w-1.5 ${item.color}`}></div>
                      
                      <div className="ml-2 sm:ml-2 pr-6"> {/* Ditambahkan pr-6 agar teks tidak menabrak tombol hapus */}
                        <span className={`inline-block px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider mb-2 ${item.type === 'proker' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {item.badge}
                        </span>
                        <h3 className="text-sm sm:text-lg font-bold text-slate-800 mb-1 leading-tight">{item.title}</h3>
                        <p className="text-[10px] sm:text-sm font-medium text-slate-500 flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-3.5 sm:h-3.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                          {formatTanggalCantik(item.date)}
                        </p>
                        
                        {item.desc && (
                          <p className="mt-2 sm:mt-3 text-[11px] sm:text-sm text-slate-600 bg-slate-50 p-2 sm:p-3 rounded-xl border border-slate-100">
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* POP-UP FORM TAMBAH AGENDA MANUAL */}
        {isAdmin && isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              
              <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100">
                <h3 className="font-bold text-base sm:text-lg text-slate-800">Tambah Agenda Manual</h3>
                <button onClick={tutupModal} className="text-slate-400 hover:text-rose-500 p-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>

              <div className="p-4 sm:p-5">
                <form onSubmit={handleSimpanAgenda} className="flex flex-col gap-3 sm:gap-4 mb-2">
                  
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Judul Acara / Rapat</label>
                    <input type="text" required placeholder="Contoh: Rapat Evaluasi Bulanan" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-emerald-500 outline-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Tanggal Pelaksanaan</label>
                    <input type="date" required value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-emerald-500 outline-none" />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 mb-1.5 uppercase">Keterangan (Opsional)</label>
                    <textarea placeholder="Catatan tambahan..." value={formData.keterangan} onChange={(e) => setFormData({...formData, keterangan: e.target.value})} className="w-full border-2 border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-emerald-500 outline-none min-h-[60px] sm:min-h-[80px]" />
                  </div>

                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 mt-4 border-t border-slate-100 pt-4">
                    <button type="button" onClick={tutupModal} className="w-full sm:w-auto px-5 py-2 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs sm:text-sm">Batal</button>
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-5 py-2 font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs sm:text-sm shadow-md disabled:opacity-70">
                      {isSubmitting ? "Menyimpan..." : "Simpan Agenda"}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}